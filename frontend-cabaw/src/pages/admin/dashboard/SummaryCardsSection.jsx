// SummaryCardsSection.jsx
export const SummaryCardsSection = () => {
  const stats = [
    { label: "Total Pelanggan", value: "150", icon: "👥", color: "bg-blue-500" },
    { label: "Total Kriteria", value: "4", icon: "📊", color: "bg-green-500" }, // C1-C4
    { label: "Total Transaksi", value: "1,240", icon: "🛒", color: "bg-purple-500" },
    { label: "Omzet Tahunan", value: "Rp 540jt", icon: "💰", color: "bg-orange-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl text-white ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};