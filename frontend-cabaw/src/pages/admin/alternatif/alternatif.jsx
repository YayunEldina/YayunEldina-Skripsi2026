import { useState, useEffect } from "react"; // Tambahkan ini
import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

const Alternatif = () => {
  // 1. Inisialisasi state untuk menampung data dari backend
  const [alternatifs, setAlternatifs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fungsi untuk mengambil data dari Backend
  useEffect(() => {
    const fetchAlternatif = async () => {
      try {
        // Sesuaikan dengan route yang baru kita buat (tadi kita sepakat pakai /alternatifs)
        const response = await fetch("http://127.0.0.1:8000/api/alternatifs");
        const data = await response.json();
        setAlternatifs(data);
      } catch (error) {
        console.error("Gagal mengambil data alternatif:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlternatif();
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR */}
      <SidebarNavigationSection />

      {/* CONTENT */}
      <div className="flex-1 ml-[280px] pt-[50px]">
        {/* NAVBAR */}
        <NavbarAdmin />

        {/* TANGGAL + SEARCH */}
        <div className="px-0 pt-4">
          <TampilanElemen />
        </div>

        {/* TITLE */}
        <div className="px-8 mt-6">
          <button className="px-5 py-2 bg-[#1E3A5F] text-white rounded-full text-sm font-medium">
            Alternatif Pelanggan
          </button>
        </div>

        {/* TABLE */}
        <div className="px-8 mt-6">
          <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-slate-700 border-b border-[#E5E5EA]">
                <tr>
                  <th className="px-6 py-4 text-left">Kode Alternatif</th>
                  <th className="px-6 py-4 text-left">Nama Alternatif</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="2" className="text-center py-10">Memuat data pelanggan...</td>
                  </tr>
                ) : alternatifs.length > 0 ? (
                  alternatifs.map((item, i) => (
                    <tr
                      key={i}
                      className="border-t border-[#E5E5EA] hover:bg-slate-50 transition"
                    >
                      {/* Sesuaikan nama kolom dengan Model Laravel mu */}
                      <td className="px-6 py-4 font-medium text-[#1E3A5F]">
                        {item.kode_alternatif}
                      </td>
                      <td className="px-6 py-4">{item.nama_alternatif}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center py-10 text-gray-500">
                      Belum ada data alternatif.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION (Statis) */}
          <div className="flex justify-end items-center gap-2 mt-6 text-sm">
            <button className="px-3 py-1 text-gray-400">{"<"} Previous</button>
            <button className="px-3 py-1 bg-[#1E3A5F] text-white rounded-md">1</button>
            <button className="px-3 py-1 border border-[#E5E5EA] rounded-md hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1">Next {">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alternatif;