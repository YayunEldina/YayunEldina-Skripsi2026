export default function LandingPage() {
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
          <li className="font-semibold">Beranda</li>
          <li>Tentang Kami</li>
          <li>FAQ</li>
          <li className="font-semibold">Login</li>
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
          {["#B08968", "#8B1E1E", "#E5E5E5", "#1E3A5F"].map((color, i) => (
            <div key={i}>
              <div className="h-56 rounded-xl" style={{ backgroundColor: color }} />
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
          {["Gurih", "Pedas", "Manis"].map(tag => (
            <button key={tag} className="px-5 py-2 border rounded-full text-sm">
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
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
