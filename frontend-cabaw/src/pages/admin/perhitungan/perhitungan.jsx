import React from "react";
import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import TampilanElemen from "../dashboard/TampilanElemen";

const Perhitungan = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR */}
      <SidebarNavigationSection />

      {/* CONTENT */}
      <div className="flex-1 ml-[280px]">
        {/* NAVBAR */}
        <NavbarAdmin />

        {/* HEADER + SEARCH */}
        <div className="pt-[70px] px-0">
          <TampilanElemen />
        </div>

         {/* TITLE */}
         <div className="px-8 mt-6">
          <button className="bg-[#1E3A5F] text-white px-6 py-2 rounded-full text-sm font-medium">
            Perhitungan Pelanggan
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="px-8 pb-10">
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-8">

            {/* HEADER */}
            <h1 className="text-xl font-semibold text-slate-800">
              Nilai Keterangan Kriteria Pelanggan yang Di Konversikan
            </h1>

            {/* TABLE 1 */}
            <TableWrapper>
              <Table
                headers={["Alternatif / Kriteria", "C1", "C2", "C3", "C4"]}
                rows={[
                  ["Agus", "(0.75, 1.00, 1.00)", "(0.50, 0.75, 1.00)", "(0.50, 0.75, 1.00)", "(0.00, 0.25, 0.50)"],
                  ["Murti", "(0.50, 0.75, 1.00)", "(0.25, 0.50, 0.75)", "(0.25, 0.50, 0.75)", "(0.25, 0.50, 0.75)"],
                  ["Sarimi", "(0.25, 0.50, 0.75)", "(0.25, 0.50, 0.75)", "(0.00, 0.25, 0.50)", "(0.50, 0.75, 1.00)"],
                ]}
              />
            </TableWrapper>

            <Section title="Matrik Ternormalisasi R" />

            <TableWrapper>
              <Table
                headers={["Xij", "C1", "C2", "C3", "C4"]}
                rows={[
                  ["Agus", "(0.75,1.00,1.00)", "(0.50,0.75,1.00)", "(0.50,0.75,1.00)", "(0.50,1.00,1.00)"],
                  ["Murti", "(0.50,0.75,1.00)", "(0.25,0.50,0.75)", "(0.25,0.50,0.75)", "(0.33,0.50,1.00)"],
                  ["Sarimi", "(0.25,0.50,0.75)", "(0.25,0.50,0.75)", "(0.00,0.25,0.50)", "(0.25,0.33,0.50)"],
                ]}
              />
            </TableWrapper>

            <Section title="Matrik Ternormalisasi terbobot Y" />

            <TableWrapper>
              <Table
                headers={["rij", "C1", "C2", "C3", "C4"]}
                rows={[
                  ["Agus", "(0.56,1.00,1.00)", "(0.25,0.56,1.00)", "(0.26,0.56,1.00)", "(0.13,0.50,0.75)"],
                  ["Murti", "(0.38,0.75,1.00)", "(0.13,0.38,0.75)", "(0.13,0.38,0.75)", "(0.08,0.25,0.75)"],
                  ["Sarimi", "(0.19,0.50,0.75)", "(0.13,0.38,0.75)", "(0.00,0.19,0.50)", "(0.06,0.17,0.38)"],
                ]}
              />
            </TableWrapper>

            <Section title="Solusi Ideal Positif (+) dan Negatif (-)" />

            <TableWrapper>
              <Table
                headers={["", "C1", "C2", "C3", "C4"]}
                rows={[
                  ["y+", "(1,1,1)", "(1,1,1)", "(1,1,1)", "(1,1,1)"],
                  ["y-", "(0,0,0)", "(0,0,0)", "(0,0,0)", "(0,0,0)"],
                ]}
              />
            </TableWrapper>

            <Section title="Menghitung Jarak Nilai Alternatif Positif (+) dan Negatif (-)" />

            <TableWrapper>
              <Table
                headers={["Alternatif", "D+", "D-"]}
                rows={[
                  ["Agus", "1.84", "2.78"],
                  ["Murti", "2.15", "1.95"],
                  ["Sarimi", "2.14", "1.32"],
                ]}
              />
            </TableWrapper>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE ================= */

const Section = ({ title }) => (
  <h2 className="text-lg font-semibold text-slate-700 mt-4">{title}</h2>
);

const TableWrapper = ({ children }) => (
    <div className="overflow-x-auto border border-[#E5E5EA] rounded-lg">
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
          <tr key={i} className="hover:bg-slate-50">
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
  
export default Perhitungan;
