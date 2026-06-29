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
      let url =
`${import.meta.env.VITE_API_URL}/ranking?tahun=${tahun}`;
      // Filter bulan hanya dikirimkan jika memilih tahun 2026
      if (tahun === "2026" && bulan) {
        url += `&bulan=${bulan}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      setDataHitung(result.data || []);
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

        <div className="px-10 mt-20">
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
    <div>
      <h1 className="text-2xl font-bold text-slate-800">
        Ranking Pelanggan
      </h1>

      <p className="text-slate-500 text-sm mt-1">
        Hasil prioritas pelanggan berdasarkan perhitungan Fuzzy TOPSIS
      </p>
    </div>
  </div>
</div>

       

        {/* CONTAINER FILTER TAHUN & BULAN */}
        <div className="flex flex-wrap items-center gap-4 px-8 mt-6">
        <div className="mt-5">
  <div className="flex items-center flex-wrap gap-4">

    <span className="text-sm font-medium text-slate-500">
      {new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date())}
    </span>

    <div className="h-5 w-px bg-slate-300" />

    {/* Tahun */}
    <select
      value={tahunTerpilih}
      onChange={(e) => {
        setTahunTerpilih(e.target.value);
        localStorage.setItem(
          "tahunRanking",
          e.target.value
        );
      }}
      className="
      bg-white
      border
      border-slate-300
      rounded-xl
      px-4
      py-2.5
      text-sm
      shadow-sm
      "
    >
      {[2021,2022,2023,2024,2025,2026].map((tahun) => (
        <option
          key={tahun}
          value={tahun}
        >
          {tahun}
        </option>
      ))}
    </select>

    {/* Bulan */}
    {tahunTerpilih === "2026" && (
      <select
        value={bulanTerpilih}
        onChange={(e) => {
          setBulanTerpilih(e.target.value);
          localStorage.setItem(
            "bulanRanking",
            e.target.value
          );
        }}
        className="
        bg-white
        border
        border-slate-300
        rounded-xl
        px-4
        py-2.5
        text-sm
        shadow-sm
        "
      >
        {Object.entries(namaBulan).map(([num,name]) => (
          <option
            key={num}
            value={num}
          >
            {name}
          </option>
        ))}
      </select>
    )}

    {/* Search */}
    <div className="relative">
      <input
        type="text"
        placeholder="Search alternatif..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        className="
        w-72
        pl-10
        pr-4
        py-2.5
        border
        border-slate-300
        rounded-xl
        text-sm
        "
      />

      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.5 5.5a7.5 7.5 0 0011.15 11.15z"
        />
      </svg>
    </div>

  </div>
</div>

        
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
                  "Total Pembelian (C1)",
                  "Preferensi (V)",
                  "Ranking",
                  "Prioritas Sistem",
                  "Diskon",
                ]}
                rows={filteredData.map((item) => [
                  item.nama,
                  Number(item.total_pembelian || 0).toLocaleString("id-ID"),
                  Number(item.nilai_v).toFixed(5).replace(".", ","),
                  item.ranking,
                  item.prioritas, 
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