import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarAdmin from "../dashboard/navbar_admin";

const LaporanDiskon = () => {
  const [laporanTransaksi, setLaporanTransaksi] = useState([]);
  const [dataSPK, setDataSPK] = useState([]);
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

  const normalize = (val) => (val || "").toString().toLowerCase().trim();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Ambil data transaksi realisasi laporan diskon
        const resLaporan = await axios.get(
          `http://127.0.0.1:8000/api/laporan-diskon?tahun=${tahun}`
        );
        setLaporanTransaksi(resLaporan.data || []);

        // 2. Ambil data ranking dari hasil perhitungan SPK (Mei 2026 menggunakan data SPK tahun 2025)
        const resSPK = await axios.get(
          `http://127.0.0.1:8000/api/hasil-perhitungan?tahun=2025`
        );
        
        // Filter hanya yang memiliki prioritas valid (Tinggi, Sedang, Rendah / Diskon 15% sampai 5%)
        const filteredSPK = (resSPK.data || []).filter(item => {
          const p = normalize(item.prioritas);
          return p.includes("tinggi") || p.includes("sedang") || p.includes("rendah");
        });

        // Urutkan data master SPK dari Prioritas Tinggi -> Sedang -> Rendah
        const sortedSPK = filteredSPK.sort((a, b) => {
          const bobot = { "prioritas tinggi": 3, "prioritas sedang": 2, "prioritas rendah": 1 };
          return (bobot[normalize(b.prioritas)] || 0) - (bobot[normalize(a.prioritas)] || 0);
        });

        setDataSPK(sortedSPK);
      } catch (err) {
        console.error("Gagal memuat data laporan diskon:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tahun]);

  // GROUP DATA TRANSAKSI PER BULAN
  const transaksiPerBulan = laporanTransaksi.reduce((acc, item) => {
    const bulan = item.bulan || "1";
    if (!acc[bulan]) acc[bulan] = [];
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
            Monitoring Penggunaan Kuota Diskon Pelanggan Berdasarkan Ranking Prioritas SPK
          </p>
        </div>

        {/* LOOP BULAN */}
        {Array.from({ length: 12 }, (_, index) => {
          const nomorBulan = index + 1;
          const bulanStr = nomorBulan.toString();

          // Sembunyikan Januari-April sesuai aturan bisnis tahun 2026 Anda
          if (tahun === "2026" && nomorBulan < 5) {
            return null;
          }

          // List riwayat transaksi realisasi yang terjadi di bulan berjalan
          const listTransaksiBulanIni = transaksiPerBulan[bulanStr] || [];

          let laporanBulanIni = [];

          // 🛠️ LOGIKA PERBAIKAN DI SINI: Memisahkan perlakuan bulan Mei dengan bulan lainnya
          if (nomorBulan === 5) {
            // KHUSUS BULAN MEI: Gabungkan dengan Master Data Ranking SPK
            laporanBulanIni = dataSPK.map((pelangganSPK) => {
              const sudahTransaksi = listTransaksiBulanIni.find(
                (t) =>
                  normalize(t.nama_pelanggan) === normalize(pelangganSPK.nama) &&
                  normalize(t.pedagang) === normalize(pelangganSPK.pedagang) &&
                  parseFloat(t.total_diskon || 0) > 0
              );

              if (sudahTransaksi) {
                return {
                  ...sudahTransaksi,
                  prioritas: pelangganSPK.prioritas,
                  isUsed: true,
                };
              } else {
                return {
                  id_transaksi: `not-used-${pelangganSPK.id_alternatif || pelangganSPK.id}`,
                  nama_pelanggan: pelangganSPK.nama,
                  pedagang: pelangganSPK.pedagang,
                  total_pembelian: 0,
                  total_harga: 0,
                  total_diskon: 0,
                  prioritas: pelangganSPK.prioritas,
                  isUsed: false,
                };
              }
            });
          } else {
            // BULAN SELAIN MEI (Juni, Juli, dst): Hanya tampilkan yang BENAR-BENAR bertransaksi diskon
            const transaksiValid = listTransaksiBulanIni.filter(
              (t) => parseFloat(t.total_diskon || 0) > 0
            );

            laporanBulanIni = transaksiValid.map((t) => ({
              ...t,
              prioritas: t.prioritas || "Pelanggan Lama",
              isUsed: true, // Karena datanya disaring dari transaksi real, otomatis statusnya sudah digunakan
            }));
          }

          return (
            <div
              key={bulanStr}
              className="bg-white border border-gray-300 mb-8 overflow-hidden rounded-lg shadow-sm"
            >
              {/* HEADER BULAN */}
              <div className="bg-gray-100 border-b border-gray-300 px-5 py-3 flex justify-between items-center">
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
                      <th className="border border-gray-300 px-4 py-3 text-left">Prioritas (Diskon)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Total Pembelian</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Total Harga</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Total Diskon</th>
                      <th className="border border-gray-300 px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="8"
                          className="border border-gray-300 text-center py-8 italic text-gray-500"
                        >
                          Sinkronisasi data SPK dan Transaksi...
                        </td>
                      </tr>
                    ) : laporanBulanIni.length > 0 ? (
                      laporanBulanIni.map((item, i) => {
                        return (
                          <tr
                            key={item.id_transaksi || i}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">{i + 1}</td>
                            <td className="border border-gray-300 px-4 py-3 font-medium text-gray-800">
                              {item.nama_pelanggan}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">{item.pedagang}</td>
                            <td className="border border-gray-300 px-4 py-3 font-medium text-blue-800">
                              {item.prioritas}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">
                              {item.total_pembelian} pcs
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">
                              Rp {parseFloat(item.total_harga || 0).toLocaleString("id-ID")}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-green-600 font-semibold">
                              Rp {parseFloat(item.total_diskon || 0).toLocaleString("id-ID")}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center">
                              {item.isUsed ? (
                                <span className="inline-block bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-xs font-bold shadow-sm">
                                  Sudah Digunakan
                                </span>
                              ) : (
                                <span className="inline-block bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded-md text-xs font-bold shadow-sm">
                                  Tidak Digunakan
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="border border-gray-300 text-center py-8 text-gray-400 italic"
                        >
                          Tidak ada data penggunaan diskon bulan ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LaporanDiskon;