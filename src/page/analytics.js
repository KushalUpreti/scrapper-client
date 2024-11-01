import LocationHeatMap from "../stats/LocationHeatMap";
import RemoteJobPieChart from "../stats/RemoteJobPieChart";
import SkillTrendsChart from "../stats/SkillTrendsChart";
import TopCompaniesBarChart from "../stats/TopCompaniesBarChart";
import TopSkillsBarChart from "../stats/TopSkillsBarChart";
import TrendingJobTitlesChart from "../stats/TrendingJobTitlesChart";

export const Analytics = ({ data }) => {
  return (
    <>
      {data && (
        <div>
          <SkillTrendsChart jobData={data} />
          <RemoteJobPieChart jobData={data} />
          <TopSkillsBarChart jobData={data} />
          <TrendingJobTitlesChart jobData={data} />
          <TopCompaniesBarChart jobData={data} />
          <LocationHeatMap jobData={data} />
        </div>
      )}
    </>
  );
};
