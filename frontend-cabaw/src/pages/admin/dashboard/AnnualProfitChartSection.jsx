import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export const AnnualProfitChartSection = () => {
  const data = {
    labels: ["Januari", "Februari", "Maret", "April", "Mei"],
    datasets: [
      {
        label: "2021",
        data: [25, 100, 40, 90, 60],
        borderColor: "#6366F1",
        backgroundColor: "rgba(99,102,241,0.15)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "2022",
        data: [70, 95, 15, 60, 40],
        borderColor: "#F97316",
        backgroundColor: "rgba(249,115,22,0.15)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "2023",
        data: [80, 20, 80, 60, 100],
        borderColor: "#22C55E",
        backgroundColor: "rgba(34,197,94,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-[28px] p-6 shadow-md h-[420px]">
      <h3 className="font-semibold mb-4">Total Keuntungan Tahunan</h3>
      <Line data={data} options={options} />
    </div>
  );
};
