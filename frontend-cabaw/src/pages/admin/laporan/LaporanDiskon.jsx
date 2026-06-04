import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import NavbarAdmin from "../dashboard/navbar_admin";

const LaporanDiskon = () => {
  const [laporanTransaksi, setLaporanTransaksi] = useState([]);
  const [tahun] = useState("2026");
  const [loading, setLoading] = useState(true);
  
  // State untuk menampung data SPK spesifik tiap bulan
  const [dataSPKPerBulan, setDataSPKPerBulan] = useState({});

  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const normalize = (val) => (val || "").toString().toLowerCase().trim();

  const dapatkanPersenDiskon = (prioritasStr) => {
    const p = normalize(prioritasStr);
    if (p.includes("tinggi")) return "15%";
    if (p.includes("sedang")) return "10%";
    if (p.includes("rendah")) return "5%";
    return "0%";
  };

  // 🛠️ PERBAIKAN: Fungsi fetch sekarang menerima parameter tahunSumber secara dinamis
  const fetchSPKBulanDinamis = useCallback(async (bulanSumber, tahunSumber, nomorBulanUrutan) => {
    // Jika data untuk bulan ini sudah ada di state, tidak perlu fetch ulang
    if (dataSPKPerBulan[nomorBulanUrutan]) return;

    try {
      let url = `http://127.0.0.1:8000/api/hasil-perhitungan?tahun=${tahunSumber}`;
      if (bulanSumber !== null) {
        url += `&bulan=${bulanSumber}`;
      } else {
        url += `&bulan=null`;
      }

      const resSPK = await axios.get(url);
      
      const filteredSPK = (resSPK.data || []).filter(item => {
        const p = normalize(item.prioritas);
        return p.includes("tinggi") || p.includes("sedang") || p.includes("rendah");
      });

      const sortedSPK = filteredSPK.sort((a, b) => {
        const bobot = { "prioritas tinggi": 3, "prioritas sedang": 2, "prioritas rendah": 1 };
        return (bobot[normalize(b.prioritas)] || 0) - (bobot[normalize(a.prioritas)] || 0);
      });

      setDataSPKPerBulan(prev => ({
        ...prev,
        [nomorBulanUrutan]: sortedSPK
      }));
    } catch (err) {
      console.error(`Gagal memuat data SPK bulan urutan ${nomorBulanUrutan}:`, err);
    }
  }, [dataSPKPerBulan]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Hanya mengambil data transaksi realisasi tahun berjalan
        const resLaporan = await axios.get(
          `http://127.0.0.1:8000/api/laporan-diskon?tahun=${tahun}`
        );
        setLaporanTransaksi(resLaporan.data || []);
      } catch (err) {
        console.error("Gagal memuat data laporan transaksi diskon:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tahun]);

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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1E3A5F]">
            Laporan Periodik Diskon {tahun}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Monitoring Penggunaan Kuota Diskon Pelanggan Berdasarkan Ranking Prioritas SPK
          </p>
        </div>

        {Array.from({ length: 12 }, (_, index) => {
          const nomorBulan = index + 1;
          const bulanStr = nomorBulan.toString();

          if (tahun === "2026" && nomorBulan < 5) {
            return null;
          }

          // 🛠️ PERBAIKAN LOGIKA: Penentuan bulan sumber & tahun sumber SPK sesuai data slide 2 Anda
          let bulanSumber = null;
          let tahunSumberSPK = tahun;

          if (nomorBulan === 5) {
            // Mei 2026 mengambil data SPK tahun 2025 (bulan kosong/null)
            bulanSumber = null; 
            tahunSumberSPK = "2025";
          } else if (nomorBulan === 6) {
            // Juni 2026 mengambil ranking Mei 2026 (yang di DB tersimpan sebagai tahun 2026, bulan null)
            bulanSumber = null; 
            tahunSumberSPK = "2026"; 
          } else {
            // Juli 2026 ke atas mengikuti pola normal (mengambil bulan sebelumnya)
            bulanSumber = nomorBulan - 1;
            tahunSumberSPK = tahun;
          }

          // Picu pemanggilan API untuk bulan terkait dengan parameter dinamis baru
          fetchSPKBulanDinamis(bulanSumber, tahunSumberSPK, nomorBulan);

          const listTransaksiBulanIni = transaksiPerBulan[bulanStr] || [];
          const dataSPKSpesifik = dataSPKPerBulan[nomorBulan] || [];

          const laporanBulanIni = dataSPKSpesifik.map((pelangganSPK) => {
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

          return (
            <div key={bulanStr} className="bg-white border border-gray-300 mb-8 overflow-hidden rounded-lg shadow-sm">
              <div className="bg-gray-100 border-b border-gray-300 px-5 py-3 flex justify-between items-center">
                <h2 className="font-semibold text-[#1E3A5F]">
                  {namaBulan[index]} {tahun}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-[#F8FAFC]">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left">No</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Nama Pelanggan</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Pedagang</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Prioritas</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Diskon (%)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Total Pembelian</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Total Harga</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Total Diskon</th>
                      <th className="border border-gray-300 px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="9" className="border border-gray-300 text-center py-8 italic text-gray-500">
                          Sinkronisasi data SPK dan Transaksi...
                        </td>
                      </tr>
                    ) : laporanBulanIni.length > 0 ? (
                      laporanBulanIni.map((item, i) => (
                        <tr key={item.id_transaksi || i} className="hover:bg-gray-50 transition">
                          <td className="border border-gray-300 px-4 py-3 text-gray-600">{i + 1}</td>
                          <td className="border border-gray-300 px-4 py-3 font-medium text-gray-800">{item.nama_pelanggan}</td>
                          <td className="border border-gray-300 px-4 py-3 text-gray-600">{item.pedagang}</td>
                          <td className="border border-gray-300 px-4 py-3 text-gray-800">{item.prioritas}</td>
                          <td className="border border-gray-300 px-4 py-3 text-gray-600">{dapatkanPersenDiskon(item.prioritas)}</td>
                          <td className="border border-gray-300 px-4 py-3 text-gray-600">{item.total_pembelian} pcs</td>
                          <td className="border border-gray-300 px-4 py-3 text-gray-600">Rp {parseFloat(item.total_harga || 0).toLocaleString("id-ID")}</td>
                          <td className="border border-gray-300 px-4 py-3 text-gray-600">Rp {parseFloat(item.total_diskon || 0).toLocaleString("id-ID")}</td>
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            {item.isUsed ? (
                              <span className="inline-block bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-xs font-bold shadow-sm">Sudah Digunakan</span>
                            ) : (
                              <span className="inline-block bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded-md text-xs font-bold shadow-sm">Tidak Digunakan</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="border border-gray-300 text-center py-8 text-gray-400 italic">
                          Tidak ada data penggunaan diskon bulan ini / Data Perhitungan SPK belum diproses.
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