import React, { useState, useEffect } from "react";
import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

const Perhitungan = () => {
  // 1. State untuk data dan filter tahun
  const [dataHitung, setDataHitung] = useState(null);
  const [tahunTerpilih, setTahunTerpilih] = useState("2021");
  const [loading, setLoading] = useState(true);

  // 2. Fungsi Fetch Data dari Backend
  const fetchData = async (tahun) => {
    setLoading(true);
    try {
      // Pastikan URL ini sesuai dengan route di api.php Laravel kamu
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

        <div className="px-8 mt-6">
          <button className="bg-[#1E3A5F] text-white px-6 py-2 rounded-full text-sm font-medium">
            Perhitungan Pelanggan
          </button>
        </div>

        {/* FILTER TAHUN */}
        <div className="flex items-center justify-between px-8 mt-6">
          <div className="flex gap-2">
            {["2021", "2022", "2023", "2024", "2025"].map((y, i) => (
              <button
                key={i}
                onClick={() => setTahunTerpilih(y)}
                className={`px-5 py-2 rounded-full border text-sm transition-all ${
                  y === tahunTerpilih
                    ? "bg-[#1E3A5F] text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="px-8 pb-10">
          {loading ? (
            <div className="mt-10 text-center text-slate-500">
              Menghitung Data Fuzzy TOPSIS Tahun {tahunTerpilih}...
            </div>
          ) : dataHitung ? (
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-8">
              <h1 className="text-xl font-semibold text-slate-800">
                Nilai Keterangan Kriteria Pelanggan yang Di Konversikan ({tahunTerpilih})
              </h1>

              {/* TABLE 1: Matriks Awal (Fuzzifikasi) */}
              <TableWrapper>
                <Table
                  headers={["Alternatif / Kriteria", "C1", "C2", "C3", "C4"]}
                  rows={dataHitung?.matriks_fuzzy?.map((item) => [
                    item.nama,
                    item.c1,
                    item.c2,
                    item.c3,
                    item.c4,
                  ]) || []}
                />
              </TableWrapper>

              <Section title="Matrik Ternormalisasi R" />
              <TableWrapper>
                <Table
                  headers={["Xij", "C1", "C2", "C3", "C4"]}
                  rows={dataHitung?.matriks_r?.map((item) => [
                    item.nama,
                    item.c1,
                    item.c2,
                    item.c3,
                    item.c4,
                  ]) || []}
                />
              </TableWrapper>

              <Section title="Matrik Ternormalisasi terbobot Y" />
              <TableWrapper>
                <Table
                  headers={["rij", "C1", "C2", "C3", "C4"]}
                  rows={dataHitung?.matriks_v?.map((item) => [
                    item.nama,
                    // Menggunakan Optional Chaining agar tidak blank jika v_data belum ada
                    item.v_data?.c1 ? `(${item.v_data.c1.join(", ")})` : "-",
                    item.v_data?.c2 ? `(${item.v_data.c2.join(", ")})` : "-",
                    item.v_data?.c3 ? `(${item.v_data.c3.join(", ")})` : "-",
                    item.v_data?.c4 ? `(${item.v_data.c4.join(", ")})` : "-",
                  ]) || []}
                />
              </TableWrapper>

              <Section title="Solusi Ideal Positif (+) dan Negatif (-)" />
              <TableWrapper>
                <Table
                  headers={["", "C1", "C2", "C3", "C4"]}
                  rows={[
                    ["y+", "(1,1,1)", "(1,1,1)", "(1,1,1)", "(1,1,1)"],
                    ["y-", "(0,0,0)", "(0,0,0)", "(0,0,0)", "(0,0,0)"],
                  ]}
                />
              </TableWrapper>

              <Section title="Menghitung Jarak Nilai Alternatif Positif (+) dan Negatif (-)" />
              <TableWrapper>
                <Table
                  headers={["Alternatif", "D+", "D-", "Nilai V (Preferensi)"]}
                  rows={dataHitung?.hasil_akhir?.map((item) => [
                    item.nama,
                    item.d_plus,
                    item.d_min,
                    item.nilai_v,
                  ]) || []}
                />
              </TableWrapper>
            </div>
          ) : (
            <div className="mt-10 text-center text-red-500">
              Gagal memuat data. Periksa koneksi ke Backend Laravel.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS (Sesuai UI Kamu) ================= */
const Section = ({ title }) => (
  <h2 className="text-lg font-semibold text-slate-700 mt-4">{title}</h2>
);

const TableWrapper = ({ children }) => (
  <div className="overflow-x-auto border border-[#E5E5EA] rounded-lg">
    {children}
  </div>
);

const Table = ({ headers, rows }) => (
  <table className="min-w-full text-sm border-collapse">
    <thead className="bg-slate-50 text-slate-700">
      <tr>
        {headers.map((h, i) => (
          <th key={i} className="px-4 py-3 border border-[#E5E5EA] text-center font-semibold">
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.length > 0 ? (
        rows.map((row, i) => (
          <tr key={i} className="hover:bg-slate-50">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-3 border border-[#E5E5EA] text-center">
                {cell}
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={headers.length} className="px-4 py-10 text-center text-slate-400 italic">
            Data tidak ditemukan
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default Perhitungan;