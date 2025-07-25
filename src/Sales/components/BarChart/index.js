import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './style.css';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const BarChart = ({ data, timeRange }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: 'Sales Amount (KES)',
        data: data.map(item => item.value),
        backgroundColor: '#AA0B0B',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 0.5
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: timeRange === 'month' ? 'Daily Sales for the Month' : 'Daily Sales for the Week',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (KES)',
        },
      },
      x: {
        title: {
          display: true,
          text: timeRange === 'month' ? 'Day of Month' : 'Day of Week',
        },
      },
    },
  };
  return (
    <div className="bar-chart">
      <Bar data={chartData} options={options} />
    </div>
  );
};
export default BarChart;