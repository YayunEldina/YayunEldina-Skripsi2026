import React, { useState, useEffect } from "react"; // Tambahkan useState & useEffect
import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

const Ranking = () => {
  // 1. STATE UNTUK DATA DAN LOADING
  const [dataHitung, setDataHitung] = useState([]);
  const [tahunTerpilih, setTahunTerpilih] = useState("2021");
  const [loading, setLoading] = useState(false);

  // 2. FUNGSI AMBIL DATA DARI BACKEND
  const fetchData = async (tahun) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/proses-perhitungan?tahun=${tahun}`);
      const result = await response.json();
      // Kita ambil bagian 'hasil_akhir' dari response JSON backend
      setDataHitung(result.hasil_akhir || []);
    } catch (error) {
      console.error("Gagal memuat data ranking:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. JALANKAN FETCH SAAT HALAMAN DIBUKA ATAU TAHUN BERUBAH
  useEffect(() => {
    fetchData(tahunTerpilih);
  }, [tahunTerpilih]);

  // 4. LOGIKA TAMBAHAN UNTUK PRIORITAS & DISKON (CONTOH)
  const getStatusPrioritas = (nilaiV) => {
    if (nilaiV >= 0.7) return { status: "Prioritas Tinggi", diskon: "15%" };
    if (nilaiV >= 0.5) return { status: "Prioritas Sedang", diskon: "10%" };
    return { status: "Prioritas Rendah", diskon: "5%" };
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SidebarNavigationSection />

      <div className="flex-1 ml-[280px] pt-[50px]">
        <NavbarAdmin />

        <div className="px-6 pt-4">
          <TampilanElemen />
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
                onClick={() => setTahunTerpilih(y)} // Klik untuk ganti tahun
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
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6 border border-[#E5E5EA]">
            <h1 className="text-xl font-semibold text-slate-800">
              Nilai Preferensi / Ranking Tahun {tahunTerpilih}
            </h1>

            {loading ? (
              <div className="text-center py-10 text-slate-500">Memproses Data Fuzzy TOPSIS...</div>
            ) : (
              <TableWrapper>
                <Table
                  headers={[
                    "Alternatif",
                    "Preferensi (V)",
                    "Ranking",
                    "Prioritas Sistem",
                    "Diskon",
                  ]}
                  // 5. MAPPING DATA DARI BACKEND KE BARIS TABEL
                  rows={dataHitung.map((item, index) => {
                    const info = getStatusPrioritas(item.nilai_v);
                    return [
                      item.nama,
                      item.nilai_v.toString().replace(".", ","), // Ubah titik ke koma untuk tampilan
                      index + 1, // Karena sudah diurutkan backend, index+1 adalah ranking
                      info.status,
                      info.diskon,
                    ];
                  })}
                />
              </TableWrapper>
            )}
            
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

/* ================= REUSABLE (TETAP SAMA) ================= */

const TableWrapper = ({ children }) => (
  <div className="overflow-x-auto border border-[#E5E5EA] rounded-xl">
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
      {rows.map((row, i) => (
        <tr key={i} className="hover:bg-slate-50 transition">
          {row.map((cell, j) => (
            <td key={j} className="px-4 py-3 border border-[#E5E5EA] text-center">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);