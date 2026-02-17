import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarNavigation from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

export default function EditTransaksiPenjualan() {
  const navigate = useNavigate();
  // ==============================
  // SIMULASI DATA LAMA
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

  const daftarKerupuk = [
    "Uyel Putih",
    "Uyel Kuning",
    "Krupuk Ikan",
    "Krupuk Pedas",
    "Krupuk Gorok",
  ];

  // ==============================
  // LOAD DATA LAMA
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
  // FORMAT HARGA (2.500)
  // ==============================
  const handleHargaChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = new Intl.NumberFormat("id-ID").format(value);
    setHarga(value);
  };

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

  // ==============================
  // SELECT KERUPUK
  // ==============================
  const handleSelectKerupuk = (value) => {
    if (!value || value === "-Pilih jenis kerupuk-") return;

    if (!selectedKerupuk.includes(value)) {
      setSelectedKerupuk([...selectedKerupuk, value]);
      setJumlah({ ...jumlah, [value]: 0 });
    }
  };

  const handleJumlahChange = (item, value) => {
    setJumlah({
      ...jumlah,
      [item]: value,
    });
  };

  const handleRemoveItem = (item) => {
    const updatedSelected = selectedKerupuk.filter((i) => i !== item);
    const updatedJumlah = { ...jumlah };
    delete updatedJumlah[item];

    setSelectedKerupuk(updatedSelected);
    setJumlah(updatedJumlah);
  };

  const handleUpdate = () => {
    const payload = {
      nama,
      jenisKelamin,
      tanggal,
      bulan,
      tahun,
      tempat,
      harga: parseInt(harga.replace(/\./g, "")),
      totalPembelian,
      totalHarga,
      detail: jumlah,
    };

    console.log("Data Update:", payload);
    alert("Transaksi berhasil diperbarui ✅");
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
              Edit Transaksi Baru
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
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Jenis Kelamin
                  </label>
                  <select
                    value={jenisKelamin}
                    onChange={(e) => setJenisKelamin(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1E3A5F]"
                  >
                    <option>-Pilih jenis kelamin-</option>
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Bulan
                  </label>
                  <input
                    type="month"
                    value={bulan}
                    onChange={(e) => setBulan(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Tahun
                  </label>
                  <input
                    type="number"
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1E3A5F]"
                  />
                </div>

              </div>

              {/* ================= RIGHT ================= */}
              <div className="space-y-7">

                <div>
                  <label className="block mb-2 font-medium">
                    Jenis Kerupuk
                  </label>

                  <select
                    onChange={(e) =>
                      handleSelectKerupuk(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-3"
                  >
                    <option>-Pilih jenis kerupuk-</option>
                    {daftarKerupuk.map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <div className="space-y-3">
                    {selectedKerupuk.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border border-gray-300 rounded-xl px-4 py-3"
                      >
                        <span>{item}</span>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={jumlah[item] || ""}
                            onChange={(e) =>
                              handleJumlahChange(item, e.target.value)
                            }
                            className="w-20 border rounded-lg px-2 py-1 text-center"
                          />
                          <span className="text-gray-500">pcs</span>

                          <button
                            onClick={() => handleRemoveItem(item)}
                            className="text-red-500 text-sm hover:underline"
                          >
                            Hapus
                          </button>
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
                    value={harga}
                    onChange={handleHargaChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3"
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
                    onChange={(e) => setTempat(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

              </div>
            </div>

            <div className="flex justify-end gap-4 mt-16">
            <button
                onClick={() => navigate("/admin/transaksi")}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Batal
              </button>

              <button
                onClick={handleUpdate}
                className="px-6 py-3 rounded-xl bg-[#1E3A5F] text-white hover:opacity-90"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
