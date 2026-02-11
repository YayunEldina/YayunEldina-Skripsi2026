import React from "react";
import NavbarMember from "./navbar_member";

export default function LandingPage() {
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
          {["#B08968", "#8B1E1E", "#E5E5E5", "#1E3A5F"].map((color, i) => (
            <div key={i}>
              <div
                className="h-56 rounded-xl"
                style={{ backgroundColor: color }}
              />
              <p className="mt-4 font-semibold">Krupuk Bawang</p>
              <p className="text-sm text-yellow-500">
                ★★★★★ <span className="text-gray-400">(4.5)</span>
              </p>
              <p className="font-bold">Rp 2.500</p>
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

        <div className="grid grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl shadow-sm border border-[#E5E5EA]"
            >
              <div className="h-40 bg-gray-200 rounded-lg" />
              <p className="mt-4 font-semibold">Krupuk Bawang</p>
              <p className="text-sm text-yellow-500">
                ★★★★★ <span className="text-gray-400">(4.5)</span>
              </p>
              <p className="font-bold">Rp 2.500</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
