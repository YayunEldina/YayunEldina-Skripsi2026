import React from "react";
import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

const Ranking = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR */}
      <SidebarNavigationSection />

      {/* CONTENT */}
      <div className="flex-1 ml-[280px] pt-[50px]">
        {/* NAVBAR */}
        <NavbarAdmin />

        {/* TANGGAL + SEARCH */}
        <div className="px-6 pt-4">
          <TampilanElemen />
        </div>

        {/* TITLE BUTTON */}
        <div className="px-6 mt-6">
          <button className="bg-[#1E3A5F] text-white px-6 py-2 rounded-full text-sm font-medium">
            Ranking Pelanggan
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="px-6 pb-10 mt-6">
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6 border border-[#E5E5EA]">

            {/* HEADER */}
            <h1 className="text-xl font-semibold text-slate-800">
              Nilai Preferensi / Ranking
            </h1>

            {/* TABLE */}
            <TableWrapper>
              <Table
                headers={[
                  "Alternatif / Kriteria",
                  "Preferensi (V)",
                  "Ranking",
                  "Prioritas Sistem",
                  "Diskon",
                ]}
                rows={[
                  ["Agus", "0,60", "1", "Prioritas Sedang", "10%"],
                  ["Murti", "0,48", "2", "Prioritas Rendah", "5%"],
                  ["Sarimi", "0,35", "3", "Prioritas Rendah", "5%"],
                ]}
              />
            </TableWrapper>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;

/* ================= REUSABLE ================= */

const TableWrapper = ({ children }) => (
  <div className="overflow-x-auto border border-[#E5E5EA] rounded-xl">
    {children}
  </div>
);

const Table = ({ headers, rows }) => (
  <table className="min-w-full text-sm border-collapse">
    <thead className="bg-slate-50 text-slate-700">
      <tr>
        {headers.map((h, i) => (
          <th
            key={i}
            className="px-4 py-3 border border-[#E5E5EA] text-center font-semibold"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i} className="hover:bg-slate-50 transition">
          {row.map((cell, j) => (
            <td
              key={j}
              className="px-4 py-3 border border-[#E5E5EA] text-center"
            >
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
