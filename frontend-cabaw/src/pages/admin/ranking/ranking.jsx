import React, { useState, useEffect } from "react";
import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

const Ranking = () => {
  const [dataHitung, setDataHitung] = useState([]);
  const [tahunTerpilih, setTahunTerpilih] = useState(() => {
    return localStorage.getItem("tahunRanking") || "2025";
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async (tahun) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/proses-perhitungan?tahun=${tahun}`);
      const result = await response.json();
      // Mengambil hasil_akhir yang sudah berisi rank, status_prioritas, dan diskon dari backend
      setDataHitung(result.hasil_akhir || []);
    } catch (error) {
      console.error("Gagal memuat data ranking:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(tahunTerpilih);
  }, [tahunTerpilih]);

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

        {/* FILTER TAHUN */}
        <div className="flex items-center justify-between px-8 mt-6">
          <div className="flex gap-2">
            {["2021", "2022", "2023", "2024", "2025"].map((y, i) => (
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
        </div>

        <div className="px-6 pb-10 mt-6">
        <div className="space-y-6">
            <h1 className="text-xl font-semibold text-slate-800">
              Nilai Preferensi / Ranking Tahun {tahunTerpilih}
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
                    item.nilai_v.toString().replace(".", ","),
                    item.rank, // Menggunakan rank dari backend
                    item.status_prioritas, // Langsung dari backend (Sesuai Tabel 3.16)
                    `${item.diskon}%`, // Menampilkan diskon (15%, 10%, 5%, atau 0%)
                  ])}
                />
              </TableWrapper>
            
            {!loading && dataHitung.length === 0 && (
              <div className="text-center py-4 text-red-500 text-sm">
                Tidak ada data transaksi pada tahun {tahunTerpilih}
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