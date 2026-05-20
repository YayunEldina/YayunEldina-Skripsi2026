import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarAdmin from "../dashboard/navbar_admin";

const LaporanDiskon = () => {
  const [data, setData] = useState([]);
  const [tahun] = useState("2026");
  const [loading, setLoading] = useState(true);

  const namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/laporan-diskon?tahun=${tahun}`
      );
      setData(res.data);
    } catch (err) {
      console.error("Gagal ambil laporan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // GROUP DATA PER BULAN
  const groupedData = data.reduce((acc, item) => {
    const bulan = item.bulan || "1";
    if (!acc[bulan]) {
      acc[bulan] = [];
    }
    acc[bulan].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <NavbarAdmin />

      <div className="pt-20 px-8 pb-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1E3A5F]">
            Laporan Periodik Diskon {tahun}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Data laporan diskon pelanggan per bulan
          </p>
        </div>

        {/* LOOP BULAN */}
        {Object.keys(groupedData).length > 0 || loading ? (
          Array.from({ length: 12 }, (_, index) => {
            const nomorBulan = index + 1;
            const bulan = nomorBulan.toString();
            const laporanBulan = groupedData[bulan] || [];

            // Sembunyikan Januari-April
            if (tahun === "2026" && nomorBulan < 5) {
              return null;
            }

            return (
              <div
                key={bulan}
                className="bg-white border border-gray-300 mb-8 overflow-hidden"
              >
                {/* HEADER BULAN */}
                <div className="bg-gray-100 border-b border-gray-300 px-5 py-3">
                  <h2 className="font-semibold text-[#1E3A5F]">
                    {namaBulan[index]} {tahun}
                  </h2>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-[#F8FAFC]">
                      <tr>
                        <th className="border border-gray-300 px-4 py-3 text-left">No</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Nama Pelanggan</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Pedagang</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Total Transaksi</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Total Pembelian</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Total Harga</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Total Diskon</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="border border-gray-300 text-center py-8 italic text-gray-500"
                          >
                            Memuat data...
                          </td>
                        </tr>
                      ) : laporanBulan.length > 0 ? (
                        laporanBulan.map((item, i) => {
                          const uniqueKey = `${item.id_transaksi}-${i}`;
                          return (
                            <tr
                              key={uniqueKey}
                              className="hover:bg-gray-50 transition"
                            >
                              <td className="border border-gray-300 px-4 py-3">{i + 1}</td>
                              <td className="border border-gray-300 px-4 py-3 font-medium">{item.nama_pelanggan}</td>
                              <td className="border border-gray-300 px-4 py-3">{item.pedagang}</td>
                              <td className="border border-gray-300 px-4 py-3">1</td>
                              <td className="border border-gray-300 px-4 py-3">{item.total_pembelian}</td>
                              <td className="border border-gray-300 px-4 py-3">
                                Rp {parseFloat(item.total_harga || 0).toLocaleString("id-ID")}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-green-600 font-semibold">
                                Rp {parseFloat(item.total_diskon || 0).toLocaleString("id-ID")}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="border border-gray-300 text-center py-8 text-gray-400 italic"
                          >
                            Tidak ada data bulan ini
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-gray-300 rounded-lg p-10 text-center text-gray-500 italic">
            Tidak ada data laporan
          </div>
        )}
      </div>
    </div>
  );
};

export default LaporanDiskon;