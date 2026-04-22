import React, { useState, useEffect } from "react";
import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

const Perhitungan = () => {
  const [dataHitung, setDataHitung] = useState(null);
  const [tahunTerpilih, setTahunTerpilih] = useState("2021");
  const [loading, setLoading] = useState(true);

  const fetchData = async (tahun) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/proses-perhitungan?tahun=${tahun}`);
      const result = await response.json();
      setDataHitung(result);
    } catch (error) {
      console.error("Error fetching calculation:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(tahunTerpilih);
  }, [tahunTerpilih]);

  return (
    <div className="flex min-h-screen bg-white">
      <SidebarNavigationSection />

      <div className="flex-1 ml-[280px]">
        <NavbarAdmin />

        <div className="pt-[70px] px-0">
          <TampilanElemen />
        </div>

        <div className="px-8 mt-6 flex justify-between items-center">
          <button className="bg-[#1E3A5F] text-white px-6 py-2 rounded-full text-sm font-medium">
            Perhitungan Pelanggan (Real-time)
          </button>
        </div>

        {/* FILTER TAHUN */}
        <div className="flex items-center px-8 mt-6">
          <div className="flex gap-2">
            {["2021", "2022", "2023", "2024", "2025"].map((y, i) => (
              <button
                key={i}
                onClick={() => setTahunTerpilih(y)}
                className={`px-5 py-2 rounded-full border text-sm transition-all ${
                  y === tahunTerpilih ? "bg-[#1E3A5F] text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="px-8 pb-10 mt-6">
          {loading ? (
            <div className="mt-10 text-center text-slate-500 italic animate-pulse">
              Menyinkronkan data & menghitung Tahapan Fuzzy TOPSIS...
            </div>
          ) : dataHitung ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-10">
              
              {/* TAHAP 1: KONVERSI FUZZY */}
              <Section title="Nilai Keterangan Kriteria Pelanggan yang Di Konversikan" />
              <TableWrapper>
                <Table
                  headers={["Alternatif / Kriteria", "C1", "C2", "C3", "C4"]}
                  rows={dataHitung?.matriks_fuzzy?.map((item) => [
                    item.nama, item.C1, item.C2, item.C3, item.C4
                  ]) || []}
                />
              </TableWrapper>

              {/* TAHAP 2: NORMALISASI R */}
              <Section title="Matrik Ternormalisasi R" />
              <TableWrapper>
                <Table
                  headers={["Xij", "C1", "C2", "C3", "C4"]}
                  rows={dataHitung?.matriks_r?.map((item) => [
                    item.nama, item.C1, item.C2, item.C3, item.C4
                  ]) || []}
                />
              </TableWrapper>

              {/* TAHAP 3: MATRIKS TERBOBOT (Sesuai Logika Backend kamu) */}
              <Section title="Matrik Ternormalisasi Terbobot Y" />
              <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700 mb-4 italic">
                * Matriks ini merupakan hasil perkalian Matriks R dengan Bobot Fuzzy Kriteria.
              </div>
              <TableWrapper>
                <Table
                  headers={["rij", "C1", "C2", "C3", "C4"]}
                  rows={dataHitung?.matriks_r?.map((item) => [
                    item.nama, item.C1, item.C2, item.C3, item.C4
                  ]) || []} 
                />
              </TableWrapper>

              {/* TAHAP 4: SOLUSI IDEAL */}
              <Section title="Solusi Ideal Positif (+) dan Negatif (-)" />
              <TableWrapper>
                <Table
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
                  headers={["Alternatif", "D+", "D-"]}
                  rows={dataHitung?.hasil_akhir?.map((item) => [
                    item.nama, item.d_plus, item.d_min
                  ]) || []}
                />
              </TableWrapper>
              
            </div>
          ) : null}
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
  <div className="overflow-x-auto border border-slate-200 rounded-lg mb-8 shadow-sm">{children}</div>
);

const Table = ({ headers, rows }) => (
  <table className="min-w-full text-sm">
    <thead className="bg-slate-50">
      <tr>
        {headers.map((h, i) => (
          <th key={i} className="px-6 py-4 border-b text-center font-bold text-slate-700 uppercase tracking-wider">{h}</th>
        ))}
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
      {rows.map((row, i) => (
        <tr key={i} className="hover:bg-slate-50 transition-colors">
          {row.map((cell, j) => (
            <td key={j} className="px-6 py-4 text-center text-slate-600 font-medium">{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Perhitungan;