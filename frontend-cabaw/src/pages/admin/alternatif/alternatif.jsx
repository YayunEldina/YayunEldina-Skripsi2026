import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

const dataDummy = [
  { kode: "A1", nama: "Agus" },
  { kode: "A2", nama: "Murti" },
  { kode: "A3", nama: "Sarimi" },
  { kode: "A4", nama: "Desi" },
  { kode: "A5", nama: "Pranoto" },
  { kode: "A6", nama: "Yudi" },
  { kode: "A7", nama: "Maryo" },
  { kode: "A8", nama: "Juleha" },
  { kode: "A9", nama: "Wulan" },
  { kode: "A10", nama: "Putri" },
];

const Alternatif = () => {
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
          <button className="px-5 py-2 bg-[#1E3A5F] text-white rounded-full text-sm">
            Alternatif Pelanggan
          </button>
        </div>

        {/* TABLE */}
        <div className="px-8 mt-6">
          <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-slate-700 border-b border-[#E5E5EA]">
                <tr>
                  <th className="px-6 py-4 text-left">Kode Alternatif</th>
                  <th className="px-6 py-4 text-left">Nama Alternatif</th>
                </tr>
              </thead>

              <tbody>
                {dataDummy.map((item, i) => (
                  <tr
                    key={i}
                    className="border-t border-[#E5E5EA] hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4">{item.kode}</td>
                    <td className="px-6 py-4">{item.nama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-end items-center gap-2 mt-6 text-sm">
            <button className="px-3 py-1">{"<"} Previous</button>
            <button className="px-3 py-1">1</button>
            <button className="px-3 py-1 border border-[#E5E5EA] rounded-md">
              2
            </button>
            <button className="px-3 py-1">3</button>
            <button className="px-3 py-1">...</button>
            <button className="px-3 py-1">Next {">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alternatif;
