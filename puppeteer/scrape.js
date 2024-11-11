// const puppeteer = require("puppeteer");
const express = require("express");
const fs = require("fs");
const puppeteer = require("puppeteer-extra");
const { Storage } = require("@google-cloud/storage");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const app = express();
const port = process.env.PORT || 8080;

// Example of schema hardcoded, you can load this dynamically from Cloud Storage
const schema = [
  {
    website: "Indeed",
    url: "https://www.indeed.com/jobs?q=java&l=United+States&radius=50&fromage=1&start=10",
    jobList: ".css-1faftfv, eu4oa1w0",
    selectors: [
      {
        value: "title",
        selector: ".jobTitle, css-1psdjh5",
        property: "innerText",
      },
      {
        value: "company",
        selector: ".css-1h7lukg.eu4oa1w0",
        property: "innerText",
      },
      {
        value: "location",
        selector: ".css-1restlb.eu4oa1w0",
        property: "innerText",
      },
      { value: "url", selector: ".jobTitle > a", property: "href" },
    ],
    actions: null,
  },
  {
    website: "Indeed",
    url: "https://www.indeed.com/jobs?q=java&l=United+States&radius=50&fromage=1&start=20",
    jobList: ".css-1faftfv, eu4oa1w0",
    selectors: [
      {
        value: "title",
        selector: ".jobTitle, css-1psdjh5",
        property: "innerText",
      },
      {
        value: "company",
        selector: ".css-1h7lukg.eu4oa1w0",
        property: "innerText",
      },
      {
        value: "location",
        selector: ".css-1restlb.eu4oa1w0",
        property: "innerText",
      },
      { value: "url", selector: ".jobTitle > a", property: "href" },
    ],
    actions: null,
  },
  {
    website: "Indeed",
    url: "https://www.indeed.com/jobs?q=java&l=United+States&radius=50&fromage=1&start=30",
    jobList: ".css-1faftfv, eu4oa1w0",
    selectors: [
      {
        value: "title",
        selector: ".jobTitle, css-1psdjh5",
        property: "innerText",
      },
      {
        value: "company",
        selector: ".css-1h7lukg.eu4oa1w0",
        property: "innerText",
      },
      {
        value: "location",
        selector: ".css-1restlb.eu4oa1w0",
        property: "innerText",
      },
      { value: "url", selector: ".jobTitle > a", property: "href" },
    ],
    actions: null,
  },
  {
    website: "Indeed",
    url: "https://www.indeed.com/jobs?q=java&l=United+States&radius=50&fromage=1&start=40",
    jobList: ".css-1faftfv, eu4oa1w0",
    selectors: [
      {
        value: "title",
        selector: ".jobTitle, css-1psdjh5",
        property: "innerText",
      },
      {
        value: "company",
        selector: ".css-1h7lukg.eu4oa1w0",
        property: "innerText",
      },
      {
        value: "location",
        selector: ".css-1restlb.eu4oa1w0",
        property: "innerText",
      },
      { value: "url", selector: ".jobTitle > a", property: "href" },
    ],
    actions: null,
  },
  {
    website: "Indeed",
    url: "https://www.indeed.com/jobs?q=java&l=United+States&radius=50&fromage=1&start=50",
    jobList: ".css-1faftfv, eu4oa1w0",
    selectors: [
      {
        value: "title",
        selector: ".jobTitle, css-1psdjh5",
        property: "innerText",
      },
      {
        value: "company",
        selector: ".css-1h7lukg.eu4oa1w0",
        property: "innerText",
      },
      {
        value: "location",
        selector: ".css-1restlb.eu4oa1w0",
        property: "innerText",
      },
      { value: "url", selector: ".jobTitle > a", property: "href" },
    ],
    actions: null,
  },
  {
    website: "Indeed",
    url: "https://www.indeed.com/jobs?q=java&l=United+States&radius=50&fromage=1&start=60",
    jobList: ".css-1faftfv, eu4oa1w0",
    selectors: [
      {
        value: "title",
        selector: ".jobTitle, css-1psdjh5",
        property: "innerText",
      },
      {
        value: "company",
        selector: ".css-1h7lukg.eu4oa1w0",
        property: "innerText",
      },
      {
        value: "location",
        selector: ".css-1restlb.eu4oa1w0",
        property: "innerText",
      },
      { value: "url", selector: ".jobTitle > a", property: "href" },
    ],
    actions: null,
  },
  {
    website: "Indeed",
    url: "https://www.indeed.com/jobs?q=java&l=United+States&radius=50&fromage=1&start=70",
    jobList: ".css-1faftfv, eu4oa1w0",
    selectors: [
      {
        value: "title",
        selector: ".jobTitle, css-1psdjh5",
        property: "innerText",
      },
      {
        value: "company",
        selector: ".css-1h7lukg.eu4oa1w0",
        property: "innerText",
      },
      {
        value: "location",
        selector: ".css-1restlb.eu4oa1w0",
        property: "innerText",
      },
      { value: "url", selector: ".jobTitle > a", property: "href" },
    ],
    actions: null,
  },
];

async function scrapeSite(website, url, jobListSelector, selectors) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  //   const ua =
  //     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
  //   await page.setUserAgent(ua);
  //   await page.setExtraHTTPHeaders({
  //     "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
  //   });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  // await delay(40000);
  await page.waitForSelector(jobListSelector, { timeout: 5000 });
  const jobs = await extractJobsFromPage(
    website,
    page,
    jobListSelector,
    selectors
  );
  await browser.close();
  return jobs;
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
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
    } catch (err) {
      return res.status(500).send("Error: " + err.toString());
    }
  }

  //   console.log(allJobData);

  // try {
  //   await saveDataToCloudStorage(allJobData, `job_data_${Date.now()}.json`);
  // } catch (error) {
  //   return res.status(500).send("Error: " + error.toString());
  // }
  return res.send(allJobData);
};

async function saveDataToCloudStorage(data, fileName) {
  const storage = new Storage();
  const bucketName = "scrapper-bucket-kushal-upreti";
  const filePath = `scrapped-data/${fileName}`;
  await storage.bucket(bucketName).file(filePath).save(JSON.stringify(data));
}

app.get("/scrape", jobScraper);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
