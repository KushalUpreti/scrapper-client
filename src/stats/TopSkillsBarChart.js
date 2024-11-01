import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TopSkillsBarChart = React.memo(({ jobData }) => {
  // Memoize data processing to prevent re-calculation on every render
  const { skillLabels, skillCounts } = useMemo(() => {
    const skillFrequency = {};

    // Count occurrences of each skill across all job postings
    jobData.forEach((job) => {
      const skills = job.skills.replace("Skills: ", "").split(", ");
      skills.forEach((skill) => {
        skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
      });
    });

    // Sort skills by frequency and take the top 7
    const topSkills = Object.entries(skillFrequency)
      .sort(([, a], [, b]) => b - a) // Sort by frequency in descending order
      .slice(0, 7); // Take the top 7 skills

    // Extract labels and counts for Chart.js
    const skillLabels = topSkills.map(([skill]) => skill);
    const skillCounts = topSkills.map(([, count]) => count);

    return { skillLabels, skillCounts };
  }, [jobData]);

  // Prepare data for the Bar chart
  const data = {
    labels: skillLabels,
    datasets: [
      {
        label: "Frequency",
        data: skillCounts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // No need for a legend with only one dataset
      },
      title: {
        display: true,
        text: "Top 7 Most Requested Skills",
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Skills" },
      },
      y: {
        title: { display: true, text: "Frequency" },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container" style={{ maxWidth: "600px" }}>
      <Bar data={data} options={options} />
    </div>
  );
});

export default TopSkillsBarChart;
