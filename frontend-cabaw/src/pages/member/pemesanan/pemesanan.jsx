import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarMember from "../dashboard/navbar_member";
import ProductImg from "../../../assets/capbawang.jpeg";

const Pemesanan = () => {
  const navigate = useNavigate();
  const [userLogin, setUserLogin] = useState({});
  const [diskonPersen, setDiskonPersen] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserLogin(storedUser);
      checkDiscount(storedUser.nama_pelanggan);
    } else { navigate("/login"); }
  }, []);

  const checkDiscount = async (nama) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/proses-perhitungan?tahun=2025`);
      const result = await res.json();
      const data = result.hasil_akhir.find(item => item.nama.toLowerCase() === nama.toLowerCase());
      if (data) setDiskonPersen(data.diskon);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const products = [{ name: "Krupuk Bawang", price: 2500, qty: 4 }];
  const subtotal = products.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const potongan = (subtotal * diskonPersen) / 100;
  const total = subtotal - potongan;

  return (
    <>
      <NavbarMember />
      <main className="pt-24 px-14 bg-white min-h-screen">
        <div className="grid grid-cols-12 gap-12">
          <section className="col-span-7 space-y-6">
            <h1 className="text-3xl font-bold">Pembelian</h1>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">Penerima:</p>
              <p className="font-bold">{userLogin.nama_pelanggan}</p>
            </div>
            <div className="p-4 border-2 border-green-100 bg-green-50 rounded-xl">
              <p className="text-xs text-green-700 font-bold uppercase">Reward Loyalitas SPK</p>
              <p className="text-2xl font-black text-green-800">{diskonPersen}% OFF</p>
              <p className="text-[10px] text-green-600 italic">Diskon otomatis berdasarkan peringkat Anda di tahun 2025</p>
            </div>
          </section>
          <aside className="col-span-5 p-8 border rounded-3xl h-fit">
            <h2 className="font-bold mb-4">Rincian Bayar</h2>
            <div className="flex justify-between text-sm mb-2"><span>Subtotal</span><span>Rp {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm text-red-500 mb-4"><span>Diskon SPK</span><span>- Rp {potongan.toLocaleString()}</span></div>
            <div className="flex justify-between text-xl font-bold text-blue-900 border-t pt-4"><span>Total</span><span>Rp {total.toLocaleString()}</span></div>
            <button className="w-full mt-6 bg-blue-900 text-white py-3 rounded-xl font-bold">Buat Pesanan</button>
          </aside>
        </div>
      </main>
    </>
  );
};

export default Pemesanan;