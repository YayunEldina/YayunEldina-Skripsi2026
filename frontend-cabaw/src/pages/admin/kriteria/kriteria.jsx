import { useState, useEffect } from "react"; // Tambahkan useState & useEffect
import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

const Kriteria = () => {
  // 1. Buat state untuk menampung data dari backend
  const [dataKriteria, setDataKriteria] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Ambil data dari backend saat halaman dimuat
  useEffect(() => {
    const fetchKriteria = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/kriterias");
        const data = await response.json();
        setDataKriteria(data);
      } catch (error) {
        console.error("Gagal mengambil data kriteria:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKriteria();
  }, []);

  // Data keterangan tetap manual karena biasanya deskripsi panjang tidak disimpan di tabel utama kriteria
  const dataKeterangan = [
    {
      nama: "Total Pembelian",
      keterangan: "Jumlah keseluruhan produk yang dibeli pelanggan dalam periode tertentu.",
    },
    {
      nama: "Total Pendapatan",
      keterangan: "Besarnya omzet yang dihasilkan dari transaksi pelanggan.",
    },
    {
      nama: "Frekuensi Transaksi",
      keterangan: "Jumlah transaksi yang dilakukan pelanggan dalam periode tertentu.",
    },
    {
      nama: "Variabilitas Pembelian",
      keterangan: "Tingkat kestabilan jumlah pembelian pelanggan dari bulan ke bulan.",
    },
  ];

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
          <button className="bg-[#1E3A5F] text-white px-6 py-2 rounded-full text-sm font-medium">
            Kriteria Pelanggan
          </button>
        </div>

        {/* TABLE KRITERIA */}
        <div className="px-8 mt-6">
          <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-slate-700 border-b border-[#E5E5EA]">
                <tr>
                  <th className="px-4 py-3">Kode Kriteria</th>
                  <th className="px-4 py-3">Nama Kriteria</th>
                  <th className="px-4 py-3">Bobot Kriteria</th>
                  <th className="px-4 py-3">Bobot Kriteria Fuzzy</th>
                  <th className="px-4 py-3">Attribut</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">Memuat data...</td>
                  </tr>
                ) : (
                  dataKriteria.map((item, i) => (
                    <tr key={i} className="border-t border-[#E5E5EA]">
                      <td className="px-4 py-3 text-center">{item.kode_kriteria}</td>
                      <td className="px-4 py-3 text-center">{item.nama_kriteria}</td>
                      <td className="px-4 py-3 text-center">{item.bobot}</td>
                      <td className="px-4 py-3 text-center">{item.bobot_fuzzy}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-4 py-1 rounded-full text-xs font-medium ${
                            item.atribut === "Benefit"
                              ? "bg-green-200 text-green-700"
                              : "bg-red-200 text-red-700"
                          }`}
                        >
                          {item.atribut}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE KETERANGAN */}
        <div className="px-8 mt-8 pb-10">
          <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-slate-700 border-b border-[#E5E5EA]">
                <tr>
                  <th className="px-4 py-3">Nama Kriteria</th>
                  <th className="px-4 py-3">Keterangan Kriteria</th>
                </tr>
              </thead>
              <tbody>
                {dataKeterangan.map((item, i) => (
                  <tr key={i} className="border-t border-[#E5E5EA]">
                    <td className="px-4 py-3 text-center font-medium">{item.nama}</td>
                    <td className="px-4 py-3 text-justify">{item.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kriteria;