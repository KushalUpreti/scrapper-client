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

// Helper function to generate a random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const SkillTrendsChart = React.memo(({ jobData }) => {
  // Memoize data processing to prevent re-calculation on every render
  const { labels, datasets } = useMemo(() => {
    if (!jobData) {
      return { labels: "", datasets: [] };
    }
    // Helper function to format date as 'YYYY-MM-DD'
    const formatDate = (timestamp) =>
      new Date(timestamp).toISOString().split("T")[0];

    // Group job data by day
    const groupedByDay = _.groupBy(jobData, (job) =>
      formatDate(job.datePosted)
    );

    // Calculate skill trends per day
    const skillCounts = {};
    const dailySkillTrends = {};

    // Step 1: Count occurrences of each skill overall
    jobData.forEach((job) => {
      if (job.skills) {
        const skills = job.skills.replace("Skills: ", "").split(", ");
        skills.forEach((skill) => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });

    // Step 2: Get the top 7 skills
    const topSkills = Object.keys(skillCounts)
      .sort((a, b) => skillCounts[b] - skillCounts[a])
      .slice(0, 7);

    // Step 3: Filter daily trends to only include top 7 skills
    Object.keys(groupedByDay).forEach((day) => {
      const jobsInDay = groupedByDay[day];
      jobsInDay.forEach((job) => {
        if (job.skills) {
          const skills = job.skills.replace("Skills: ", "").split(", ");
          skills.forEach((skill) => {
            if (topSkills.includes(skill)) {
              if (!dailySkillTrends[skill]) {
                dailySkillTrends[skill] = {};
              }
              dailySkillTrends[skill][day] =
                (dailySkillTrends[skill][day] || 0) + 1;
            }
          });
        }
      });
    });

    // Step 4: Prepare labels (days) and datasets for Chart.js
    const labels = Object.keys(groupedByDay).sort(); // Sorted list of days
    const datasets = topSkills.map((skill) => ({
      label: skill,
      data: labels.map((day) => dailySkillTrends[skill][day] || 0),
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.3,
    }));

    return { labels, datasets };
  }, [jobData]); // Dependencies array, will re-run only if jobData changes

  // Chart.js options
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Top 7 Skills Required Over Time",
        },
      },
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: { title: { display: true, text: "Frequency" } },
      },
    }),
    []
  );

  return (
    <>
      <div style={{ width: "100%" }}>
        <Line data={{ labels, datasets }} options={options} />
      </div>
    </>
  );
});

export default SkillTrendsChart;
