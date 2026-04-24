import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarNavigation from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";

const TambahTransaksiPenjualan = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  
  // State Form
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [tempatTransaksi, setTempatTransaksi] = useState("");
  const [pedagang, setPedagang] = useState(""); 
  const [selectedKerupuk, setSelectedKerupuk] = useState([]);
  const [jumlah, setJumlah] = useState({});
  const [harga, setHarga] = useState("2.500");

  // List ini sudah disesuaikan persis dengan isi tabel 'produk' di database kamu
  const daftarKerupuk = [
    "Uyel Putih", "Uyel Kuning", "Kotak", "Ikan", 
    "Pedas", "Saleho", "Gorok", "Keong", "Jari", "Padi"
  ];

  // Menghitung Total Pembelian (pcs)
  const totalPembelian = useMemo(() => {
    return Object.values(jumlah).reduce((acc, val) => acc + (parseInt(val) || 0), 0);
  }, [jumlah]);

  // Menghitung Total Harga (IDR)
  const totalHarga = useMemo(() => {
    const hargaNumber = parseInt(harga.replace(/\./g, "")) || 0;
    return totalPembelian * hargaNumber;
  }, [totalPembelian, harga]);

  const handleSelectKerupuk = (value) => {
    if (!value || value === "-Pilih jenis kerupuk-") return;
    if (!selectedKerupuk.includes(value)) {
      setSelectedKerupuk([...selectedKerupuk, value]);
      // Menggunakan string kosong agar input tidak menampilkan angka 0 di awal
      setJumlah({ ...jumlah, [value]: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};
  
    if (!namaPelanggan) newErrors.namaPelanggan = "Nama pelanggan harus diisi";
    if (!jenisKelamin) newErrors.jenisKelamin = "Jenis kelamin harus dipilih";
    if (!tanggal) newErrors.tanggal = "Tanggal harus diisi";
    if (!tempatTransaksi) newErrors.tempatTransaksi = "Tempat transaksi harus diisi";
    if (!pedagang) newErrors.pedagang = "Nama pedagang harus diisi";
  
    if (selectedKerupuk.length === 0) {
      newErrors.kerupuk = "Minimal pilih 1 jenis kerupuk";
    }
  
    selectedKerupuk.forEach((item) => {
      if (!jumlah[item] || parseInt(jumlah[item]) <= 0) {
        newErrors[`jumlah_${item}`] = "Jumlah harus diisi";
      }
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSimpan = async () => {
    // Validasi input sesuai kolom fillable di Model
    if (!validateForm()) return;

    const payload = {
      nama_pelanggan: namaPelanggan,
      jenis_kelamin: jenisKelamin,
      tanggal: tanggal,
      tempat_transaksi: tempatTransaksi,
      pedagang: pedagang,
      total_pembelian: totalPembelian,
      total_harga: totalHarga,
      harga_per_pcs: parseInt(harga.replace(/\./g, "")) || 0,
      items: selectedKerupuk.map(item => ({
        nama: item, // Backend akan mencocokkan ini dengan kolom 'nama_produk'
        jumlah: parseInt(jumlah[item]) || 0
      }))
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/transaksi", payload);
      alert("Data transaksi berhasil ditambahkan!");
      navigate("/admin/transaksi");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Gagal menghubungi server.";
      console.error("Detail Error:", error.response?.data);
      alert("Error: " + errorMsg);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="fixed top-0 left-0 h-full w-[260px] z-40"><SidebarNavigation /></div>
      <div className="ml-[260px] flex flex-col min-h-screen">
        <div className="sticky top-0 z-30 bg-[#F8F9FC]"><NavbarAdmin /></div>
        
        <div className="px-10 py-12">
          <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm">
            <h1 className="text-2xl font-bold mb-12 text-[#1E3A5F]">Tambah Transaksi Baru</h1>
            
            <div className="grid grid-cols-2 gap-14">
              {/* SISI KIRI: DATA PELANGGAN */}
              <div className="space-y-7">
                <div>
                  <label className="block mb-2 font-medium text-slate-700">Nama Pelanggan</label>
                  <input type="text" value={namaPelanggan} onChange={(e) => setNamaPelanggan(e.target.value)} placeholder="Masukkan nama pelanggan" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]" />
                  {errors.namaPelanggan && (
                    <p className="text-red-500 text-sm mt-1">{errors.namaPelanggan}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-medium text-slate-700">Jenis Kelamin</label>
                  <select value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]">
                    <option value="">-Pilih jenis kelamin-</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  {errors.jenisKelamin && (
                    <p className="text-red-500 text-sm mt-1">{errors.jenisKelamin}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-medium text-slate-700">Tanggal</label>
                  <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]" />
                  {errors.tanggal && (
                    <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-medium text-slate-700">Tempat Transaksi</label>
                  <input type="text" value={tempatTransaksi} onChange={(e) => setTempatTransaksi(e.target.value)} placeholder="Masukkan tempat (Misal: Pasar Wage)" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]" />
                  {errors.tempatTransaksi && (
                    <p className="text-red-500 text-sm mt-1">{errors.tempatTransaksi}</p>
                  )}
                </div>
              </div>

              {/* SISI KANAN: DETAIL PESANAN */}
<div className="space-y-7">
  <div>
    <label className="block mb-2 font-medium text-slate-700">
      Pilih Jenis Kerupuk
    </label>

    <select
      onChange={(e) => handleSelectKerupuk(e.target.value)}
      className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
    >
      <option>-Pilih jenis kerupuk-</option>
      {daftarKerupuk.map((item, i) => (
        <option key={i} value={item}>{item}</option>
      ))}
    </select>

    {errors.kerupuk && (
      <p className="text-red-500 text-sm mt-1">{errors.kerupuk}</p>
    )}

    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
      {selectedKerupuk.map((item, i) => (
        <div
          key={i}
          className="flex justify-between items-center border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 shadow-sm transition-all hover:border-blue-200"
        >
          <span className="font-medium text-slate-700">{item}</span>

          <div className="flex items-center gap-3">
            
            {/* INPUT + ERROR JUMLAH */}
            <div className="flex flex-col items-center">
              <input
                type="number"
                min="1"
                value={jumlah[item]}
                onChange={(e) => {
                  setJumlah({ ...jumlah, [item]: e.target.value });

                  // hapus error saat user isi
                  setErrors({
                    ...errors,
                    [`jumlah_${item}`]: ""
                  });
                }}
                placeholder="0"
                className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-center focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />

              {errors[`jumlah_${item}`] && (
                <p className="text-red-500 text-xs mt-1 text-center">
                  {errors[`jumlah_${item}`]}
                </p>
              )}
            </div>

            {/* BUTTON HAPUS */}
            <button
              onClick={() => {
                const updated = { ...jumlah };
                delete updated[item];
                setJumlah(updated);

                setSelectedKerupuk(
                  selectedKerupuk.filter((k) => k !== item)
                );
              }}
              className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* NAMA PEDAGANG */}
  <div>
    <label className="block mb-2 font-medium text-slate-700">
      Nama Pedagang
    </label>

    <input
      type="text"
      value={pedagang}
      onChange={(e) => {
        setPedagang(e.target.value);

        // hapus error saat diketik
        setErrors({
          ...errors,
          pedagang: ""
        });
      }}
      placeholder="Masukkan nama pedagang"
      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
    />

    {errors.pedagang && (
      <p className="text-red-500 text-sm mt-1">{errors.pedagang}</p>
    )}
  </div>

                {/* RINGKASAN HARGA */}
                <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">Total Pembelian:</span>
                      <span className="font-bold text-slate-700">{totalPembelian} pcs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Total Harga Keseluruhan:</span>
                      <span className="text-xl font-bold text-[#1E3A5F]">Rp {totalHarga.toLocaleString("id-ID")}</span>
                    </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-16">
              <button onClick={() => navigate("/admin/transaksi")} className="px-8 py-3 rounded-xl border border-gray-300 text-gray-500 hover:bg-gray-50 transition-all font-medium">Batal</button>
              <button onClick={handleSimpan} className="px-8 py-3 rounded-xl bg-[#1E3A5F] text-white font-semibold hover:opacity-90 shadow-lg shadow-blue-900/10 transition-all">Simpan Transaksi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahTransaksiPenjualan;