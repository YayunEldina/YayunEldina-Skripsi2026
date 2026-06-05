import React, { useState, useEffect } from "react";
import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

const Ranking = () => {
  const [dataHitung, setDataHitung] = useState([]);
  const [tahunTerpilih, setTahunTerpilih] = useState(() => {
    return localStorage.getItem("tahunRanking") || "2025";
  });
  
  // 🔥 TAMBAHAN: State filter bulan (default "5" untuk Mei sesuai awal SPK bulanan)
  const [bulanTerpilih, setBulanTerpilih] = useState(() => {
    return localStorage.getItem("bulanRanking") || "5";
  });

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const namaBulan = {
    "5": "Mei", "6": "Juni", "7": "Juli", "8": "Agustus",
    "9": "September", "10": "Oktober", "11": "November", "12": "Desember"
  };

  const fetchData = async (tahun, bulan) => {
    setLoading(true);
    try {
      // 🔥 REVISI: Menggunakan kombinasi parameter tahun dan bulan secara dinamis
      let url = `http://127.0.0.1:8000/api/proses-perhitungan?tahun=${tahun}`;

      // Filter bulan hanya dikirimkan jika memilih tahun 2026
      if (tahun === "2026" && bulan) {
        url += `&bulan=${bulan}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      setDataHitung(result.hasil_akhir || []);
    } catch (error) {
      console.error("Gagal memuat data ranking:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 REVISI: Masukkan tahunTerpilih dan bulanTerpilih sebagai dependency useEffect
  useEffect(() => {
    fetchData(tahunTerpilih, bulanTerpilih);
  }, [tahunTerpilih, bulanTerpilih]);

  const filteredData = dataHitung.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <NavbarAdmin />

        <div className="pt-[70px] px-0">
          <TampilanElemen
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="px-6 mt-6">
          <button className="bg-[#1E3A5F] text-white px-6 py-2 rounded-full text-sm font-medium">
            Ranking Pelanggan
          </button>
        </div>

        {/* CONTAINER FILTER TAHUN & BULAN */}
        <div className="flex flex-wrap items-center gap-4 px-8 mt-6">
          {/* FILTER TAHUN */}
          <div className="flex gap-2">
            {["2021", "2022", "2023", "2024", "2025", "2026"].map((y, i) => (
              <button
                key={i}
                onClick={() => {
                  setTahunTerpilih(y);
                  localStorage.setItem("tahunRanking", y);
                }}
                className={`px-5 py-2 rounded-full border text-sm transition ${
                  y === tahunTerpilih
                    ? "bg-[#1E3A5F] text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* 🔥 TAMBAHAN: FILTER BULAN DINAMIS (Hanya tampil jika memilih tahun 2026) */}
          {tahunTerpilih === "2026" && (
            <div className="flex items-center gap-2 animate-fadeIn">
              <label className="text-sm font-medium text-slate-600">Bulan:</label>
              <select
                value={bulanTerpilih}
                onChange={(e) => {
                  setBulanTerpilih(e.target.value);
                  localStorage.setItem("bulanRanking", e.target.value);
                }}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-slate-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
              >
                {Object.entries(namaBulan).map(([num, name]) => (
                  <option key={num} value={num}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="px-6 pb-10 mt-6">
          <div className="space-y-6">
            <h1 className="text-xl font-semibold text-slate-800">
              Nilai Preferensi / Ranking {" "}
              <span className="text-[#1E3A5F]">
                {tahunTerpilih === "2026" ? `${namaBulan[bulanTerpilih]} 2026` : `Tahun ${tahunTerpilih}`}
              </span>
            </h1>

            <TableWrapper>
              <Table
                loading={loading}
                headers={[
                  "Alternatif",
                  "Preferensi (V)",
                  "Ranking",
                  "Prioritas Sistem",
                  "Diskon",
                ]}
                rows={filteredData.map((item) => [
                  item.nama,
                  (item.nilai_v || 0).toString().replace(".", ","),
                  item.rank, 
                  item.status_prioritas, 
                  `${item.diskon}%`, 
                ])}
              />
            </TableWrapper>
            
            {!loading && dataHitung.length === 0 && (
              <div className="text-center py-4 text-red-500 text-sm">
                Tidak ada data transaksi pada periode {tahunTerpilih === "2026" ? `${namaBulan[bulanTerpilih]} 2026` : tahunTerpilih}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;

/* ================= REUSABLE COMPONENTS ================= */

const TableWrapper = ({ children }) => (
  <div className="overflow-x-auto border border-gray-300 bg-white">
    {children}
  </div>
);

const Table = ({ headers, rows, loading }) => (
  <table className="w-full text-sm border-collapse">
    {/* HEADER KOLOM */}
    <thead className="bg-[#F8FAFC]">
      <tr>
        {headers.map((h, i) => (
          <th
            key={i}
            className="border border-gray-300 px-4 py-3 text-center"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {loading ? (
        <tr>
          <td
            colSpan={headers.length}
            className="border border-gray-300 text-center py-10 text-slate-500 italic"
          >
            Memproses Data Fuzzy TOPSIS...
          </td>
        </tr>
      ) : rows.length > 0 ? (
        rows.map((row, i) => (
          <tr
            key={i}
            className="hover:bg-gray-50 transition"
          >
            {row.map((cell, j) => (
              <td
                key={j}
                className="border border-gray-300 px-4 py-3 text-slate-700 text-center"
              >
                {/* WARNA PRIORITAS */}
                {cell === "Prioritas Tinggi" ? (
                  <span className="text-green-600 font-semibold">
                    {cell}
                  </span>
                ) : cell === "Prioritas Sedang" ? (
                  <span className="text-yellow-600 font-semibold">
                    {cell}
                  </span>
                ) : cell === "Prioritas Rendah" ? (
                  <span className="text-blue-600 font-semibold">
                    {cell}
                  </span>
                ) : cell === "Tidak Prioritas" ? (
                  <span className="text-red-500 font-semibold">
                    {cell}
                  </span>
                ) : (
                  cell
                )}
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan={headers.length}
            className="border border-gray-300 text-center py-10 text-red-500 italic"
          >
            Tidak ada data ranking
          </td>
        </tr>
      )}
    </tbody>
  </table>
);