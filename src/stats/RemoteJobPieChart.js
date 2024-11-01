import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const RemoteJobPieChart = React.memo(({ jobData }) => {
  // Memoize data processing to prevent re-calculation on every render
  const { remoteCount, nonRemoteCount } = useMemo(() => {
    let remoteCount = 0;
    let nonRemoteCount = 0;

    // Count remote and non-remote jobs
    jobData.forEach((job) => {
      if (job.location.toLowerCase() === "remote") {
        remoteCount++;
      } else {
        nonRemoteCount++;
      }
    });

    return { remoteCount, nonRemoteCount };
  }, [jobData]);

  // Prepare data for the Pie chart
  const data = {
    labels: ["Remote", "Non-Remote"],
    datasets: [
      {
        label: "Job Type Distribution",
        data: [remoteCount, nonRemoteCount],
        backgroundColor: ["#4CAF50", "#FF5722"], // Colors for the pie chart segments
        hoverOffset: 4,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            `${tooltipItem.label}: ${tooltipItem.raw} jobs`,
        },
      },
      title: {
        display: true,
        text: "Remote vs. Non-Remote Job Distribution",
      },
    },
  };

  return (
    <div className="chart-container" style={{ maxWidth: "300px" }}>
      <Pie data={data} options={options} />
    </div>
  );
});

export default RemoteJobPieChart;
