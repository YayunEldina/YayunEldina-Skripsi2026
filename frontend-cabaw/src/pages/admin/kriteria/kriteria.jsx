import { useState, useEffect } from "react";
import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

const Kriteria = () => {
  const [dataKriteria, setDataKriteria] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Ambil data dari backend
  useEffect(() => {
    const fetchKriteria = async () => {
      try {
        // PERBAIKAN URL: Menggunakan /api/kriteria sesuai hasil tes browser kamu
        const response = await fetch("http://127.0.0.1:8000/api/kriteria");
        const result = await response.json();
        
        // Memastikan result.success true dan result.data adalah array
        if (result.success && Array.isArray(result.data)) {
          setDataKriteria(result.data);
        } else {
          console.error("Format data tidak sesuai:", result);
        }
      } catch (error) {
        console.error("Gagal mengambil data kriteria:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKriteria();
  }, []);

  // Deskripsi statis untuk tabel bagian bawah
  const deskripsiKriteria = {
    "C1": "Jumlah keseluruhan produk yang dibeli pelanggan dalam periode tertentu.",
    "C2": "Besarnya omzet yang dihasilkan dari transaksi pelanggan.",
    "C3": "Jumlah transaksi yang dilakukan pelanggan dalam periode tertentu.",
    "C4": "Tingkat kestabilan jumlah pembelian pelanggan dari bulan ke bulan.",
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SidebarNavigationSection />

      <div className="flex-1 ml-[280px]">
        <NavbarAdmin />

        <div className="pt-[70px] px-0">
          <TampilanElemen />
        </div>

        {/* TITLE TAG */}
        <div className="px-8 mt-6">
          <button className="bg-[#1E3A5F] text-white px-6 py-2 rounded-full text-sm font-medium">
            Kriteria Pelanggan
          </button>
        </div>

        {/* TABLE 1: DATA UTAMA KRITERIA */}
        <div className="px-8 mt-6">
          <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-slate-700 border-b border-[#E5E5EA]">
                <tr>
                  <th className="px-6 py-4 font-bold text-center">Kode Kriteria</th>
                  <th className="px-6 py-4 font-bold text-center">Nama Kriteria</th>
                  <th className="px-6 py-4 font-bold text-center">Bobot Kriteria</th>
                  <th className="px-6 py-4 font-bold text-center">Bobot Kriteria Fuzzy</th>
                  <th className="px-6 py-4 font-bold text-center">Attribut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5EA]">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-slate-500 italic">
                      Memuat data kriteria...
                    </td>
                  </tr>
                ) : dataKriteria.length > 0 ? (
                  dataKriteria.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-center font-semibold text-[#1E3A5F]">{item.kode_kriteria}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{item.nama_kriteria}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{item.bobot}</td>
                      <td className="px-6 py-4 text-center font-mono text-blue-600">{item.bobot_fuzzy}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-4 py-1 rounded-full text-xs font-bold ${
                            item.atribut === "Benefit"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {item.atribut}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-red-500 italic">
                      Data kriteria kosong atau tidak dapat diakses.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE 2: KETERANGAN DESKRIPTIF */}
        <div className="px-8 mt-10 pb-10">
          <h2 className="text-lg font-bold text-slate-800 mb-4 pl-2">Keterangan Detail Kriteria</h2>
          <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-slate-700 border-b border-[#E5E5EA]">
                <tr>
                  <th className="px-6 py-4 font-bold text-center w-1/4">Nama Kriteria</th>
                  <th className="px-6 py-4 font-bold text-left">Keterangan Kriteria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5EA]">
                {loading ? (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-slate-500 italic">Menyiapkan keterangan...</td>
                  </tr>
                ) : (
                  dataKriteria.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-center font-bold text-slate-700">
                        {item.nama_kriteria}
                      </td>
                      <td className="px-6 py-4 text-slate-600 leading-relaxed text-justify">
                        {deskripsiKriteria[item.kode_kriteria] || "Tidak ada keterangan tambahan."}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kriteria;