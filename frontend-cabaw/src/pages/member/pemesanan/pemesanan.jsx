import React from "react";
import { useNavigate } from "react-router-dom";
import NavbarMember from "../dashboard/navbar_member";

// Dummy image
import ProductImg from "../../../assets/capbawang.jpeg";

const Pemesanan = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavbarMember />

      <main className="pt-24 px-14 pb-16 bg-white min-h-screen">
        <div className="grid grid-cols-12 gap-12">

          {/* ================= LEFT CONTENT ================= */}
          <section className="col-span-7 space-y-8">
              {/* BACK TO DASHBOARD */}
              <button
              onClick={() => navigate("/member/dashboard")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1E3A8A] transition"
            >
              ← Kembali ke Dashboard
            </button>
            <h1 className="text-3xl font-bold">Pembelian</h1>

            {/* ALAMAT */}
            <div>
              <p className="font-medium mb-2">Alamat</p>
              <div className="border-b border-[#E5E5EA] pb-4">
                <p className="font-bold">YAYUN ELDINA</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  RT.013/RW.004, Desa Nglebeng, Panggul, Trenggalek,
                  Jawa Timur 66364
                </p>
              </div>
            </div>

            {/* DISKON */}
            <div>
              <p className="font-medium mb-2">Diskon</p>
              <div className="border-b border-[#E5E5EA] pb-4">
                <div className="inline-flex items-center gap-3 border rounded-xl px-4 py-2">
                  <span className="font-bold text-lg">10%</span>
                  <span className="text-xs text-gray-500">Pelanggan terpilih</span>
                </div>
              </div>
            </div>

            {/* DAFTAR PEMBELIAN */}
            <div>
              <p className="font-medium mb-4">Daftar Pembelian</p>

              <div className="grid grid-cols-2 gap-6">

                {products.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={ProductImg}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">Rp {item.price}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        ⭐⭐⭐⭐ 4.5
                      </p>
                    </div>

                    <span className="text-sm font-medium">x{item.qty}</span>
                  </div>
                ))}

              </div>
            </div>
          </section>

          {/* ================= RIGHT CONTENT ================= */}
          <aside className="col-span-5 space-y-3">

            <div className="border border-[#E5E5EA] rounded-2xl p-8 h-full flex flex-col">
              <h2 className="text-sm font-semibold mb-6">Rincian Pembayaran</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal Pemesanan</span>
                  <span>Rp 30.000</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Diskon</span>
                  <span className="text-red-500">-Rp 10.000</span>
                </div>
              </div>

              <hr className="my-6" />

              <div className="flex justify-between text-sm">
                <span>Total Pembayaran</span>
                <span>Rp 20.000</span>
              </div>

              {/* BAGIAN BAWAH — NEMPEL BAWAH */}
              <div className="mt-auto pt-8">
                <div className="bg-[#EDEEF2] rounded-xl px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Total</p>
                    <p className="text-lg font-bold">Rp 20.000</p>
                    <p className="text-xs text-red-500">Hemat Rp 10.000</p>
                  </div>

                  <button className="bg-[#1E3A8A] hover:bg-[#172554] transition text-white px-5 py-2 rounded-xl text-xs font-medium">
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

// ================= DUMMY DATA =================

const products = [
  { name: "Krupuk Bawang", price: "2.500", qty: 4 },
  { name: "Krupuk Ikan", price: "2.500", qty: 2 },
  { name: "Krupuk Udang", price: "2.500", qty: 4 },
  { name: "Krupuk Keong", price: "2.500", qty: 2 },
];
