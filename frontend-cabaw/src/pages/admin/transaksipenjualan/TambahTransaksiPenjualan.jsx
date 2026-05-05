import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [diskon, setDiskon] = useState(0);
  const [prioritas, setPrioritas] = useState("-");
  const [alternatifList, setAlternatifList] = useState([]);
const [selectedAlternatif, setSelectedAlternatif] = useState(null);
const normalize = (val) => (val || "").toString().toLowerCase().trim();
const [showDropdown, setShowDropdown] = useState(false);
  
  // Tambahkan state loading di sini
  const [isLoadingDiskon, setIsLoadingDiskon] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/alternatif/list")
      .then(res => {

        console.log("DATA API:", res.data);
console.log("NAMA DIPILIH:", namaPelanggan);
console.log("PEDAGANG DIPILIH:", pedagang);
        setAlternatifList(res.data);
      })
      .catch(() => {
        console.log("Gagal ambil alternatif");
      });
  }, []);

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

  useEffect(() => {
    if (!namaPelanggan || !pedagang) {
      setDiskon(0);
      setPrioritas("-");
      return;
    }
  
    setIsLoadingDiskon(true);
  
    const delay = setTimeout(() => {
      axios.get("http://127.0.0.1:8000/api/hasil-perhitungan", {
        params: { tahun: new Date().getFullYear() - 1 }
      })
      .then(res => {
        const data = res.data;
  
        const found = data.find(item => 
          normalize(item.nama) === normalize(namaPelanggan) &&
          normalize(item.pedagang) === normalize(pedagang)
        );
  
        if (found) {
          setDiskon(found.diskon);
          setPrioritas(found.prioritas);
        } else {
          setDiskon(0);
          setPrioritas("Pelanggan Baru");
        }
      })
      .catch(() => {
        setDiskon(0);
        setPrioritas("Error");
      })
      .finally(() => {
        setIsLoadingDiskon(false);
      });
  
    }, 500);
  
    return () => clearTimeout(delay);
  }, [namaPelanggan, pedagang]);

  const totalPembelian = useMemo(() => {
    return Object.values(jumlah).reduce((acc, val) => acc + (parseInt(val) || 0), 0);
  }, [jumlah]);

  const totalHarga = useMemo(() => {
    const hargaNumber = parseInt(harga.replace(/\./g, "")) || 0;
    return totalPembelian * hargaNumber;
  }, [totalPembelian, harga]);

  const totalSetelahDiskon = useMemo(() => {
    return totalHarga - (totalHarga * diskon) / 100;
  }, [totalHarga, diskon]);

  const handleTambahProduk = (produk) => {
    const existing = selectedKerupuk.find((p) => p.name === produk.name);
    if (!existing) {
      setSelectedKerupuk([...selectedKerupuk, produk]);
      setJumlah({ ...jumlah, [produk.name]: 1 });
    } else {
      setJumlah({ ...jumlah, [produk.name]: (jumlah[produk.name] || 0) + 1 });
    }
  };

  const handleSimpan = async () => {
    if (!namaPelanggan || !pedagang || selectedKerupuk.length === 0) {
      alert("Mohon lengkapi data pelanggan dan pesanan");
      return;
    }

    if (diskon === 0 && prioritas !== "Pelanggan Baru") {
      alert("Diskon belum siap, tunggu sebentar...");
      return;
    }

    const payload = {
      nama_pelanggan: namaPelanggan,
      jenis_kelamin: jenisKelamin,
      tanggal,
      tempat_transaksi: tempatTransaksi,
      pedagang,
      total_pembelian: totalPembelian,
      total_harga: totalHarga, // ✅ BENAR
      harga_per_pcs: 2500,
      diskon: diskon,
      items: selectedKerupuk.map((item) => ({
        nama: item.name,
        jumlah: jumlah[item.name],
      })),
    };

    console.log("=== DEBUG SIMPAN ===");
console.log("Diskon:", diskon);
console.log("Prioritas:", prioritas);
console.log("Loading:", isLoadingDiskon);
console.log("Payload:", payload);

    try {
      await axios.post("http://127.0.0.1:8000/api/transaksi", payload);
      alert("Transaksi berhasil!");
      navigate("/admin/transaksi");
    } catch (error) {
      alert("Gagal menyimpan transaksi");
    }
  };

  const keyword = namaPelanggan.toLowerCase();

const filteredAlternatif = alternatifList.filter((item) => {
  return (
    (item.nama_alternatif || "").toLowerCase().includes(keyword) ||
    (item.pedagang || "").toLowerCase().includes(keyword)
  );
});

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-[30px]">
        <NavbarAdmin />
        <div className="p-8">
          <div className="grid grid-cols-3 gap-6">
            
            {/* LEFT SIDE: PRODUCT LIST */}
            <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <div className="bg-gray-300 text-gray-800 px-5 py-3 rounded-xl mb-6 font-semibold">
                Daftar Krupuk Cap Bawang
              </div>
              <div className="flex gap-3 mb-6">
                {["Semua", "Gurih", "Pedas", "Manis"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveFilter(tag)}
                    className={`px-4 py-2 rounded-full text-sm border transition bg-white text-black ${
                        activeFilter === tag ? "border-[#1E3A5F]" : "border-gray-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-5">
                {allProducts
                  .filter((item) => activeFilter === "Semua" || item.kategori === activeFilter)
                  .map((item, i) => (
                    <div key={i} onClick={() => handleTambahProduk(item)} className="bg-white rounded-xl p-3 cursor-pointer hover:shadow-md transition">
                      <img src={item.img} className="w-full h-[120px] object-cover rounded-lg" alt={item.name} />
                      <p className="text-sm font-semibold mt-2">{item.name}</p>
                      <p className="text-xs text-gray-500">Rp 2.500 / bungkus</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* RIGHT SIDE: FORM & CART */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="bg-[#1E3A5F] text-white px-5 py-3 rounded-xl mb-6 font-semibold">
                Tambah Transaksi Penjualan
              </div>
              <div className="space-y-4 mb-4">
              <div className="flex items-center gap-4">
  <label className="w-44 text-base font-medium text-gray-500">
    Nama Pelanggan
  </label>

  {/* SEARCH + DROPDOWN */}
  <div className="flex-1 relative">
    <input
      type="text"
      value={namaPelanggan}
      onChange={(e) => {
        setNamaPelanggan(e.target.value);
        setShowDropdown(true);
        setSelectedAlternatif(null);
      }}
      onFocus={() => setShowDropdown(true)}
      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      placeholder="Cari / pilih pelanggan..."
      className="w-full border rounded-lg px-3 py-2"
    />

    {showDropdown && (
      <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
        {alternatifList
          .filter((alt) =>
            (alt.nama_alternatif || "")
              .toLowerCase()
              .includes(namaPelanggan.toLowerCase())
          )
          .map((alt) => (
            <div
              key={alt.id_alternatif}
              onClick={() => {
                setSelectedAlternatif(alt);
                setNamaPelanggan(alt.nama_alternatif);
                setPedagang(alt.pedagang);
                setShowDropdown(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {alt.nama_alternatif} - {alt.pedagang}
            </div>
          ))}
      </div>
    )}
  </div>
</div>
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">Jenis Kelamin</label>
                  <select value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700">
                    <option value="">Pilih jenis kelamin</option>
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">Tanggal</label>
                  <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="flex-1 border rounded-lg px-3 py-2" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">Tempat Transaksi</label>
                  <input type="text" value={tempatTransaksi} onChange={(e) => setTempatTransaksi(e.target.value)} className="flex-1 border rounded-lg px-3 py-2" placeholder="Masukkan tempat transaksi" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">Pedagang</label>
                  <input
  type="text"
  value={pedagang}
  readOnly
  className="flex-1 border rounded-lg px-3 py-2 bg-gray-100"
/>
                </div>
              </div>

              {/* DAFTAR PESANAN */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold mb-3">Daftar Pesanan</h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {selectedKerupuk.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-100 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img src={item.img} className="w-14 h-14 object-contain bg-white rounded-lg p-1" alt={item.name} />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                          <p className="text-sm text-gray-500 font-medium">Rp2.500</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => {
                            const updated = { ...jumlah };
                            delete updated[item.name];
                            setJumlah(updated);
                            setSelectedKerupuk(selectedKerupuk.filter((k) => k.name !== item.name));
                        }} className="bg-red-400 text-white px-2 py-1 rounded-md">🗑</button>
                        <button onClick={() => setJumlah({ ...jumlah, [item.name]: Math.max(1, (jumlah[item.name] || 1) - 1) })} className="bg-yellow-400 px-3 py-1 rounded-md">-</button>
                        <input type="text" value={jumlah[item.name] ?? ""} readOnly className="w-10 text-center bg-transparent font-bold" />
                        <button onClick={() => setJumlah({ ...jumlah, [item.name]: (jumlah[item.name] || 1) + 1 })} className="bg-yellow-400 px-3 py-1 rounded-md">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col items-end text-right">
                  <p className="text-base text-gray-600">Total Item: <span className="font-semibold text-gray-800">{totalPembelian}</span></p>
                  <p className="text-2xl font-bold text-[#1E3A5F] mt-1">Rp {totalHarga.toLocaleString("id-ID")}</p>

                  <div className="mt-3">
                    {/* IMPLEMENTASI LOADING UI DI SINI */}
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                        isLoadingDiskon ? "bg-gray-100 text-gray-400 animate-pulse" : 
                        prioritas === "Prioritas Tinggi" ? "bg-green-100 text-green-700" :
                        prioritas === "Prioritas Sedang" ? "bg-yellow-100 text-yellow-700" :
                        prioritas === "Prioritas Rendah" ? "bg-blue-100 text-blue-700" :
                        prioritas === "Pelanggan Baru" ? "bg-gray-200 text-gray-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      {isLoadingDiskon ? "Mengecek status..." : prioritas}
                    </span>

                    <p className="text-sm text-gray-500 mt-2">
                      Diskon: <span className="text-green-600 font-bold">{diskon}%</span>
                    </p>
                    <p className="text-xl font-bold text-green-600 mt-1">
                      Total Bayar: Rp {totalSetelahDiskon.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 w-full">
                  <button onClick={() => navigate("/admin/transaksi")} className="flex-[3] px-6 py-3 rounded-xl border border-gray-300 text-gray-500 hover:bg-gray-50 transition-all font-medium">
                    Batal
                  </button>
                  <button onClick={handleSimpan} className="flex-[7] px-6 py-3 rounded-xl bg-[#1E3A5F] text-white font-semibold hover:opacity-90 shadow-lg transition-all">
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