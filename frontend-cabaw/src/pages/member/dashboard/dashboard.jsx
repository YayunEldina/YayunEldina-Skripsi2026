import React from "react";
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
import NavbarMember from "./navbar_member";


export default function MemberDashboard() {
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
    <main className="bg-white text-gray-900 min-h-screen">
      {/* NAVBAR */}
      <NavbarMember />

     {/* ================= PRODUK TERLARIS ================= */}
<section className="px-16 py-20">
  <h2 className="text-3xl font-bold mb-10">
    Koleksi Krupuk Cap <br /> Bawang Terlaris Tahun Ini
  </h2>

  <div className="grid grid-cols-4 gap-8">
    {[
      { name: "Krupuk Uyel Putih", img: UyelPutih },
      { name: "Krupuk Uyel Kuning", img: UyelKuning },
      { name: "Krupuk Ikan", img: Ikan },
      { name: "Krupuk Pedas", img: Pedas },
    ].map((item, i) => (
      <div key={i} className="group cursor-pointer">
        
        {/* KOTAK WARNA HEX SESUAI PERMINTAAN */}
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

        {/* INFO */}
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
</section>

     {/* ================= SEMUA PRODUK ================= */}
<section className="px-16 py-20 bg-gray-50">
  <h2 className="text-3xl font-bold mb-4">
    Seluruh Koleksi Produk Kami
  </h2>

  <p className="text-gray-600 mb-8 max-w-lg">
    Variasi produk dapat berganti sesuai ketersediaan bahan,
    musim, dan permintaan pasar.
  </p>

  <div className="flex gap-4 mb-10">
          {["Gurih", "Pedas", "Manis"].map((tag) => (
            <button
              key={tag}
              className="px-5 py-2 border border-[#E5E5EA] rounded-full text-sm hover:bg-gray-100 transition"
            >
              {tag}
            </button>
          ))}
        </div>

  {/* GRID 5 KOLOM */}
  <div className="grid grid-cols-5 gap-8">
    {allProducts.map((item, i) => (
      <div key={i} className="group cursor-pointer">
        
        {/* FOTO FULL TANPA BACKGROUND */}
        <div className="overflow-hidden rounded-2xl">
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-[350px] object-cover group-hover:scale-105 transition duration-300"
          />
        </div>

        {/* INFO */}
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
    </main>
  );
}
