import React, { useState, useEffect } from "react";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

const Perhitungan = () => {
  const [dataHitung, setDataHitung] = useState(null);
  const [tahunTerpilih, setTahunTerpilih] = useState(() => {
    return localStorage.getItem("tahunPerhitungan") || "2025";
  });
  
  // 🔥 TAMBAHAN: State filter bulan (default "5" untuk Mei sesuai awal mula SPK bulanan)
  const [bulanTerpilih, setBulanTerpilih] = useState(() => {
    return localStorage.getItem("bulanPerhitungan") || "5";
  });

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const namaBulan = {
    "5": "Mei", "6": "Juni", "7": "Juli", "8": "Agustus",
    "9": "September", "10": "Oktober", "11": "November", "12": "Desember"
  };

  const fetchData = async (tahun, bulan) => {
    setLoading(true);
    try {
      // 🔥 REVISI: Mengonstruksi URL secara dinamis menggunakan parameter tahun dan bulan
      let url = `http://127.0.0.1:8000/api/proses-perhitungan?tahun=${tahun}`;

      // Filter bulan hanya dikirimkan jika memilih tahun 2026
      if (tahun === "2026" && bulan) {
        url += `&bulan=${bulan}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      setDataHitung(result);
    } catch (error) {
      console.error("Error fetching calculation:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 REVISI: Masukkan tahunTerpilih dan bulanTerpilih sebagai dependency useEffect
  useEffect(() => {
    fetchData(tahunTerpilih, bulanTerpilih);
  }, [tahunTerpilih, bulanTerpilih]);

  const filterData = (data) => {
    if (!searchTerm) return data;
  
    return data.filter((item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

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

        <div className="px-8 mt-6 flex justify-between items-center">
          <button className="bg-[#1E3A5F] text-white px-6 py-2 rounded-full text-sm font-medium">
            Perhitungan Pelanggan 
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
                  localStorage.setItem("tahunPerhitungan", y);
                }}
                className={`px-5 py-2 rounded-full border text-sm transition-all ${
                  y === tahunTerpilih ? "bg-[#1E3A5F] text-white" : "bg-white text-slate-600 hover:bg-slate-50"
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
                  localStorage.setItem("bulanPerhitungan", e.target.value);
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

        {/* INFORMASI PERIODE AKTIF */}
        <div className="px-8 mt-4">
          <div className="text-sm font-semibold text-gray-500 bg-slate-50 inline-block px-4 py-1.5 rounded-md border border-slate-200">
            Periode Data: <span className="text-[#1E3A5F]">{tahunTerpilih === "2026" ? `${namaBulan[bulanTerpilih]} 2026` : `Tahunan ${tahunTerpilih}`}</span>
          </div>
        </div>

        <div className="px-8 pb-10 mt-4">
          {dataHitung && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-10">
              
              {/* TAHAP 1: KONVERSI FUZZY */}
              <Section title="Nilai Keterangan Kriteria Pelanggan yang Di Konversikan" />
              <TableWrapper>
                <Table
                  loading={loading}
                  headers={["Alternatif / Kriteria", "C1", "C2", "C3", "C4"]}
                  rows={filterData(dataHitung?.matriks_fuzzy || []).map((item) => [
                    item.nama, item.C1, item.C2, item.C3, item.C4
                  ]) || []}
                />
              </TableWrapper>

              {/* TAHAP 2: NORMALISASI R */}
              <Section title="Matrik Ternormalisasi R" />
              <TableWrapper>
                <Table
                  loading={loading}
                  headers={["Alternatif/Xij", "C1", "C2", "C3", "C4"]}
                  rows={filterData(dataHitung?.matriks_r || []).map((item) => [
                    item.nama, item.C1, item.C2, item.C3, item.C4
                  ]) || []}
                />
              </TableWrapper>

              {/* TAHAP 3: MATRIKS TERBOBOT */}
              <Section title="Matrik Ternormalisasi Terbobot Y" />
              <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700 mb-4 italic">
                * Matriks ini merupakan hasil perkalian Matriks R dengan Bobot Fuzzy Kriteria.
              </div>
              <TableWrapper>
                <Table
                  loading={loading}
                  headers={["Alternatif/rij", "C1", "C2", "C3", "C4"]}
                  rows={filterData(dataHitung?.matriks_r || []).map((item) => [
                    item.nama, item.C1, item.C2, item.C3, item.C4
                  ])}
                />
              </TableWrapper>

              {/* TAHAP 4: SOLUSI IDEAL */}
              <Section title="Solusi Ideal Positif (+) dan Negatif (-)" />
              <TableWrapper>
                <Table
                  loading={loading}
                  headers={[" ", "C1", "C2", "C3", "C4"]}
                  rows={[
                    ["y +j", "(1,1,1)", "(1,1,1)", "(1,1,1)", "(1,1,1)"],
                    ["y -j", "(0,0,0)", "(0,0,0)", "(0,0,0)", "(0,0,0)"]
                  ]}
                />
              </TableWrapper>

              {/* TAHAP 5: JARAK D+ DAN D- */}
              <Section title="Menghitung Jarak Nilai Alternatif Positif (+) dan Negatif (-)" />
              <TableWrapper>
                <Table
                  loading={loading}
                  headers={["Alternatif", "D+", "D-"]}
                  rows={filterData(dataHitung?.hasil_akhir || []).map((item) => [
                    item.nama, item.d_plus, item.d_min
                  ])}
                />
              </TableWrapper>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- UI COMPONENTS --- */
const Section = ({ title }) => (
  <h2 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-[#1E3A5F] pl-3">{title}</h2>
);

const TableWrapper = ({ children }) => (
  <div className="overflow-x-auto border border-gray-300 bg-white mb-8">
    {children}
  </div>
);

const Table = ({ headers, rows, loading }) => (
  <table className="w-full text-sm border-collapse">
    {/* HEADER */}
    <thead className="bg-[#F8FAFC]">
      <tr>
        {headers.map((h, i) => (
          <th
            key={i}
            className="border border-gray-300 px-4 py-3 text-center text-slate-700 font-semibold"
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
            className="border border-gray-300 text-center py-10 italic text-gray-500"
          >
            Menyinkronkan data & menghitung Tahapan Fuzzy TOPSIS...
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
                className="border border-gray-300 px-4 py-3 text-center text-slate-600"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan={headers.length}
            className="border border-gray-300 text-center py-10 text-gray-400 italic"
          >
            Tidak ada data
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default Perhitungan;