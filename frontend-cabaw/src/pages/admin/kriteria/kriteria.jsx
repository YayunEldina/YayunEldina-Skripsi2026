import { useState, useEffect } from "react";
import NavbarAdmin from "../dashboard/navbar_admin";

const Kriteria = () => {
  const [dataKriteria, setDataKriteria] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Ambil data dari backend
  useEffect(() => {
    const fetchKriteria = async () => {
      try {
        // PERBAIKAN URL: Menggunakan /api/kriteria sesuai hasil tes browser kamu
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kriteria`);
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

      <div className="flex-1">
        <NavbarAdmin />

        {/* TITLE TAG */}
        <div className="px-8 mt-25">
          <button className="bg-[#1E3A5F] text-white px-6 py-2 rounded-full text-sm font-medium">
            Kriteria Pelanggan
          </button>
        </div>

        {/* TABLE 1: DATA UTAMA KRITERIA */}
        <div className="px-8 mt-6">
        <div className="overflow-x-auto border border-gray-300 bg-white">
        <table className="w-full text-sm border-collapse">
        <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-center">Kode Kriteria</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Nama Kriteria</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Bobot Kriteria</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Bobot Kriteria Fuzzy</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Attribut</th>
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
                     <td className="border border-gray-300 px-4 py-3 text-center">{item.kode_kriteria}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.nama_kriteria}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.bobot}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.bobot_fuzzy}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
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
          <div className="overflow-x-auto border border-gray-300 bg-white">
          <table className="w-full text-sm border-collapse">
              <thead className="bg-[#F8FAFC] text-slate-700 border-b border-[#E5E5EA]">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-center">Nama Kriteria</th>
                  <th className="border border-gray-300 px-20 py-3 text-left">Keterangan Kriteria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5EA]">
                {loading ? (
                  <tr>
                    <td colSpan="2" className="border border-gray-300 px-4 py-3 text-center">Menyiapkan keterangan...</td>
                  </tr>
                ) : (
                  dataKriteria.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        {item.nama_kriteria}
                      </td>
                      <td className="border border-gray-300 px-20 py-3 text-left">
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