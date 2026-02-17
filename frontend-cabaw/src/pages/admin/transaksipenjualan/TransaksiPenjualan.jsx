import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

import tambahIcon from "../../../assets/tambah.svg";
import lihatIcon from "../../../assets/lihat.svg";
import editIcon from "../../../assets/edit.svg";
import hapusIcon from "../../../assets/hapus.svg";

const dataDummy = Array.from({ length: 10 }, (_, i) => ({
  no: i + 1,
  nama: "Murti",
  jk: "Perempuan",
  tanggal: 1,
  bulan: 1,
  tahun: 2021,
  jenis: "Uyel Putih",
  hargaPcs: "Rp 2.500", // ✅ TAMBAHAN
  total: 20,
  harga: "Rp 50.000",
  tempat: "Pasar",
}));

const TransaksiPenjualan = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR */}
      <SidebarNavigationSection />

      {/* CONTENT */}
      <div className="flex-1 ml-[280px] pt-[80px]">
        {/* NAVBAR */}
        <NavbarAdmin />

        {/* TANGGAL + SEARCH */}
        <div className="px-0 pt-4">
          <TampilanElemen />
        </div>

        {/* FILTER + BUTTON */}
        <div className="flex items-center justify-between px-8 mt-6">
          <div className="flex gap-2">
            {["2021", "2022", "2023", "2024", "2025"].map((y, i) => (
              <button
                key={i}
                className={`px-5 py-2 rounded-full border text-sm ${
                  y === "2021"
                    ? "bg-[#1E3A5F] text-white"
                    : "bg-white text-slate-600"
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg hover:opacity-90">
            <img src={tambahIcon} alt="tambah" className="w-4 h-4" />
            Tambah transaksi
          </button>
        </div>

        {/* TABLE */}
        <div className="px-8 mt-6">
          <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F1F5F9] text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left">No</th>
                  <th className="px-4 py-3 text-left">Nama Pelanggan</th>
                  <th className="px-4 py-3 text-left">Jenis Kelamin</th>
                  <th className="px-4 py-3 text-left">Tanggal</th>
                  <th className="px-4 py-3 text-left">Bulan</th>
                  <th className="px-4 py-3 text-left">Tahun</th>
                  <th className="px-4 py-3 text-left">Jenis Krupuk</th>
                  <th className="px-4 py-3 text-left">Harga / Pcs</th> {/* ✅ KOLOM BARU */}
                  <th className="px-4 py-3 text-left">Total Pembelian</th>
                  <th className="px-4 py-3 text-left">Total Harga</th>
                  <th className="px-4 py-3 text-left">Tempat Transaksi</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {dataDummy.map((item, i) => (
                  <tr
                    key={i}
                    className="border-t border-[#E5E5EA] hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3">{item.no}</td>
                    <td className="px-4 py-3">{item.nama}</td>
                    <td className="px-4 py-3">{item.jk}</td>
                    <td className="px-4 py-3">{item.tanggal}</td>
                    <td className="px-4 py-3">{item.bulan}</td>
                    <td className="px-4 py-3">{item.tahun}</td>
                    <td className="px-4 py-3">{item.jenis}</td>
                    <td className="px-4 py-3">{item.hargaPcs}</td> {/* ✅ DATA BARU */}
                    <td className="px-4 py-3">{item.total}</td>
                    <td className="px-4 py-3">{item.harga}</td>
                    <td className="px-4 py-3">{item.tempat}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <img
                          src={lihatIcon}
                          alt="lihat"
                          className="w-8 h-8 p-1.5 rounded-md bg-green-100 cursor-pointer"
                        />
                        <img
                          src={editIcon}
                          alt="edit"
                          className="w-8 h-8 p-1.5 rounded-md bg-yellow-100 cursor-pointer"
                        />
                        <img
                          src={hapusIcon}
                          alt="hapus"
                          className="w-8 h-8 p-1.5 rounded-md bg-red-100 cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-end items-center gap-2 mt-6 text-sm">
            <button className="px-3 py-1">{"<"} Previous</button>
            <button className="px-3 py-1">1</button>
            <button className="px-3 py-1 border rounded-md">2</button>
            <button className="px-3 py-1">3</button>
            <button className="px-3 py-1">...</button>
            <button className="px-3 py-1">Next {">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransaksiPenjualan;
