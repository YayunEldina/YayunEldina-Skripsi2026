import React, { useState, useEffect } from 'react';

export const LoyalCustomerSection = () => {
  const [yearlyRankings, setYearlyRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const daftarTahun = ["2025", "2024", "2023", "2022", "2021"];

  useEffect(() => {
    const fetchAllYears = async () => {
      setLoading(true);
      try {
        // Mengambil data untuk setiap tahun secara paralel
        const requests = daftarTahun.map(tahun =>
          fetch(`http://127.0.0.1:8000/api/proses-perhitungan?tahun=${tahun}`)
            .then(res => res.json())
            .then(result => ({
              year: tahun,
              // Kita hanya ambil 3 besar (Top 3) saja untuk Dashboard
              top3: (result.hasil_akhir || []).slice(0, 3).map((item, index) => ({
                rank: index + 1,
                nama: item.nama,
                nilai: item.nilai_v
              }))
            }))
        );

        const allResults = await Promise.all(requests);
        setYearlyRankings(allResults);
      } catch (error) {
        console.error("Gagal mengambil data histori:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllYears();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-slate-500">Sinkronisasi Data Histori...</div>;
  }

  return (
    <div className="w-full space-y-6 mb-10">
      <div className="flex justify-between items-center px-2">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800">Histori Peringkat Pelanggan (Realtime)</h2>
          <p className="text-xs text-slate-500">Data otomatis diambil dari hasil perhitungan database</p>
        </div>
        <span className="text-[10px] bg-[#1E3A5F] text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          Fuzzy TOPSIS Mode
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {yearlyRankings.map((history, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden flex flex-col hover:border-blue-300 transition-all">
            <div className={`p-3 text-center text-xs font-black text-white ${idx === 0 ? 'bg-[#1E3A5F]' : 'bg-slate-600'}`}>
              TAHUN {history.year}
            </div>
            
            <div className="p-3 space-y-3 bg-gradient-to-b from-white to-slate-50 flex-1">
              {history.top3.length > 0 ? (
                history.top3.map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-2 rounded-xl border border-slate-100 bg-white shadow-sm">
                    <div className={`text-[9px] font-black uppercase mb-1 ${i === 0 ? 'text-orange-500' : 'text-slate-400'}`}>
                      Rank {item.rank}
                    </div>
                    <div className="text-xs font-bold text-slate-700 truncate w-full">{item.nama}</div>
                    <div className="text-[10px] font-mono text-blue-600 font-semibold mt-1">
                      V: {item.nilai.toString().replace(".", ",")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[10px] text-center text-slate-400 py-4 italic">Tidak ada data</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};