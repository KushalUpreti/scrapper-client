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

const TopCompaniesBarChart = React.memo(({ jobData }) => {
  // Memoize data processing to prevent re-calculation on every render
  const { companyLabels, companyCounts } = useMemo(() => {
    const companyFrequency = {};

    // Count occurrences of each company in job postings
    jobData.forEach((job) => {
      const company = job.company;
      companyFrequency[company] = (companyFrequency[company] || 0) + 1;
    });

    // Sort companies by frequency and take the top 10
    const topCompanies = Object.entries(companyFrequency)
      .sort(([, a], [, b]) => b - a) // Sort by frequency in descending order
      .slice(0, 10); // Take the top 10 companies

    // Extract labels and counts for Chart.js
    const companyLabels = topCompanies.map(([company]) => company);
    const companyCounts = topCompanies.map(([, count]) => count);

    return { companyLabels, companyCounts };
  }, [jobData]);

  // Prepare data for the horizontal Bar chart
  const data = {
    labels: companyLabels,
    datasets: [
      {
        label: "Number of Postings",
        data: companyCounts,
        backgroundColor: "#74b9ff",
        borderColor: "#0984e3",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    indexAxis: "y", // This makes the chart horizontal
    responsive: true,
    plugins: {
      legend: {
        display: false, // No need for a legend with only one dataset
      },
      title: {
        display: true,
        text: "Top Companies Hiring",
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Number of Postings" },
        beginAtZero: true,
      },
      y: {
        title: { display: true, text: "Company" },
      },
    },
  };

  return (
    <div className="chart-container" style={{ width: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  );
});

export default TopCompaniesBarChart;
