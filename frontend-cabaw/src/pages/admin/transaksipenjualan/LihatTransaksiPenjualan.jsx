import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SidebarNavigation from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";

export default function LihatTransaksiPenjualan() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [tempatTransaksi, setTempatTransaksi] = useState("");
  const [pedagang, setPedagang] = useState("");
  const [selectedKerupuk, setSelectedKerupuk] = useState([]);
  const [jumlah, setJumlah] = useState({});
  const [harga] = useState("2500");

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/transaksi/${id}`);

        const data = res.data.data || res.data;

        // 🔥 FIX UTAMA DI SINI
        setNamaPelanggan(data.pelanggan?.nama_pelanggan || "");
        setJenisKelamin(data.pelanggan?.jenis_kelamin || "");

        setTanggal(data.tanggal ? data.tanggal.split(" ")[0] : "");
        setTempatTransaksi(data.tempat_transaksi || "");
        setPedagang(data.pedagang || "");

        const details = data.detail_transaksi || [];

        const itemsMap = {};
        const itemsLabel = [];

        details.forEach((dt) => {
          const nama = dt.produk?.nama_produk || dt.nama_produk;
          if (nama) {
            itemsMap[nama] = dt.jumlah || 0;
            itemsLabel.push(nama);
          }
        });

        setJumlah(itemsMap);
        setSelectedKerupuk(itemsLabel);

      } catch (err) {
        alert("Gagal ambil data!");
        navigate("/admin/transaksi");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, navigate]);

  // ================= TOTAL =================
  const totalPembelian = useMemo(() => {
    return Object.values(jumlah).reduce(
      (acc, val) => acc + (parseInt(val) || 0),
      0
    );
  }, [jumlah]);

  const totalHarga = useMemo(() => {
    return totalPembelian * (parseInt(harga) || 0);
  }, [totalPembelian, harga]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#F4F7FE] min-h-screen">

      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-full w-[260px] z-40">
        <SidebarNavigation />
      </div>

      {/* MAIN */}
      <div className="ml-[260px] flex flex-col min-h-screen">

        {/* NAVBAR */}
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <NavbarAdmin />
        </div>

        {/* CONTENT */}
        <div className="px-10 py-10">
          <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-md">

            <h1 className="text-2xl font-bold mb-12 text-[#1E3A5F]">
              Detail Transaksi
            </h1>

            <div className="grid grid-cols-2 gap-14">

              {/* KIRI */}
              <div className="space-y-7">

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Nama Pelanggan
                  </label>
                  <input
                    value={namaPelanggan}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Jenis Kelamin
                  </label>
                  <input
                    value={jenisKelamin}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={tanggal}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Tempat Transaksi
                  </label>
                  <input
                    value={tempatTransaksi}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

              </div>

              {/* KANAN */}
              <div className="space-y-7">

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Jenis Kerupuk
                  </label>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedKerupuk.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center border border-gray-200 rounded-xl px-4 py-3 bg-white shadow-sm"
                      >
                        <span>{item}</span>

                        <input
                          type="number"
                          value={jumlah[item]}
                          readOnly
                          className="w-20 border border-gray-300 rounded text-center bg-gray-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Nama Pedagang
                  </label>
                  <input
                    value={pedagang}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

                {/* TOTAL */}
                <div className="pt-6 border-t">
                  <div className="flex justify-between">
                    <span>Total Pembelian:</span>
                    <span>{totalPembelian} pcs</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1E3A5F]">
                    <span>Total Harga:</span>
                    <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="flex justify-end mt-16">
              <button
                onClick={() => navigate("/admin/transaksi")}
                className="px-8 py-3 bg-[#1E3A5F] text-white rounded-xl"
              >
                Kembali
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}