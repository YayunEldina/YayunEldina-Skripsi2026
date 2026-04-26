import { Link } from "react-router-dom";
import React from "react";
// IMPORT GAMBAR
import Gorok from "../../assets/krupuk_gorok.png";
import Ikan from "../../assets/krupuk_ikan.png";
import Jari from "../../assets/krupuk_jari.png";
import Keong from "../../assets/krupuk_keong.png";
import Kotak from "../../assets/krupuk_kotak.png";
import Padi from "../../assets/krupuk_padi.png";
import Pedas from "../../assets/krupuk_pedas.png";
import Saleho from "../../assets/krupuk_saleho.png";
import UyelKuning from "../../assets/krupuk_uyelkuning.png";
import UyelPutih from "../../assets/krupuk_uyelputih.png";
import CapBawang from "../../assets/capbawang.jpeg";
import Stiker from "../../assets/stikerkrupuk.png";

export default function LandingPage() {
  const [activeFilter, setActiveFilter] = React.useState("Semua");
  const bestSeller = [
    { name: "Krupuk Gorok", img: Gorok },
    { name: "Krupuk Ikan", img: Ikan },
    { name: "Krupuk Jari", img: Jari },
    { name: "Krupuk Keong", img: Keong },
  ];

  const allProducts = [
    { name: "Krupuk Kotak", img: Kotak },
    { name: "Krupuk Padi", img: Padi },
    { name: "Krupuk Pedas", img: Pedas },
    { name: "Krupuk Saleho", img: Saleho },
    { name: "Krupuk Uyel Kuning", img: UyelKuning },
    { name: "Krupuk Uyel Putih", img: UyelPutih },
    { name: "Krupuk Gorok", img: Gorok },
    { name: "Krupuk Ikan", img: Ikan },
    { name: "Krupuk Jari", img: Jari },
    { name: "Krupuk Keong", img: Keong },
  ];

  return (
    <main className="text-gray-900">

      {/* ================= NAVBAR + HERO WRAPPER ================= */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FFF7E6] via-[#FFFDF8] to-white">

       {/* ================= NAVBAR ================= */}
<nav className="flex items-center justify-between px-16 py-6 relative z-10">

{/* LOGO */}
<div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-lg overflow-hidden">
    <img
      src={CapBawang}
      alt="Cap Bawang"
      className="w-full h-full object-cover"
    />
  </div>

  <div>
    <p className="font-bold text-base">Cabaw</p>
    <p className="text-xs text-gray-500">Krupuk Cap Bawang</p>
  </div>
</div>

{/* MENU */}
<ul className="flex items-center gap-6 text-sm">
  <li className="font-semibold cursor-pointer hover:text-[#1E3A5F] transition">
    Beranda
  </li>

  {/* LOGIN BUTTON (CTA) */}
  <li>
    <Link
      to="/login"
      className="px-6 py-2.5 bg-[#1E3A5F] text-white font-semibold rounded-[20px] shadow-md hover:bg-[#16324D] transition duration-300"
    >
      Login
    </Link>
  </li>
</ul>

</nav>

    {/* ================= HERO ================= */}
<section className="px-16 py-16 grid grid-cols-2 gap-10 items-center relative z-10">
  
  {/* KIRI (TEXT) */}
  <div className="mt-10">
    <h1 className="text-5xl font-bold leading-tight mb-10">
      Akses ke Krupuk <br />
      <span className="text-black">Cap Bawang</span> Berkualitas Tinggi
    </h1>

    <p className="text-gray-600 mb-8 max-w-md">
      Website ini memperkenalkan Krupuk Cap Bawang dari Trenggalek
      dengan cita rasa autentik, gurih, dan renyah melalui tampilan
      digital yang interaktif.
    </p>
  </div>

  {/* KANAN (GAMBAR STIKER) */}
  <div className="flex justify-center">
  <img
  src={Stiker}
  alt="Stiker Krupuk"
  className="w-[600px] object-contain mix-blend-darken"
/>
  </div>

</section>
      </div>

      {/* ================= PRODUK TERLARIS ================= */}
      <section className="px-10 py-10 bg-gray-100 rounded-3xl mx-6">
  <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm max-w-[3000px] mx-auto">

  <h2 className="text-4xl font-bold text-center mb-12 leading-tight">
      Koleksi Krupuk Cap <br />
      <span className="text-[#1E3A5F]">Bawang Terlaris Tahun Ini</span>
    </h2>

    <p className="text-gray-600 -mt-6 mb-8 mx-auto text-center whitespace-nowrap">
  Dibawah ini adalah top 4 produk dari krupuk Cap Bawang terlaris dipasaran
</p>

    <div className="grid grid-cols-4 gap-8">
      {[
        { name: "Krupuk Uyel Putih", img: UyelPutih },
        { name: "Krupuk Uyel Kuning", img: UyelKuning },
        { name: "Krupuk Ikan", img: Ikan },
        { name: "Krupuk Pedas", img: Pedas },
      ].map((item, i) => (
        <div key={i} className="group cursor-pointer">
          <div
            className="overflow-hidden rounded-2xl p-4"
            style={{
              backgroundColor: ["#B08968", "#8B1E1E", "#E5E5E5", "#1E3A5F"][i]
            }}
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-[400px] object-cover rounded-xl group-hover:scale-105 transition duration-300"
            />
          </div>

          <div className="mt-3">
            <p className="font-semibold text-sm">{item.name}</p>
            <p className="text-xs text-yellow-500">
              ★★★★★ <span className="text-gray-400">(4.9)</span>
            </p>
            <p className="font-bold text-sm mt-1">Rp 2.500</p>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>

      {/* ================= SEMUA PRODUK ================= */}
<section className="px-16 py-20">
  <h2 className="text-3xl font-bold mb-4">
    Seluruh Koleksi Produk Kami
  </h2>

  <p className="text-gray-600 mb-8 max-w-lg">
    Variasi produk dapat berganti sesuai ketersediaan bahan,
    musim, dan permintaan pasar.
  </p>

  {/* FILTER BUTTON */}
  <div className="flex gap-4 mb-10">
    {["Semua", "Gurih", "Pedas", "Manis"].map((tag) => (
      <button
        key={tag}
        onClick={() => setActiveFilter(tag)}
        className={`px-5 py-2 rounded-full text-sm border transition
          ${
            activeFilter === tag
              ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
              : "border-[#E5E5EA] hover:bg-gray-100"
          }`}
      >
        {tag}
      </button>
    ))}
  </div>

  {/* GRID */}
  <div className="grid grid-cols-5 gap-8">
    {allProducts
      .filter((item) => {
        if (activeFilter === "Semua") return true;
        if (activeFilter === "Gurih") {
          return item.name !== "Krupuk Gorok" && item.name !== "Krupuk Pedas";
        }
        if (activeFilter === "Pedas") {
          return item.name === "Krupuk Pedas";
        }
        if (activeFilter === "Manis") {
          return item.name === "Krupuk Gorok";
        }
        return true;
      })
      .map((item, i) => (
        <div key={i} className="group cursor-pointer">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-[350px] object-cover group-hover:scale-105 transition duration-300"
            />
          </div>

          <div className="mt-3">
            <p className="font-semibold text-sm">{item.name}</p>
            <p className="text-xs text-yellow-500">
              ★★★★★ <span className="text-gray-400">(4.7)</span>
            </p>
            <p className="font-bold text-sm mt-1">Rp 2.500</p>
          </div>
        </div>
      ))}
  </div>
</section>

     {/* ================= TESTIMONI ================= */}
<section className="px-16 py-20 bg-white">
  <h2 className="text-3xl font-bold text-center mb-14">
    Pelanggan Kami Bahagia
  </h2>

  <div className="grid grid-cols-3 gap-8">

    {[
      {
        name: "Agus | Pedagang Sayur Panggul",
        date: "12 Januari 2024",
        title: "Krupuk Favorit Pelanggan",
        desc: "Krupuknya selalu jadi favorit pembeli saya. Renyah dan gurih, cepat habis tiap hari."
      },
      {
        name: "Sarimi | Pedagang Sayur Sawahan",
        date: "5 Februari 2024",
        title: "Kualitas Terjamin",
        desc: "Rasanya konsisten dan enak. Pelanggan saya sering cari krupuk ini karena beda dari yang lain."
      },
      {
        name: "Budi | Warung Makan Trenggalek",
        date: "20 Maret 2024",
        title: "Cocok untuk Semua Menu",
        desc: "Setiap menu jadi lebih nikmat dengan krupuk ini. Gurihnya pas dan tidak mudah melempem."
      }
    ].map((item, i) => (

      <div
  key={i}
  className="bg-gray-100 p-2 rounded-2xl"
>
  {/* INNER BOX */}
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">

    {/* NAMA + TANGGAL */}
    <div className="mb-4">
      <p className="font-semibold text-sm text-[#1E3A5F]">
        {item.name}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {item.date}
      </p>
    </div>

    {/* JUDUL */}
    <p className="text-sm font-semibold mb-2">
      {item.title}
    </p>

    {/* DESKRIPSI */}
    <p className="text-sm text-gray-600 leading-relaxed">
      {item.desc}
    </p>

  </div>
</div>

    ))}

  </div>
</section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0F2A44] text-white px-16 py-16">
        <div className="grid grid-cols-4 gap-10">
        <div className="flex items-start gap-3">
  {/* LOGO */}
  <div className="w-15 h- rounded-lg overflow-hidden">
    <img
      src={CapBawang}
      alt="Cap Bawang"
      className="w-full h-full object-cover"
    />
  </div>

  {/* TEXT */}
  <div>
    <h3 className="font-bold text-lg mb-1">Cabaw</h3>
    <p className="text-sm text-gray-300">
      Dibuat dengan cinta di Trenggalek
    </p>
  </div>
</div>

          <div>
            <h4 className="font-semibold mb-2">Layanan Pelanggan</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Pertanyaan Umum</li>
              <li>Cara Order</li>
              <li>Pengembalian Produk</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Produk</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Krupuk Bawang</li>
              <li>Krupuk Pedas</li>
              <li>Krupuk Manis</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Alamat Kami</h4>
            <p className="text-sm text-gray-300">
              Desa Nglebeng, Kec. Panggul <br />
              Kab. Trenggalek <br />
              0822-xxxx-xxxx
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}