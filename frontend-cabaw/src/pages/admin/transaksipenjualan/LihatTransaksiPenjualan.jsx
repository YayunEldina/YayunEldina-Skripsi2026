import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarNavigation from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

export default function LihatTransaksiPenjualan() {
    const navigate = useNavigate();


  // ==============================
  // SIMULASI DATA (NANTI DARI API)
  // ==============================
  const dataLama = {
    nama: "Yayun",
    jenisKelamin: "Perempuan",
    tanggal: "2026-02-16",
    bulan: "2026-02",
    tahun: "2026",
    tempat: "Pasar Panggul",
    harga: "2.500",
    items: {
      "Uyel Putih": 10,
      "Krupuk Pedas": 5,
    },
  };

  const [nama, setNama] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [tempat, setTempat] = useState("");

  const [selectedKerupuk, setSelectedKerupuk] = useState([]);
  const [jumlah, setJumlah] = useState({});
  const [harga, setHarga] = useState("");

  // ==============================
  // LOAD DATA
  // ==============================
  useEffect(() => {
    setNama(dataLama.nama);
    setJenisKelamin(dataLama.jenisKelamin);
    setTanggal(dataLama.tanggal);
    setBulan(dataLama.bulan);
    setTahun(dataLama.tahun);
    setTempat(dataLama.tempat);
    setHarga(dataLama.harga);
    setSelectedKerupuk(Object.keys(dataLama.items));
    setJumlah(dataLama.items);
  }, []);

  // ==============================
  // TOTAL PEMBELIAN
  // ==============================
  const totalPembelian = useMemo(() => {
    return Object.values(jumlah).reduce(
      (acc, val) => acc + (parseInt(val) || 0),
      0
    );
  }, [jumlah]);

  // ==============================
  // TOTAL HARGA
  // ==============================
  const totalHarga = useMemo(() => {
    const hargaNumber = parseInt(harga.replace(/\./g, "")) || 0;
    return totalPembelian * hargaNumber;
  }, [totalPembelian, harga]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID").format(number);
  };

  return (
    <div className="bg-white min-h-screen">

      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-full w-[260px] z-40">
        <SidebarNavigation />
      </div>

      {/* MAIN */}
      <div className="ml-[260px] flex flex-col min-h-screen">

        <div className="sticky top-0 z-30 bg-[#F8F9FC]">
          <NavbarAdmin />
        </div>

        <div className="px-5 mt-10">
          <TampilanElemen />
        </div>

        <div className="px-10 py-8">
          <div className="bg-white rounded-3xl border border-gray-200 p-10">

            <h1 className="text-2xl font-bold mb-12">
              Detail Transaksi
            </h1>

            <div className="grid grid-cols-2 gap-14">

              {/* ================= LEFT ================= */}
              <div className="space-y-7">

                <div>
                  <label className="block mb-2 font-medium">
                    Nama Pengguna
                  </label>
                  <input
                    type="text"
                    value={nama}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Jenis Kelamin
                  </label>
                  <input
                    type="text"
                    value={jenisKelamin}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
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
                  <label className="block mb-2 font-medium">
                    Bulan
                  </label>
                  <input
                    type="month"
                    value={bulan}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Tahun
                  </label>
                  <input
                    type="number"
                    value={tahun}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

              </div>

              {/* ================= RIGHT ================= */}
              <div className="space-y-7">

                <div>
                  <label className="block mb-2 font-medium">
                    Jenis Kerupuk
                  </label>

                  <div className="space-y-3">
                    {selectedKerupuk.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
                      >
                        <span>{item}</span>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={jumlah[item]}
                            readOnly
                            className="w-20 border rounded-lg px-2 py-1 text-center bg-gray-100"
                          />
                          <span className="text-gray-500">pcs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Harga per Pcs
                  </label>
                  <input
                    type="text"
                    value={`Rp ${harga}`}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Total Pembelian
                  </label>
                  <input
                    type="number"
                    value={totalPembelian}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Total Harga
                  </label>
                  <input
                    type="text"
                    value={`Rp ${formatRupiah(totalHarga)}`}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Tempat Transaksi
                  </label>
                  <input
                    type="text"
                    value={tempat}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

              </div>
            </div>

            <div className="flex justify-end mt-16">
            <button
  onClick={() => navigate("/admin/transaksi")}
  className="px-6 py-3 rounded-xl bg-[#1E3A5F] text-white hover:opacity-90"
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
