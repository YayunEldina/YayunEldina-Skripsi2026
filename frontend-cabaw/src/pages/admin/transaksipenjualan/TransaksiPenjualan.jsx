import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import NavbarAdmin from "../dashboard/navbar_admin";

import tambahIcon from "../../../assets/tambah.svg";
import lihatIcon from "../../../assets/lihat.svg";
import editIcon from "../../../assets/edit.svg";
import hapusIcon from "../../../assets/hapus.svg";

const TransaksiPenjualan = () => {
  const navigate = useNavigate();
  const [dataTransaksi, setDataTransaksi] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [tahunTerpilih, setTahunTerpilih] = useState(() => {
    return localStorage.getItem("tahunTransaksi") || "2021";
  });
  const [bulanTerpilih, setBulanTerpilih] = useState(() => {
    return localStorage.getItem("bulanTransaksi") || "";
  });
  
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
    "12": "Desember",
  };
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTransaksi = async (
    tahun,
    bulan,
    currentPage,
    search = ""
  ) => {
    setLoading(true);
    try {
      // Mengambil data dari backend yang sudah dipaginasi
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/transaksi?tahun=${tahun}&bulan=${bulan}&page=${currentPage}&search=${search}`
      );
      
      // Laravel paginate mengembalikan object, data asli ada di property .data
      setDataTransaksi(response.data.data); 
      setPagination(response.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi(
      tahunTerpilih,
      bulanTerpilih,
      page,
      searchTerm
    );
  }, [tahunTerpilih, bulanTerpilih, page, searchTerm]);

  const formatTanggalHariIni = () => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  };

  // Filter hanya dilakukan pada data yang tampil di halaman saat ini
  const dataFiltered = dataTransaksi;

  const handleHapus = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus data?",
      text: "Data transaksi akan hilang permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1E3A5F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });
  
    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/transaksi/${id}`
        );
  
        await Swal.fire({
          title: "Berhasil!",
          text: "Data berhasil dihapus",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
  
        fetchTransaksi(tahunTerpilih, page);
  
      } catch (error) {
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat menghapus",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">

   {/* Navbar */}
<NavbarAdmin />

{/* Content */}
<div className="pt-20 px-10">

  {/* Header Card */}
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
    <h1 className="text-2xl font-bold text-slate-800">
      Transaksi Penjualan
    </h1>

    <p className="text-slate-500 text-sm mt-1">
      Riwayat transaksi penjualan kerupuk berdasarkan periode yang dipilih
    </p>
  </div>

  {/* Search & Filter Section */}
  <div className="mt-6">
  <div className="flex items-center flex-wrap gap-4">

    <span className="text-sm font-medium text-slate-500">
      {formatTanggalHariIni()}
    </span>

    <div className="h-5 w-px bg-slate-300" />

    {/* Tahun */}
    <select
      value={tahunTerpilih}
      onChange={(e) => {
        setTahunTerpilih(e.target.value);
        localStorage.setItem(
          "tahunTransaksi",
          e.target.value
        );
        setPage(1);
      }}
      className="
      bg-white
      border
      border-slate-300
      rounded-xl
      px-4
      py-2.5
      text-sm
      shadow-sm
      "
    >
      {[2021, 2022, 2023, 2024, 2025, 2026].map((tahun) => (
        <option
          key={tahun}
          value={tahun}
        >
          {tahun}
        </option>
      ))}
    </select>

    {/* Bulan */}
    <select
      value={bulanTerpilih}
      onChange={(e) => {
        setBulanTerpilih(e.target.value);
        localStorage.setItem(
          "bulanTransaksi",
          e.target.value
        );
        setPage(1);
      }}
      className="
      bg-white
      border
      border-slate-300
      rounded-xl
      px-4
      py-2.5
      text-sm
      shadow-sm
      "
    >
      <option value="">
        Semua Bulan
      </option>

      {Object.entries(namaBulan).map(
        ([num, nama]) => (
          <option
            key={num}
            value={num}
          >
            {nama}
          </option>
        )
      )}
    </select>

    {/* Search */}
    <div className="relative">
      <input
        type="text"
        placeholder="Cari nama pelanggan..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        className="
        w-72
        pl-10
        pr-4
        py-2.5
        border
        border-slate-300
        rounded-xl
        text-sm
        "
      />

      <FiSearch
        className="
        absolute
        left-3
        top-1/2
        -translate-y-1/2
        text-slate-400
        "
      />
    </div>

  </div>
</div>

        {/* Year Filter & Add Button */}
        <div className="flex justify-end mt-4">
  <button
    onClick={() =>
      navigate("/admin/tambah/transaksi")
    }
    className="
    flex
    items-center
    gap-2
    bg-[#1E3A5F]
    text-white
    px-4
    py-2
    rounded-lg
    hover:opacity-90
    transition
    shadow-md
    "
  >
    <img
      src={tambahIcon}
      alt="tambah"
      className="w-4 h-4"
    />
    Tambah transaksi
  </button>
</div>

        {/* Table Section */}
        <div className="mt-6 pb-4">
        <div className="overflow-x-auto border border-gray-300 bg-white">
              <table className="w-full text-sm border-collapse">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-center">No</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Nama Pelanggan</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Jenis Kelamin</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Tanggal</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Jenis Krupuk</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Harga / Pcs</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Total Pembelian</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Total Harga</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Tempat Transaksi</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Pedagang</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Admin</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="12" className="px-4 py-10 text-center italic">Memuat data dari 380.000+ records...</td></tr>
                ) : dataFiltered.length > 0 ? (
                  dataFiltered.map((item, i) => {
                    const details = item.detail_transaksi || [];
                    const namaKrupuk = details.length > 0 
                      ? details.map(d => d.produk?.nama_produk).filter(Boolean).join(", ")
                      : "-";

                    const hargaSatuPcs = details.length > 0 && details[0].produk?.harga
                      ? `Rp ${parseInt(details[0].produk.harga).toLocaleString("id-ID")}`
                      : "Rp 0";

                    const tglObj = new Date(item.tanggal);
                    const tanggalFormatted = `${tglObj.getDate()}/${tglObj.getMonth() + 1}/${tglObj.getFullYear()}`;

                    return (
                      <tr key={item.id_transaksi} className="hover:bg-gray-50 transition">
                        {/* Penomoran otomatis sesuai halaman */}
                        <td className="border border-gray-300 px-4 py-3 text-center">{(pagination.current_page - 1) * pagination.per_page + i + 1}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">{item.pelanggan?.nama_pelanggan || "-"}</td>
                       <td className="border border-gray-300 px-4 py-3 text-center">{item.pelanggan?.jenis_kelamin || "-"}</td>
                       <td className="border border-gray-300 px-4 py-3 text-center">{tanggalFormatted}</td>
                       <td className="border border-gray-300 px-4 py-3 text-center">{namaKrupuk}</td>
                       <td className="border border-gray-300 px-4 py-3 text-center">{hargaSatuPcs}</td>
                       <td className="border border-gray-300 px-4 py-3 text-center">{item.total_pembelian || 0}</td>
                       <td className="border border-gray-300 px-4 py-3 text-center">
                          Rp {parseFloat(item.total_harga).toLocaleString("id-ID")}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">{item.tempat_transaksi || "-"}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">{item.pedagang || "-"}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">{item.admin?.nama_admin || "-"}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <img src={lihatIcon} alt="lihat" onClick={() => navigate(`/admin/lihat/transaksi/${item.id_transaksi}`)} className="w-8 h-8 p-1.5 rounded-md bg-green-100 cursor-pointer hover:bg-green-200 transition" />
                            <img src={editIcon} alt="edit" onClick={() => navigate(`/admin/transaksi/edit/${item.id_transaksi}`)} className="w-8 h-8 p-1.5 rounded-md bg-yellow-100 cursor-pointer hover:bg-yellow-200 transition" />
                            <img src={hapusIcon} alt="hapus" onClick={() => handleHapus(item.id_transaksi)} className="w-8 h-8 p-1.5 rounded-md bg-red-100 cursor-pointer hover:bg-red-200 transition" />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="12" className="px-4 py-10 text-center text-red-500 italic">
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls - Tambahan agar bisa navigasi 380rb data */}
        <div className="flex items-center justify-between mt-2 mb-10">
          <p className="text-sm text-slate-500">
            Menampilkan <span className="font-bold">{dataFiltered.length}</span> data per halaman (Total: {pagination.total?.toLocaleString('id-ID')} transaksi)
          </p>
          <div className="flex items-center gap-3">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <FiChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1 font-medium text-sm">
              <span className="px-3 py-1 bg-[#1E3A5F] text-white rounded-md">{pagination.current_page}</span>
              <span className="text-slate-400">dari</span>
              <span className="px-3 py-1 bg-gray-100 rounded-md">{pagination.last_page}</span>
            </div>
            <button 
              disabled={page === pagination.last_page}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransaksiPenjualan;