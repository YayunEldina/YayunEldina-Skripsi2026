import React, { useState, useEffect } from "react";

export const LoyalCustomerSection = () => {
  const [topRankings, setTopRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  const tahunTerbaru = "2025";

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/proses-perhitungan?tahun=${tahunTerbaru}`
        );

        const result = await response.json();

        // Ambil Top 3
        const top3 = (result.hasil_akhir || [])
          .slice(0, 3)
          .map((item, index) => ({
            rank: index + 1,
            nama: item.nama,
            nilai: item.nilai_v,
            diskon: item.diskon || 0,
          }));

        setTopRankings(top3);

      } catch (error) {
        console.error("Gagal mengambil data ranking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="w-full mb-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Top 3 Pelanggan Loyal {tahunTerbaru}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Berdasarkan hasil perhitungan metode Fuzzy TOPSIS
          </p>
        </div>

        <div className="bg-[#1E3A5F] text-white px-4 py-2 rounded-full text-xs font-bold">
          FUZZY TOPSIS
        </div>
      </div>

      {/* CARD */}
      {/* CARD */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-5">

{(loading ? [1,2,3] : topRankings).map((item, index) => (
  <div
    key={index}
    className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
  >

    {loading ? (
      <>
        {/* Skeleton Loading */}
        <div className="animate-pulse">

          <div className="flex justify-between mb-4">
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>

          <div className="h-6 w-40 bg-gray-200 rounded mb-5"></div>

          <div className="space-y-3">

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-20 bg-gray-300 rounded"></div>
            </div>

            <div className="bg-green-50 rounded-xl p-3 border border-green-100">
              <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-14 bg-gray-300 rounded"></div>
            </div>

          </div>
        </div>
      </>
    ) : (
      <>
        {/* RANK */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`px-4 py-1 rounded-full text-xs font-bold text-white
            ${
              item.rank === 1
                ? "bg-yellow-500"
                : item.rank === 2
                ? "bg-slate-400"
                : "bg-orange-400"
            }`}
          >
            Rank {item.rank}
          </div>

          <div className="text-xs text-slate-400">
            Tahun {tahunTerbaru}
          </div>
        </div>

        {/* NAMA */}
        <h3 className="text-lg font-bold text-[#1E3A5F] mb-4">
          {item.nama}
        </h3>

        {/* DETAIL */}
        <div className="space-y-3">

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">
              Nilai Preferensi
            </p>

            <p className="font-bold text-blue-700">
              {parseFloat(item.nilai).toFixed(4)}
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-3 border border-green-100">
            <p className="text-xs text-slate-500 mb-1">
              Diskon
            </p>

            <p className="font-bold text-green-600">
              {item.diskon}%
            </p>
          </div>

        </div>
      </>
    )}

  </div>
))}

</div>
    </div>
  );
};