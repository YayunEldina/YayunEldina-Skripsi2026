import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

const dataKriteria = [
  {
    kode: "C1",
    nama: "Total Pembelian",
    bobot: 5,
    fuzzy: "(0.75, 1.00, 1.00)",
    atribut: "Benefit",
  },
  {
    kode: "C2",
    nama: "Total Pendapatan",
    bobot: 4,
    fuzzy: "(0.50, 0.75, 1.00)",
    atribut: "Benefit",
  },
  {
    kode: "C3",
    nama: "Frekuensi Transaksi",
    bobot: 4,
    fuzzy: "(0.50, 0.75, 1.00)",
    atribut: "Benefit",
  },
  {
    kode: "C4",
    nama: "Variabilitas Pembelian",
    bobot: 3,
    fuzzy: "(0.25, 0.50, 0.75)",
    atribut: "Cost",
  },
];

const dataKeterangan = [
  {
    nama: "Total Unit Terjual",
    keterangan:
      "Jumlah keseluruhan produk yang dibeli pelanggan dalam periode tertentu. Semakin besar total pembelian, semakin tinggi kontribusi pelanggan terhadap volume penjualan UMKM.",
  },
  {
    nama: "Jumlah Pembeli",
    keterangan:
      "Besarnya omzet yang dihasilkan dari transaksi pelanggan. Nilai yang lebih tinggi menunjukkan kontribusi finansial yang lebih besar bagi keberlangsungan usaha.",
  },
  {
    nama: "Frekuensi Transaksi",
    keterangan:
      "Jumlah transaksi yang dilakukan pelanggan dalam periode tertentu. Semakin sering pelanggan bertransaksi, semakin tinggi tingkat loyalitas dan kontribusinya.",
  },
  {
    nama: "Variabilitas Penjualan",
    keterangan:
      "Tingkat kestabilan jumlah pembelian pelanggan dari bulan ke bulan.",
  },
];

const Kriteria = () => {
  return (
    <div className="flex min-h-screen bg-white">
    {/* SIDEBAR */}
    <SidebarNavigationSection />
  
    {/* CONTENT */}
    <div className="flex-1 ml-[280px] pt-[50px]">
      {/* NAVBAR */}
      <NavbarAdmin />
  
      {/* TANGGAL + SEARCH */}
      <div className="px-0 pt-4">
        <TampilanElemen />
      </div>

        {/* TITLE */}
        <div className="px-8 mt-6">
          <button className="bg-[#1E3A5F] text-white px-6 py-2 rounded-full text-sm font-medium">
            Kriteria Pelanggan
          </button>
        </div>

        {/* TABLE KRITERIA */}
        <div className="px-8 mt-6">
          <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-slate-700 border-b border-[#E5E5EA]">
                <tr>
                  <th className="px-4 py-3">Kode Kriteria</th>
                  <th className="px-4 py-3">Nama Kriteria</th>
                  <th className="px-4 py-3">Bobot Kriteria</th>
                  <th className="px-4 py-3">Bobot Kriteria Fuzzy</th>
                  <th className="px-4 py-3">Attribut</th>
                </tr>
              </thead>
              <tbody>
                {dataKriteria.map((item, i) => (
                  <tr key={i} className="border-t border-[#E5E5EA]">
                    <td className="px-4 py-3 text-center">
                      {item.kode}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.nama}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.bobot}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.fuzzy}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-medium ${
                          item.atribut === "Benefit"
                            ? "bg-green-200 text-green-700"
                            : "bg-red-200 text-red-700"
                        }`}
                      >
                        {item.atribut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE KETERANGAN */}
        <div className="px-8 mt-8 pb-10">
          <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-slate-700 border-b border-[#E5E5EA]">
                <tr>
                  <th className="px-4 py-3">Nama Kriteria</th>
                  <th className="px-4 py-3">Keterangan Kriteria</th>
                </tr>
              </thead>
              <tbody>
                {dataKeterangan.map((item, i) => (
                  <tr key={i} className="border-t border-[#E5E5EA]">
                    <td className="px-4 py-3 text-center font-medium">
                      {item.nama}
                    </td>
                    <td className="px-4 py-3 text-justify">
                      {item.keterangan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kriteria;
