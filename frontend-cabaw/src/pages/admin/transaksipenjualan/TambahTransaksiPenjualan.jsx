import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarNavigation from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";

// IMPORT GAMBAR
import Gorok from "../../../assets/krupuk_gorok.png";
import Ikan from "../../../assets/krupuk_ikan.png";
import Jari from "../../../assets/krupuk_jari.png";
import Keong from "../../../assets/krupuk_keong.png";
import Kotak from "../../../assets/krupuk_kotak.png";
import Padi from "../../../assets/krupuk_padi.png";
import Pedas from "../../../assets/krupuk_pedas.png";
import Saleho from "../../../assets/krupuk_saleho.png";
import UyelKuning from "../../../assets/krupuk_uyelkuning.png";
import UyelPutih from "../../../assets/krupuk_uyelputih.png";

const TambahTransaksiPenjualan = () => {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("Semua");

  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [tempatTransaksi, setTempatTransaksi] = useState("");
  const [pedagang, setPedagang] = useState("");

  const [selectedKerupuk, setSelectedKerupuk] = useState([]);
  const [jumlah, setJumlah] = useState({});
  const [harga] = useState("2.500");

  const allProducts = [
    { name: "Kotak", img: Kotak, kategori: "Gurih" },
    { name: "Padi", img: Padi, kategori: "Gurih" },
    { name: "Pedas", img: Pedas, kategori: "Pedas" },
    { name: "Saleho", img: Saleho, kategori: "Gurih" },
    { name: "Uyel Kuning", img: UyelKuning, kategori: "Gurih" },
    { name: "Uyel Putih", img: UyelPutih, kategori: "Gurih" },
    { name: "Gorok", img: Gorok, kategori: "Manis" },
    { name: "Ikan", img: Ikan, kategori: "Gurih" },
    { name: "Jari", img: Jari, kategori: "Gurih" },
    { name: "Keong", img: Keong, kategori: "Gurih" },
  ];

  const totalPembelian = useMemo(() => {
    return Object.values(jumlah).reduce(
      (acc, val) => acc + (parseInt(val) || 0),
      0
    );
  }, [jumlah]);

  const totalHarga = useMemo(() => {
    const hargaNumber = parseInt(harga.replace(/\./g, "")) || 0;
    return totalPembelian * hargaNumber;
  }, [totalPembelian, harga]);

  const handleTambahProduk = (produk) => {
    if (!selectedKerupuk.includes(produk)) {
      setSelectedKerupuk([...selectedKerupuk, produk]);
      setJumlah({ ...jumlah, [produk]: 1 });
    } else {
      setJumlah({
        ...jumlah,
        [produk]: jumlah[produk] + 1,
      });
    }
  };

  const handleSimpan = async () => {
    const payload = {
      nama_pelanggan: namaPelanggan,
      jenis_kelamin: jenisKelamin,
      tanggal,
      tempat_transaksi: tempatTransaksi,
      pedagang,
      total_pembelian: totalPembelian,
      total_harga: totalHarga,
      harga_per_pcs: 2500,
      items: selectedKerupuk.map((item) => ({
        nama: item,
        jumlah: jumlah[item],
      })),
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/transaksi", payload);
      alert("Transaksi berhasil!");
      navigate("/admin/transaksi");
    } catch (error) {
      alert("Gagal menyimpan transaksi");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-[30px]">
        <NavbarAdmin />

        <div className="p-8">
          <div className="grid grid-cols-3 gap-6">

            {/* ================= LEFT ================= */}
            <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">

              {/* 🔥 HEADER DIUBAH JADI ABU-ABU */}
              <div className="bg-gray-300 text-gray-800 px-5 py-3 rounded-xl mb-6 font-semibold">
                Daftar Krupuk Cap Bawang
              </div>

              {/* 🔥 FILTER BUTTON (OUTLINE ONLY) */}
              <div className="flex gap-3 mb-6">
                {["Semua", "Gurih", "Pedas", "Manis"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveFilter(tag)}
                    className={`px-4 py-2 rounded-full text-sm border transition bg-white text-black
                      ${
                        activeFilter === tag
                          ? "border-[#1E3A5F]"
                          : "border-gray-300"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* PRODUK */}
              <div className="grid grid-cols-4 gap-5">
                {allProducts
                  .filter((item) => {
                    if (activeFilter === "Semua") return true;
                    return item.kategori === activeFilter;
                  })
                  .map((item, i) => (
                    <div
                      key={i}
                      onClick={() => handleTambahProduk(item.name)}
                      className="bg-white rounded-xl p-3 cursor-pointer hover:shadow-md transition"
                    >
                      <img
                        src={item.img}
                        className="w-full h-[120px] object-cover rounded-lg"
                      />
                      <p className="text-sm font-semibold mt-2">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">Rp 2.500</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* ================= RIGHT ================= */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">

              <div className="bg-[#1E3A5F] text-white px-5 py-3 rounded-xl mb-6 font-semibold">
                Tambah Transaksi Penjualan
              </div>
              <div className="space-y-4 mb-4">

{/* Nama Pelanggan */}
<div className="flex items-center gap-4">
  <label className="w-44 text-base font-medium text-gray-500">
    Nama Pelanggan
  </label>
  <input
    type="text"
    value={namaPelanggan}
    onChange={(e) => setNamaPelanggan(e.target.value)}
    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
    placeholder="Masukkan nama pelanggan"
  />
</div>

{/* Jenis Kelamin */}
<div className="flex items-center gap-4">
  <label className="w-44 text-base font-medium text-gray-500">
    Jenis Kelamin
  </label>
  <select
    value={jenisKelamin}
    onChange={(e) => setJenisKelamin(e.target.value)}
    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
  >
    <option value="">Pilih jenis kelamin</option>
    <option>Laki-laki</option>
    <option>Perempuan</option>
  </select>
</div>

{/* Tanggal */}
<div className="flex items-center gap-4">
  <label className="w-44 text-base font-medium text-gray-500">
    Tanggal
  </label>
  <input
    type="date"
    value={tanggal}
    onChange={(e) => setTanggal(e.target.value)}
    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
  />
</div>

{/* Tempat Transaksi */}
<div className="flex items-center gap-4">
  <label className="w-44 text-base font-medium text-gray-500">
    Tempat Transaksi
  </label>
  <input
    type="text"
    value={tempatTransaksi}
    onChange={(e) => setTempatTransaksi(e.target.value)}
    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
    placeholder="Masukkan tempat transaksi"
  />
</div>

{/* Pedagang */}
<div className="flex items-center gap-4">
  <label className="w-44 text-base font-medium text-gray-500">
    Pedagang
  </label>
  <input
    type="text"
    value={pedagang}
    onChange={(e) => setPedagang(e.target.value)}
    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
    placeholder="Nama pedagang"
  />
</div>

</div>
              {/* KERANJANG */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold mb-3">Daftar Pesanan</h3>

                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {selectedKerupuk.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
                    >
                      <span>{item}</span>

                      <div className="flex items-center gap-2">

  {/* MINUS */}
  <button
    onClick={() =>
      setJumlah({
        ...jumlah,
        [item]: Math.max(1, jumlah[item] - 1),
      })
    }
    className="px-2 bg-gray-200 rounded"
  >
    -
  </button>

  {/* INPUT (BISA DIKETIK) */}
  <input
    type="number"
    min="1"
    value={jumlah[item]}
    onChange={(e) =>
      setJumlah({
        ...jumlah,
        [item]: parseInt(e.target.value) || 1,
      })
    }
    className="w-12 text-center text-sm border border-gray-300 rounded"
  />

  {/* PLUS */}
  <button
    onClick={() =>
      setJumlah({
        ...jumlah,
        [item]: (jumlah[item] || 0) + 1,
      })
    }
    className="px-2 bg-gray-200 rounded"
  >
    +
  </button>

</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col items-end text-right">

  {/* TOTAL ITEM */}
  <p className="text-base text-gray-600">
    Total Item:{" "}
    <span className="font-semibold text-gray-800">
      {totalPembelian}
    </span>
  </p>

  {/* TOTAL HARGA (BESAR) */}
  <p className="text-2xl font-bold text-[#1E3A5F] mt-1">
    Rp {totalHarga.toLocaleString("id-ID")}
  </p>

</div>

                <div className="flex gap-4 mt-8 w-full">

  {/* BATAL - 30% */}
  <button
    onClick={() => navigate("/admin/transaksi")}
    className="w-3/10 flex-[3] px-6 py-3 rounded-xl border border-gray-300 text-gray-500 hover:bg-gray-50 transition-all font-medium"
  >
    Batal
  </button>

  {/* SIMPAN - 70% */}
  <button
    onClick={handleSimpan}
    className="w-7/10 flex-[7] px-6 py-3 rounded-xl bg-[#1E3A5F] text-white font-semibold hover:opacity-90 shadow-lg shadow-blue-900/10 transition-all"
  >
    Simpan Transaksi
  </button>

</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahTransaksiPenjualan;