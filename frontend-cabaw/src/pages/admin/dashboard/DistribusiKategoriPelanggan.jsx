import { useEffect, useState } from "react";
import axios from "axios";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const DistribusiKategoriPelanggan = () => {
  const [dataKategori, setDataKategori] = useState(null);
  const [summary, setSummary] = useState({
    tinggi: 0,
    sedang: 0,
    rendah: 0,
  });

  const [loading, setLoading] = useState(true);

  const tahun = "2025";

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://127.0.0.1:8000/api/proses-perhitungan?tahun=${tahun}`
      );

      const hasil = res.data?.hasil_akhir || [];

      let tinggi = 0;
      let sedang = 0;
      let rendah = 0;

      hasil.forEach((item) => {
        const status = item.status_prioritas;

        if (status === "Prioritas Tinggi") tinggi++;
        else if (status === "Prioritas Sedang") sedang++;
        else rendah++;
      });

      setSummary({ tinggi, sedang, rendah });

      setDataKategori({
        labels: ["Tinggi", "Sedang", "Rendah"],
        datasets: [
          {
            data: [tinggi, sedang, rendah],
            backgroundColor: ["#FACC15", "#EC4899", "#1E3A5F"],
            hoverBackgroundColor: ["#EAB308", "#DB2777", "#27496D"],
            borderColor: "#ffffff",
            borderWidth: 4,
            hoverOffset: 20,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 🔥 penting biar tidak banyak whitespace
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        padding: 12,
        cornerRadius: 10,
      },
    },
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[30px] shadow-lg p-6">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#1E3A5F]">
          Distribusi Kategori Pelanggan
        </h2>
        <p className="text-sm text-slate-500">
          Visualisasi hasil Fuzzy TOPSIS {tahun}
        </p>
      </div>

      {/* KPI CARDS (INI YANG BIKIN AESTHETIC) */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-yellow-50 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-yellow-500 font-semibold">Tinggi</p>
            <p className="text-3xl font-extrabold text-yellow-600">
              {summary.tinggi}
            </p>
          </div>

          <div className="bg-pink-50 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-pink-500 font-semibold">Sedang</p>
            <p className="text-3xl font-extrabold text-pink-600">
              {summary.sedang}
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-[#1E3A5F] font-semibold">Rendah</p>
            <p className="text-3xl font-extrabold text-[#1E3A5F]">
              {summary.rendah}
            </p>
          </div>

        </div>
      )}

      {/* CHART */}
      <div className="h-[320px] relative">
        {loading ? (
          <p className="text-slate-400 animate-pulse text-center">
            Loading data...
          </p>
        ) : (
          <Pie data={dataKategori} options={options} />
        )}
      </div>
    </div>
  );
};