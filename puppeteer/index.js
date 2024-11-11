const puppeteer = require("puppeteer-extra");
const { Storage } = require("@google-cloud/storage");
const express = require("express");

const storage = new Storage();
const bucketName = "scrapper-bucket-kushal-upreti";
const schemaFileName = "schema.json";

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const app = express();
const port = process.env.PORT || 8080;

async function loadSchemaFromBucket() {
  const schemaFile = storage.bucket(bucketName).file(schemaFileName);
  const contents = await schemaFile.download();
  return JSON.parse(contents[0]);
}

async function scrapeSite(website, url, jobListSelector, selectors) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // await page.setUserAgent(
  //   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
  // );
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const html = await page.content();
  console.log(html);

  // Wait for the job list to appear
  await page.waitForSelector(jobListSelector, { timeout: 10000 });

  // Scrape the data from the job list using the selectors array
  const jobs = await extractJobsFromPage(
    website,
    page,
    jobListSelector,
    selectors
  );
  await browser.close();
  return jobs;
}

const extractJobsFromPage = async (
  website,
  page,
  jobListSelector,
  selectors
) => {
  const jobs = await page.evaluate(
    ({ jobListSelector, selectors, website }) =>
      Array.from(document.querySelector(jobListSelector).childNodes).map(
        (job) =>
          selectors.reduce((data, { value, selector, property }) => {
            const element = job.querySelector(selector);
            data[value] = element ? element[property] : "";
            data["datePosted"] = Date.now();
            data["website"] = website;
            return data;
          }, {})
      ),
    { jobListSelector, selectors, website }
  );
  return jobs;
};

const jobScraper = async (req, res) => {
  let schema;
  try {
    schema = await loadSchemaFromBucket();
  } catch (error) {
    return res.status(500).send("Error: " + error.toString());
  }

  let allJobData = [];

  for (const site of schema) {
    try {
      const siteData = await scrapeSite(
        site.website,
        site.url,
        site.jobList,
        site.selectors
      );
      allJobData = [...allJobData, ...siteData];
    } catch (error) {
      return res.status(500).send("Error: " + error.toString());
    }
  }

  try {
    await saveDataToCloudStorage(allJobData, `job_data_${Date.now()}.json`);
  } catch (error) {
    return res.status(500).send("Error: " + error.toString());
  }
  return res
    .status(200)
    .send(`job_data_${Date.now()}.json created successfully`);
};

async function saveDataToCloudStorage(data, fileName) {
  const filePath = `scrapped-data/${fileName}`;
  await storage.bucket(bucketName).file(filePath).save(JSON.stringify(data));
}

app.get("/scrape", jobScraper);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
