import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import _ from "lodash";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to format date as 'YYYY-MM-DD'
const formatDate = (timestamp) =>
  new Date(timestamp).toISOString().split("T")[0];

const TrendingJobTitlesChart = React.memo(({ jobData }) => {
  // Memoize data processing to prevent re-calculation on every render
  const { labels, datasets } = useMemo(() => {
    // Group job postings by date
    const groupedByDay = _.groupBy(jobData, (job) =>
      formatDate(job.datePosted)
    );

    // Count occurrences of each job title
    const titleCounts = {};
    jobData.forEach((job) => {
      titleCounts[job.title] = (titleCounts[job.title] || 0) + 1;
    });

    // Get the top 5 most frequent job titles
    const topTitles = Object.keys(titleCounts)
      .sort((a, b) => titleCounts[b] - titleCounts[a])
      .slice(0, 5);

    // Calculate daily trends for top job titles
    const dailyTitleTrends = {};
    Object.keys(groupedByDay).forEach((day) => {
      const jobsInDay = groupedByDay[day];
      topTitles.forEach((title) => {
        dailyTitleTrends[title] = dailyTitleTrends[title] || {};
        dailyTitleTrends[title][day] = jobsInDay.filter(
          (job) => job.title === title
        ).length;
      });
    });

    // Prepare labels (days) and datasets for Chart.js
    const labels = Object.keys(groupedByDay).sort(); // Sorted list of days
    const datasets = topTitles.map((title) => ({
      label: title,
      data: labels.map((day) => dailyTitleTrends[title][day] || 0),
      fill: false,
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color for each line
      tension: 0.1,
    }));

    return { labels, datasets };
  }, [jobData]);

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Trending Job Titles Over Time",
      },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Frequency" }, beginAtZero: true },
    },
  };

  return (
    <div className="chart-container" style={{ maxWidth: "600px" }}>
      <Line data={{ labels, datasets }} options={options} />
    </div>
  );
});

export default TrendingJobTitlesChart;
