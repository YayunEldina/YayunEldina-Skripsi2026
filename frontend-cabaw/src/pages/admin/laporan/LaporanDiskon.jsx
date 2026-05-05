import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarAdmin from "../dashboard/navbar_admin";

const LaporanDiskon = () => {
  const [data, setData] = useState([]);
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/laporan-diskon?tahun=${tahun}`
      );
      console.log("DATA API:", res.data); // 🔥 tambah ini
      setData(res.data);
    } catch (err) {
      console.error("Gagal ambil laporan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tahun]);

  // 🔥 AUTO TAHUN
  const tahunList = Array.from(
    { length: new Date().getFullYear() - 2020 },
    (_, i) => (2021 + i).toString()
  );

  return (
    <div className="min-h-screen bg-white">
      <NavbarAdmin />

      <div className="pt-20 px-8">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-[#1E3A5F] mb-6">
          Laporan Periodik Diskon
        </h1>

        {/* FILTER TAHUN */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tahunList.map((y) => (
            <button
              key={y}
              onClick={() => setTahun(y)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                tahun === y
                  ? "bg-[#1E3A5F] text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#F1F5F9] text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left">No</th>
                <th className="px-4 py-3 text-left">Nama Pelanggan</th>
                <th className="px-4 py-3 text-left">Pedagang</th>
                <th className="px-4 py-3 text-left">Total Transaksi</th>
                <th className="px-4 py-3 text-left">Total Pembelian</th>
                <th className="px-4 py-3 text-left">Total Harga</th>
                <th className="px-4 py-3 text-left">Total Diskon</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 italic">
                    Memuat data...
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">
                      {item.nama_pelanggan}
                    </td>
                    <td className="px-4 py-3">{item.pedagang}</td>
                    <td className="px-4 py-3">{item.total_transaksi}</td>
                    <td className="px-4 py-3">{item.total_pembelian}</td>
                    <td className="px-4 py-3">
  Rp{" "}
  {parseFloat(item.total_harga || 0).toLocaleString("id-ID")}
</td>

<td className="px-4 py-3 text-green-600 font-semibold">
  Rp{" "}
  {parseFloat(item.total_diskon || 0).toLocaleString("id-ID")}
</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-red-500 italic"
                  >
                    Tidak ada data laporan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default LaporanDiskon;