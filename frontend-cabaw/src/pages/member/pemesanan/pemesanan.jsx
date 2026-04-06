import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarMember from "../dashboard/navbar_member";

// Dummy image
import ProductImg from "../../../assets/capbawang.jpeg";

const Pemesanan = () => {
  const navigate = useNavigate();

  const [userLogin, setUserLogin] = useState({ nama_pelanggan: "", alamat: "" });
  const [diskonPersen, setDiskonPersen] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Data User Login:", storedUser);

    if (storedUser) {
      // Ambil Sarimi dari nama_pelanggan untuk dicocokkan ke API SPK
      const currentName = storedUser.nama_pelanggan || ""; 
      setUserLogin(storedUser);
      
      if (currentName) {
        checkDiscountFromSPK(currentName);
      } else {
        setLoading(false);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const checkDiscountFromSPK = async (namaPelanggan) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/proses-perhitungan?tahun=2021`);
      const result = await response.json();

      // Pencocokan fleksibel agar 'user_sarimi988' atau 'Sarimi' tetap dapat diskon
      const dataSPK = result.hasil_akhir.find((item) => 
        namaPelanggan.toLowerCase().includes(item.nama.toLowerCase()) ||
        item.nama.toLowerCase().includes(namaPelanggan.toLowerCase())
      );

      if (dataSPK) {
        console.log("Data SPK Ditemukan:", dataSPK);
        if (dataSPK.nilai_v >= 0.7) setDiskonPersen(15);
        else if (dataSPK.nilai_v >= 0.5) setDiskonPersen(10);
        else setDiskonPersen(5);
      } else {
        setDiskonPersen(0);
      }
    } catch (error) {
      console.error("Gagal sinkronisasi diskon SPK:", error);
    } finally {
      setLoading(false);
    }
  };

  const products = [
    { name: "Krupuk Bawang", price: "2.500", qty: 4 },
    { name: "Krupuk Ikan", price: "2.500", qty: 2 },
    { name: "Krupuk Udang", price: "2.500", qty: 4 },
    { name: "Krupuk Keong", price: "2.500", qty: 2 },
  ];

  const subtotal = products.reduce((acc, item) => {
    const priceInt = parseInt(item.price.replace(".", ""));
    return acc + (priceInt * item.qty);
  }, 0);

  const nilaiPotongan = (subtotal * diskonPersen) / 100;
  const totalBayar = subtotal - nilaiPotongan;

  return (
    <>
      <NavbarMember />

      <main className="pt-24 px-14 pb-16 bg-white min-h-screen">
        <div className="grid grid-cols-12 gap-12">

          <section className="col-span-7 space-y-8">
            <button
              onClick={() => navigate("/member/dashboard")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1E3A8A] transition"
            >
              ← Kembali ke Dashboard
            </button>
            <h1 className="text-3xl font-bold">Pembelian</h1>

            <div>
              <p className="font-medium mb-2">Alamat Pengiriman</p>
              <div className="border-b border-[#E5E5EA] pb-4">
                <p className="font-bold uppercase">{userLogin.nama_pelanggan || "PELANGGAN"}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {userLogin.alamat || "Alamat belum diatur di profil."}
                </p>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">Voucher Diskon (SPK)</p>
              <div className="border-b border-[#E5E5EA] pb-4">
                {loading ? (
                  <p className="text-sm text-gray-400 animate-pulse">Mengecek status prioritas...</p>
                ) : diskonPersen > 0 ? (
                  <div className="inline-flex items-center gap-3 border border-blue-200 bg-blue-50 rounded-xl px-4 py-2">
                    <span className="font-bold text-lg text-blue-700">{diskonPersen}%</span>
                    <span className="text-xs text-blue-600 font-medium">Diskon Khusus Pelanggan Terpilih</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Maaf, belum ada diskon tersedia untuk Anda saat ini.</p>
                )}
              </div>
            </div>

            <div>
              <p className="font-medium mb-4">Daftar Pembelian</p>
              <div className="grid grid-cols-2 gap-6">
                {products.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                      <img src={ProductImg} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500">Rp {item.price}</p>
                    </div>
                    <span className="text-sm font-medium">x{item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="col-span-5">
            <div className="border border-[#E5E5EA] rounded-3xl p-8 sticky top-28 shadow-sm">
              <h2 className="text-sm font-semibold mb-6">Rincian Pembayaran</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal Pemesanan</span>
                  <span className="font-medium">Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Diskon SPK</span>
                  <span className="text-red-500 font-medium">- Rp {nilaiPotongan.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <hr className="my-6" />
              <div className="flex justify-between text-base font-bold text-[#1E3A8A]">
                <span>Total Pembayaran</span>
                <span>Rp {totalBayar.toLocaleString("id-ID")}</span>
              </div>
              <div className="mt-8">
                <div className="bg-[#F2F4F7] rounded-2xl px-6 py-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Total Akhir</p>
                    <p className="text-xl font-black">Rp {totalBayar.toLocaleString("id-ID")}</p>
                    {nilaiPotongan > 0 && (
                       <p className="text-[10px] text-red-500 font-bold italic">Hemat Rp {nilaiPotongan.toLocaleString("id-ID")}</p>
                    )}
                  </div>
                  <button className="bg-[#1E3A8A] hover:bg-[#172554] transition-all text-white px-6 py-3 rounded-xl text-xs font-bold shadow-lg active:scale-95">
                    Buat Pesanan
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default Pemesanan;