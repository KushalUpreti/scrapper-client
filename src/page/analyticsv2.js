import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import SkillTrendsChart from "../stats/SkillTrendsChart";
import TrendingJobTitlesChart from "../stats/TrendingJobTitlesChart";
import TopCompaniesBarChart from "../stats/TopCompaniesBarChart";
import RemoteJobPieChart from "../stats/RemoteJobPieChart";
import TopSkillsBarChart from "../stats/TopSkillsBarChart";
import LocationHeatMap from "../stats/LocationHeatMap";

export const AnalyticsV2 = ({ data }) => {
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalEmployers, setTotalEmployers] = useState(0);
  const [locations, setLocations] = useState(0);

  useEffect(() => {
    if (!data) {
      return;
    }
    const uniqueEmployers = _.uniqBy(data, "company").length;
    const uniqueLocations = _.uniqBy(data, "location").length;
    const totalJobPostings = data.length;
    setTotalJobs(totalJobPostings);
    setTotalEmployers(uniqueEmployers);
    setLocations(uniqueLocations);
  }, [data]);

  return (
    <div>
      <aside
        id="default-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-indigo-700">
          <ul class="space-y-2 font-medium">
            <li>
              <Link
                to={"/"}
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span class="ms-3">Dashboard</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <div class="p-4 sm:ml-64">
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class=" bg-gray-50 rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
            <div className=" flex max-w-xs flex-col gap-y-2 py-2 px-4">
              <p className="text-base/7 text-gray-600">Jobs Scraped</p>
              <p className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {totalJobs}
              </p>
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
            <div className="flex max-w-xs flex-col gap-y-2 py-2 px-4">
              <p className="text-base/7 text-gray-600">
                Companies with Job Postings
              </p>
              <p className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {totalEmployers}
              </p>
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
            <div className="flex max-w-xs flex-col gap-y-2 py-2 px-4">
              <p className="text-base/7 text-gray-600">Locations around USA</p>
              <p className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {locations}
              </p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="flex items-center rounded-lg rounded bg-gray-50 h-96 p-2 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
            {data && <SkillTrendsChart jobData={data} />}
          </div>
          <div class="flex items-center rounded-lg bg-gray-50 h-96 p-2 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
            {data && <TopCompaniesBarChart jobData={data} />}
          </div>
          <div class="flex items-center rounded-lg justify-center rounded bg-gray-50 h-72 p-2 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
            {data && <RemoteJobPieChart jobData={data} />}
          </div>
          <div class="flex items-center rounded-lg justify-center rounded bg-gray-50 h-72 p-2 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
            {data && <TopSkillsBarChart jobData={data} />}
          </div>
        </div>
        <div class="flex items-center  h-96 mb-4 rounded bg-gray-50 ">
          {data && <LocationHeatMap jobData={data} />}
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center justify-center rounded bg-gray-50 h-96 rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] p-2">
            {data && <TrendingJobTitlesChart jobData={data} />}
          </div>

          {/* <div class="flex items-center justify-center rounded bg-gray-50 h-28 "></div> */}
        </div>
      </div>
    </div>
  );
};
