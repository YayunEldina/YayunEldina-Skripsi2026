import React, { useState, useEffect } from "react";
import NavbarAdmin from "../dashboard/navbar_admin";


const Perhitungan = () => {
  const [dataHitung, setDataHitung] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [tahunTerpilih, setTahunTerpilih] = useState(() => {
    return localStorage.getItem("tahunPerhitungan") || "2025";
  });
  
  // State filter bulan (default "5" untuk Mei sesuai awal mula SPK bulanan)
  const [bulanTerpilih, setBulanTerpilih] = useState(() => {
    return localStorage.getItem("bulanPerhitungan") || "1";
  });

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Tambahkan State Tab (Sesuai Revisi)
  const [activeTab, setActiveTab] = useState("fuzzy");

  const namaBulan = {
    "1": "Januari",
    "2": "Februari",
    "3": "Maret",
    "4": "April",
    "5": "Mei",
    "6": "Juni",
    "7": "Juli",
    "8": "Agustus",
    "9": "September",
    "10": "Oktober",
    "11": "November",
    "12": "Desember"
  };

  const fetchData = async (tahun, bulan) => {
    setLoading(true);
    try {
      // Mengonstruksi URL secara dinamis menggunakan parameter tahun dan bulan
      let url = `${import.meta.env.VITE_API_URL}/riwayat-perhitungan?tahun=${tahun}`;

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

  const generateData = async () => {
    setGenerating(true);
  
    try {
      let url =
        `${import.meta.env.VITE_API_URL}/proses-perhitungan?tahun=${tahunTerpilih}`;
  
      if (tahunTerpilih === "2026" && bulanTerpilih) {
        url += `&bulan=${bulanTerpilih}`;
      }
  
      const response = await fetch(url);
      const result = await response.json();
  
      if (result.status) {
        await fetchData(tahunTerpilih, bulanTerpilih);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  // Masukkan tahunTerpilih dan bulanTerpilih sebagai dependency useEffect
  useEffect(() => {
    fetchData(tahunTerpilih, bulanTerpilih);
  }, [tahunTerpilih, bulanTerpilih]);

  const filterData = (data) => {
    if (!searchTerm) return data;
  
    return data.filter((item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 2. Buat Data Tab (Sesuai Revisi)
  const tabs = [
    {
      id: "fuzzy",
      label: "Konversi Fuzzy",
    },
    {
      id: "normalisasi",
      label: "Normalisasi R",
    },
    {
      id: "terbobot",
      label: "Matriks Y",
    },
    {
      id: "ideal",
      label: "Solusi Ideal",
    },
    {
      id: "jarak",
      label: "Jarak D+/D-",
    },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <NavbarAdmin />

        <div className="px-10 mt-20">
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Perhitungan Pelanggan
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Generate dan lihat tahapan perhitungan Fuzzy TOPSIS
        </p>
      </div>

      <button
        onClick={generateData}
        disabled={generating}
        className="bg-[#1E3A5F] hover:bg-[#294972] text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md disabled:opacity-50"
      >
        {generating ? (
          "Generating..."
        ) : (
          "Generate Data"
        )}
      </button>

    </div>

  </div>
</div>



<div className="px-8 mt-5">
  <div className="flex flex-wrap items-center gap-5">

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

      {/* KIRI */}
      <div className="flex items-center flex-wrap gap-3">

        <span className="text-sm font-medium text-slate-500">
          {new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date())}
        </span>

        <div className="h-5 w-px bg-slate-300" />

        {/* TAHUN */}
        <select
          value={tahunTerpilih}
          onChange={(e) => {
            const value = e.target.value;
            setTahunTerpilih(value);
            localStorage.setItem("tahunPerhitungan", value);
          }}
          className="
            bg-white
            border
            border-slate-300
            rounded-xl
            px-4
            py-2.5
            text-sm
            font-medium
            text-slate-700
            shadow-sm
            focus:ring-2
            focus:ring-[#1E3A5F]
            focus:outline-none
          "
        >
          {[2021, 2022, 2023, 2024, 2025, 2026].map((tahun) => (
            <option key={tahun} value={tahun}>
              {tahun}
            </option>
          ))}
        </select>

        {/* BULAN KHUSUS 2026 */}
        {tahunTerpilih === "2026" && (
          <select
            value={bulanTerpilih}
            onChange={(e) => {
              setBulanTerpilih(e.target.value);
              localStorage.setItem(
                "bulanPerhitungan",
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
              font-medium
              text-slate-700
              shadow-sm
              focus:ring-2
              focus:ring-[#1E3A5F]
              focus:outline-none
            "
          >
            {Object.entries(namaBulan).map(([num, name]) => (
              <option key={num} value={num}>
                {name}
              </option>
            ))}
          </select>
        )}

      </div>

      {/* KANAN */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search alternatif..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-72
            pl-11
            pr-4
            py-2.5
            bg-white
            border
            border-slate-300
            rounded-xl
            text-sm
            focus:ring-2
            focus:ring-[#1E3A5F]
            focus:outline-none
          "
        />

        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
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


      {/* 3. MENU TAB MINIMALIS MELEBAR MEMENUHI LAYAR */}
<div className="px-8 mt-6">
  {/* Menggunakan w-full agar garis dasar abu-abu memanjang penuh */}
  <div className="flex w-full border-b border-gray-200">
    {tabs.map((tab) => {
      const isSelected = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          // 🔥 PERUBAHAN: Ditambahkan 'flex-1' dan 'text-center' agar membagi ruang sama rata dan teks di tengah
          className={`flex-1 text-center pb-3 text-sm font-semibold transition-all relative -mb-[1px] ${
            isSelected
              ? "text-[#1E3A5F] border-b-2 border-[#1E3A5F]"
              : "text-slate-400 hover:text-slate-600 border-b-2 border-transparent"
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
</div>

        {/* KONTEN UTAMA */}
        <div className="px-8 pb-10 mt-4">
          {dataHitung && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              
              {/* 4. Ganti Semua Section Menjadi Render Berdasarkan Tab (Sesuai Revisi) */}
              
              {/* TAB 1 - Konversi Fuzzy */}
              {activeTab === "fuzzy" && (
                <>
                  <Section title="Nilai Keterangan Kriteria Pelanggan yang Di Konversikan" />
                  <TableWrapper>
                    <Table
                      loading={loading}
                      headers={["Alternatif / Kriteria", "C1", "C2", "C3", "C4"]}
                      rows={filterData(dataHitung?.matriks_fuzzy || []).map((item) => [
                        item.nama,
                        item.C1,
                        item.C2,
                        item.C3,
                        item.C4,
                      ])}
                    />
                  </TableWrapper>
                </>
              )}

              {/* TAB 2 - Normalisasi R */}
              {activeTab === "normalisasi" && (
                <>
                  <Section title="Matrik Ternormalisasi R" />
                  <TableWrapper>
                    <Table
                      loading={loading}
                      headers={["Alternatif/Xij", "C1", "C2", "C3", "C4"]}
                      rows={filterData(dataHitung?.matriks_r || []).map((item) => [
                        item.nama,
                        item.C1,
                        item.C2,
                        item.C3,
                        item.C4,
                      ])}
                    />
                  </TableWrapper>
                </>
              )}

              {/* TAB 3 - Matriks Y */}
              {activeTab === "terbobot" && (
                <>
                  <Section title="Matrik Ternormalisasi Terbobot Y" />

                  <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700 mb-4 italic">
                    * Matriks ini merupakan hasil perkalian Matriks R dengan Bobot Fuzzy Kriteria.
                  </div>

                  <TableWrapper>
                    <Table
                      loading={loading}
                      headers={["Alternatif/rij", "C1", "C2", "C3", "C4"]}
                      rows={filterData(dataHitung?.matriks_r || []).map((item) => [
                        item.nama,
                        item.C1,
                        item.C2,
                        item.C3,
                        item.C4,
                      ])}
                    />
                  </TableWrapper>
                </>
              )}

              {/* TAB 4 - Solusi Ideal */}
              {activeTab === "ideal" && (
                <>
                  <Section title="Solusi Ideal Positif (+) dan Negatif (-)" />

                  <TableWrapper>
                    <Table
                      loading={loading}
                      headers={[" ", "C1", "C2", "C3", "C4"]}
                      rows={[
                        ["y +j", "(1,1,1)", "(1,1,1)", "(1,1,1)", "(1,1,1)"],
                        ["y -j", "(0,0,0)", "(0,0,0)", "(0,0,0)", "(0,0,0)"],
                      ]}
                    />
                  </TableWrapper>
                </>
              )}

              {/* TAB 5 - Jarak D+ D- */}
              {activeTab === "jarak" && (
                <>
                  <Section title="Menghitung Jarak Nilai Alternatif Positif (+) dan Negatif (-)" />

                  <TableWrapper>
                    <Table
                      loading={loading}
                      headers={["Alternatif", "D+", "D-"]}
                      rows={filterData(dataHitung?.hasil_akhir || []).map((item) => [
                        item.nama,
                        item.d_plus,
                        item.d_min,
                      ])}
                    />
                  </TableWrapper>
                </>
              )}
              
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