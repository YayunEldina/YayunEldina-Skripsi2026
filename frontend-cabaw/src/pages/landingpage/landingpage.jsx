import { Link } from "react-router-dom";
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

export default function LandingPage() {
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
    <main className="bg-white text-gray-900">

      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center justify-between px-16 py-6">
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-gray-300 rounded" />
    <div>
      <p className="font-bold text-sm">Cabaw</p>
      <p className="text-xs text-gray-500">Krupuk Cap Bawang</p>
    </div>
  </div>

  <ul className="flex items-center gap-8 text-sm">
    <li className="font-semibold cursor-pointer">Beranda</li>
    <li className="cursor-pointer">Tentang Kami</li>
    <li className="cursor-pointer">FAQ</li>

    {/* LOGIN */}
    <li className="font-semibold">
      <Link
        to="/login"
        className="hover:text-[#1E3A8A] transition"
      >
        Login
      </Link>
    </li>
  </ul>
</nav>

      {/* ================= HERO ================= */}
      <section className="px-16 py-16 grid grid-cols-2 gap-10 items-start">
        <div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Akses ke Krupuk <br />
            <span className="text-black">Cap Bawang</span> Berkualitas Tinggi
          </h1>

          <p className="text-gray-600 mb-8 max-w-md">
            Website ini memperkenalkan Krupuk Cap Bawang dari Trenggalek
            dengan cita rasa autentik, gurih, dan renyah melalui tampilan
            digital yang interaktif.
          </p>

          <div className="flex gap-6 mt-8">
            <div className="flex-1 h-[220px] rounded-2xl bg-yellow-400" />
            <div className="flex-1 h-[220px] rounded-2xl bg-gray-200" />
            <div className="flex-1 h-[220px] rounded-2xl bg-[#B08968]" />
          </div>
        </div>

        <div className="flex flex-col items-center self-start mt-12">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-gray-300 rounded-full" />
            <div className="w-14 h-14 bg-yellow-400 rounded-full -ml-4" />
            <div className="w-14 h-14 bg-blue-500 rounded-full -ml-4" />
          </div>
          <p className="font-bold">500+</p>
          <p className="text-sm text-gray-500">Happy Customers</p>
        </div>
      </section>

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

      {/* ================= TESTIMONI ================= */}
      <section className="px-16 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pelanggan Kami Bahagia
        </h2>

        <div className="grid grid-cols-2 gap-8">
          {["Berliani", "Putri"].map(name => (
            <div key={name} className="p-6 border rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-gray-400">10/10/2022</p>
                </div>
              </div>
              <p className="text-sm mb-2 font-semibold">
                Krupuk Favorit Keluarga
              </p>
              <p className="text-sm text-gray-600">
                Setiap kali makan keluarga saya selalu minta krupuk ini.
                Rasanya gurih dan renyah!
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0F2A44] text-white px-16 py-16">
        <div className="grid grid-cols-4 gap-10">
          <div>
            <h3 className="font-bold text-lg mb-2">Cabaw</h3>
            <p className="text-sm text-gray-300">
              Dibuat dengan cinta di Trenggalek
            </p>
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
