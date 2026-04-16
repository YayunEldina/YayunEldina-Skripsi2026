import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

import tambahIcon from "../../../assets/tambah.svg";
import lihatIcon from "../../../assets/lihat.svg";
import editIcon from "../../../assets/edit.svg";
import hapusIcon from "../../../assets/hapus.svg";

const TransaksiPenjualan = () => {
  const navigate = useNavigate();
  const [dataTransaksi, setDataTransaksi] = useState([]);
  const [tahunTerpilih, setTahunTerpilih] = useState("2021");
  const [loading, setLoading] = useState(true);

  const fetchTransaksi = async (tahun) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/transaksi?tahun=${tahun}`);
      setDataTransaksi(response.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi(tahunTerpilih);
  }, [tahunTerpilih]);

  const handleHapus = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/transaksi/${id}`);
        alert("Data berhasil dihapus");
        fetchTransaksi(tahunTerpilih);
      } catch (error) {
        alert("Gagal menghapus data");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SidebarNavigationSection />

      <div className="flex-1 ml-[280px] pt-[80px]">
        <NavbarAdmin />
        <div className="px-0 pt-4"><TampilanElemen /></div>

        <div className="flex items-center justify-between px-8 mt-6">
          <div className="flex gap-2">
            {["2021", "2022", "2023", "2024", "2025"].map((y) => (
              <button
                key={y}
                onClick={() => setTahunTerpilih(y)}
                className={`px-5 py-2 rounded-full border text-sm transition-all ${
                  y === tahunTerpilih ? "bg-[#1E3A5F] text-white" : "bg-white text-slate-600"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
          <button onClick={() => navigate("/admin/tambah/transaksi")} className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg hover:opacity-90">
            <img src={tambahIcon} alt="tambah" className="w-4 h-4" /> Tambah transaksi
          </button>
        </div>

        <div className="px-8 mt-6">
          <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#F1F5F9] text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left">No</th>
                  <th className="px-4 py-3 text-left">Nama Pelanggan</th>
                  <th className="px-4 py-3 text-left">Jenis Kelamin</th>
                  <th className="px-4 py-3 text-left">Tanggal</th>
                  <th className="px-4 py-3 text-left">Jenis Krupuk</th>
                  <th className="px-4 py-3 text-left">Harga / Pcs</th>
                  <th className="px-4 py-3 text-left">Total Pembelian</th>
                  <th className="px-4 py-3 text-left">Total Harga</th>
                  <th className="px-4 py-3 text-left">Tempat Transaksi</th>
                  <th className="px-4 py-3 text-left">Pedagang</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="11" className="px-4 py-10 text-center italic">Memuat data...</td></tr>
                ) : dataTransaksi.length > 0 ? (
                  dataTransaksi.map((item, i) => {
                    const details = item.detail_transaksi || [];

                    // Gabungkan semua nama produk menjadi satu teks dipisahkan koma
                    const namaKrupuk = details.length > 0 
                      ? details.map(d => d.produk?.nama_produk).filter(Boolean).join(", ")
                      : "-";

                    // Ambil satu harga saja karena semua produk harganya sama (Rp 2.500)
                    const hargaSatuPcs = details.length > 0 && details[0].produk?.harga
                      ? `Rp ${parseInt(details[0].produk.harga).toLocaleString("id-ID")}`
                      : "Rp 0";

                    const tglObj = new Date(item.tanggal);
                    const tanggalFormatted = `${tglObj.getDate()}/${tglObj.getMonth() + 1}/${tglObj.getFullYear()}`;

                    return (
                      <tr key={item.id_transaksi} className="border-t border-[#E5E5EA] hover:bg-slate-50 transition">
                        <td className="px-4 py-3">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{item.pelanggan?.nama_pelanggan || "-"}</td>
                        <td className="px-4 py-3">{item.pelanggan?.jenis_kelamin || "-"}</td>
                        <td className="px-4 py-3">{tanggalFormatted}</td>
                        
                        <td className="px-4 py-3 font-medium text-blue-900">
                          {namaKrupuk}
                        </td>
                        
                        {/* Menampilkan hanya satu harga saja */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {hargaSatuPcs}
                        </td>
                        
                        <td className="px-4 py-3 text-center">{item.total_pembelian || 0}</td>
                        
                        <td className="px-4 py-3 font-semibold text-[#1E3A5F]">
                          Rp {parseFloat(item.total_harga).toLocaleString("id-ID")}
                        </td>
                        
                        <td className="px-4 py-3">{item.tempat_transaksi || "-"}</td>
                        <td className="px-4 py-3">{item.pedagang || "-"}</td>
                        
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <img src={lihatIcon} alt="lihat" onClick={() => navigate(`/admin/lihat/transaksi/${item.id_transaksi}`)} className="w-8 h-8 p-1.5 rounded-md bg-green-100 cursor-pointer hover:bg-green-200" />
                            <img src={editIcon} alt="edit" onClick={() => navigate(`/admin/edit/transaksi/${item.id_transaksi}`)} className="w-8 h-8 p-1.5 rounded-md bg-yellow-100 cursor-pointer hover:bg-yellow-200" />
                            <img src={hapusIcon} alt="hapus" onClick={() => handleHapus(item.id_transaksi)} className="w-8 h-8 p-1.5 rounded-md bg-red-100 cursor-pointer hover:bg-red-200" />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="11" className="px-4 py-10 text-center text-red-500 italic">Tidak ada data di tahun {tahunTerpilih}.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransaksiPenjualan;