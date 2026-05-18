import { useEffect, useState } from "react";
import axios from "axios";

import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

export const AnnualProfitChartSection = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchOmsetTahunan();
  }, []);

  const fetchOmsetTahunan = async () => {
    try {
  
      const res = await axios.get(
        "http://127.0.0.1:8000/api/omset-tahunan"
      );
  
      const hasil = res.data;
  
      setChartData({
        labels: hasil.map(item => item.tahun),
  
        datasets: [
          {
            data: hasil.map(item => item.total_omset),
  
            borderColor: "#1E3A5F",
  
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 350);
  
              gradient.addColorStop(0, "rgba(30,58,95,0.35)");
              gradient.addColorStop(1, "rgba(30,58,95,0)");
  
              return gradient;
            },
  
            fill: true,
            tension: 0.45,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: "#1E3A5F",
            pointBorderWidth: 3,
            pointBorderColor: "#FFFFFF",
            borderWidth: 4,
          },
        ],
      });
  
    } catch (error) {
      console.error("Gagal mengambil omset:", error);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#64748B",
          font: {
            size: 12,
            weight: "600",
          },
        },
      },

      y: {
        beginAtZero: true,

        grid: {
          color: "rgba(148,163,184,0.1)",
        },

        ticks: {
          callback: function (value) {
            return "Rp " + value / 1000000 + " Jt";
          },

          color: "#64748B",
        },
      },
    },
  };

  const omsetTerbaru =
    chartData?.datasets[0]?.data[4] || 0;

  const omsetSebelumnya =
    chartData?.datasets[0]?.data[3] || 0;

  return (
    <div className="bg-white rounded-[30px] border border-slate-200 shadow-sm p-6 h-full">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-8">

        <div>
          <h2 className="text-xl font-bold text-[#1E3A5F]">
            Grafik Omset Tahunan
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Statistik total pendapatan transaksi
          </p>
        </div>

        <div className="bg-[#1E3A5F] text-white text-xs font-bold px-4 py-2 rounded-full">
          REALTIME DATA
        </div>
      </div>

      {/* CARD OMSET */}
      <div className="grid grid-cols-2 gap-4 mb-8">

        {/* 2025 */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#284B73] p-5 text-white shadow-lg">

          <p className="text-sm opacity-80 mb-2">
            Omset Tahun 2025
          </p>

          <h2 className="text-3xl font-bold">
          Rp {parseFloat(omsetTerbaru || 0).toLocaleString("id-ID")}
          </h2>

          <p className="text-xs mt-3 opacity-70">
            Pendapatan terbaru
          </p>
        </div>

        {/* 2024 */}
        <div className="rounded-2xl bg-slate-100 border border-slate-200 p-5">

          <p className="text-sm text-slate-500 mb-2">
            Omset Tahun 2024
          </p>

          <h2 className="text-3xl font-bold text-[#1E3A5F]">
          Rp {parseFloat(omsetSebelumnya || 0).toLocaleString("id-ID")}
          </h2>

          <p className="text-xs mt-3 text-slate-400">
            Data tahun sebelumnya
          </p>
        </div>

      </div>

      {/* GRAFIK */}
      <div className="h-[320px]">
        {chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            Memuat grafik...
          </div>
        )}
      </div>
    </div>
  );
};