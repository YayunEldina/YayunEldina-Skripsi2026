import React, { useState, useEffect } from "react";
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
  const [diskonPersen, setDiskonPersen] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Semua");

  useEffect(() => {
    const checkDiscount = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser || !storedUser.nama_pelanggan) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/api/proses-perhitungan?tahun=2025"
        );

        const result = await response.json();

        if (!result || !result.hasil_akhir) {
          setLoading(false);
          return;
        }

        const dataSPK = result.hasil_akhir.find(
          (item) =>
            storedUser.nama_pelanggan.toLowerCase() ===
            item.nama.toLowerCase()
        );

        if (dataSPK && dataSPK.diskon) {
          setDiskonPersen(dataSPK.diskon);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    checkDiscount();
  }, []);

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

  const filteredProducts = allProducts.filter((item) => {
    if (filter === "Semua") return true;
  
    const gurih = [
      "Krupuk Kotak",
      "Krupuk Padi",
      "Krupuk Saleho",
      "Krupuk Uyel Kuning",
      "Krupuk Uyel Putih",
      "Krupuk Ikan",
      "Krupuk Jari",
      "Krupuk Keong",
    ];
  
    const pedas = ["Krupuk Pedas"];
    const manis = ["Krupuk Gorok"];
  
    if (filter === "Gurih") return gurih.includes(item.name);
    if (filter === "Pedas") return pedas.includes(item.name);
    if (filter === "Manis") return manis.includes(item.name);
  
    return true;
  });

  return (
    <main className="bg-gray-50 text-gray-900 min-h-screen">
      <NavbarMember />

      {/* WRAPPER */}
      <section className="px-16 pt-32 pb-16">
        <div className="grid grid-cols-3 gap-10">

          {/* ================= KIRI ================= */}
          <div className="col-span-2 space-y-10">

            {/* 🔵 DISKON (GRADASI BARU) */}
            <div className="bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#2563EB] text-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">
                Diskon Anda Bulan Ini
              </h2>

              {loading ? (
                <div className="h-24 w-64 bg-white/10 animate-pulse rounded-2xl"></div>
              ) : diskonPersen > 0 ? (
                <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-6 w-fit">
                  <p className="text-white/80 font-bold text-sm">
                    REWARD LOYALITAS SPK
                  </p>
                  <h1 className="text-4xl font-black">
                    {diskonPersen}% OFF
                  </h1>
                  <p className="text-white/70 text-sm">
                    Diskon otomatis berdasarkan peringkat Anda
                  </p>
                </div>
              ) : (
                <div className="bg-white/10 border border-white/20 rounded-2xl p-6 w-fit">
                  <p className="text-white/70 text-sm">
                    Belum ada diskon khusus.
                  </p>
                </div>
              )}
            </div>

            {/* SEMUA PRODUK */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-4">
                Seluruh Koleksi Produk Kami
              </h2>

              <div className="flex gap-3 mb-6">
              {["Semua", "Gurih", "Pedas", "Manis"].map((tag) => (
  <button
    key={tag}
    onClick={() => setFilter(tag)}
    className={`px-4 py-1.5 border rounded-full text-sm transition ${
      filter === tag
        ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
        : "border-gray-300 text-gray-700 hover:bg-gray-100"
    }`}
  >
    {tag}
  </button>
))}
              </div>

              <div className="grid grid-cols-4 gap-6">
              {filteredProducts.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition"
                  >
                    <div className="overflow-hidden rounded-xl mb-2">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Rp 2.500 / Bungkus
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ================= KANAN (RESET PUTIH SEMULA) ================= */}
          <div className="col-span-1">

            <div className="bg-white border border-gray-100 rounded-3xl p-6 h-full shadow-sm">

              <h2 className="text-xl font-semibold mb-2">
                Produk Terlaris
              </h2>

              <p className="text-sm text-gray-500 mb-6">
                Rekomendasi produk terlaris Krupuk Cap Bawang
              </p>

              <div className="space-y-5">
                {bestSeller.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition"
                  >
                    <div className="overflow-hidden rounded-xl mb-2">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Rp 2.500 / Bungkus
                    </p>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>
    </main>
  );
}