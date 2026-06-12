import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const SummaryCardsSection = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_pelanggan: 0,
    total_kriteria: 0,
    total_transaksi: 0,
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/dashboard-summary`)
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const cards = [
    {
      label: "Total Pelanggan",
      value: stats.total_pelanggan,
      icon: "👥",
      color: "bg-blue-500",
      link: "/admin/alternatif",
    },
    {
      label: "Total Kriteria",
      value: stats.total_kriteria,
      icon: "📊",
      color: "bg-green-500",
      link: "/admin/kriteria",
    },
    {
      label: "Total Transaksi",
      value: stats.total_transaksi,
      icon: "🛒",
      color: "bg-purple-500",
      link: "/admin/transaksi",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          onClick={() => navigate(card.link)}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl text-white ${card.color}`}>
              {card.icon}
            </div>

            <div>
              <p className="text-sm text-slate-500 font-medium">
                {card.label}
              </p>

              <h3 className="text-2xl font-bold text-slate-800">
                {card.value.toLocaleString("id-ID")}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};