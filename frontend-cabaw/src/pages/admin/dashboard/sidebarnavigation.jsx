import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Import Gambar/Logo
import CapBawang from "../../../assets/capbawang.jpeg";

// Import SVG sebagai URL
import DashboardIcon from "../../../assets/dashboard.svg";
import TransaksiIcon from "../../../assets/transaksi.svg";
import AlternatifIcon from "../../../assets/alternatif.svg";
import KriteriaIcon from "../../../assets/kriteria.svg";
import PerhitunganIcon from "../../../assets/perhitungan.svg";
import RankingIcon from "../../../assets/ranking.svg";
import VectorBukaIcon from "../../../assets/vector-buka.svg";

export const SidebarNavigationSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-gray-100 border-r border-[#E5E5EA] px-6 py-6">
      {/* LOGO SECTION */}
      <div className="flex items-center gap-3 mb-8">
        <img
          src={CapBawang}
          alt="Logo Cabaw"
          className="h-15 w-10 rounded-lg object-cover"
        />
        <div>
          <h2 className="font-bold text-lg leading-tight">Cabaw</h2>
          <p className="text-xs text-gray-500">Krupuke Pak Ugik</p>
        </div>
      </div>

      {/* MENU NAVIGATION */}
      <nav className="space-y-1">
        <MenuItem
          icon={DashboardIcon}
          label="Dashboard"
          vectorIcon={VectorBukaIcon}
          active={location.pathname === "/dashboard"}
          onClick={() => navigate("/dashboard")}
        />

        <MenuItem
          icon={TransaksiIcon}
          label="Transaksi Penjualan"
          vectorIcon={VectorBukaIcon}
          active={location.pathname === "/admin/transaksi"}
          onClick={() => navigate("/admin/transaksi")}
        />

        {/* --- LABEL PELANGGAN --- */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-base text-gray-400 font-medium">Pelanggan</p>
        </div>

        <MenuItem
          icon={AlternatifIcon}
          label="Alternatif"
          vectorIcon={VectorBukaIcon}
          active={location.pathname === "/admin/alternatif"}
          onClick={() => navigate("/admin/alternatif")}
        />

        <MenuItem
          icon={KriteriaIcon}
          label="Kriteria"
          vectorIcon={VectorBukaIcon}
          active={location.pathname === "/admin/kriteria"}
          onClick={() => navigate("/admin/kriteria")}
        />

        <MenuItem
          icon={PerhitunganIcon}
          label="Perhitungan"
          vectorIcon={VectorBukaIcon}
          active={location.pathname === "/admin/perhitungan"}
          onClick={() => navigate("/admin/perhitungan")}
        />

        <MenuItem
          icon={RankingIcon}
          label="Ranking"
          vectorIcon={VectorBukaIcon}
          active={location.pathname === "/admin/ranking"}
          onClick={() => navigate("/admin/ranking")}
        />
      </nav>
    </aside>
  );
};

// Komponen MenuItem
const MenuItem = ({ label, icon, vectorIcon, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-1.5 rounded-lg cursor-pointer text-slate-600 transition group
      ${
        active
          ? "bg-[#1E3A5F] text-white"
          : "hover:bg-[#1E3A5F] hover:text-white"
      }`}
    >
      {/* Icon */}
      <div className="w-5 h-5 flex items-center justify-center">
        <img
          src={icon}
          alt={label}
          className={`w-full h-full ${
            active ? "invert brightness-0" : "grayscale group-hover:invert group-hover:brightness-0"
          }`}
        />
      </div>

      {/* Label */}
      <span className="text-base font-medium flex-1">{label}</span>

      {/* Arrow */}
      {vectorIcon && (
        <div className="w-3 h-3 flex items-center justify-center">
          <img
            src={vectorIcon}
            alt="arrow"
            className={`w-full h-full opacity-40 transition-all ${
              active ? "invert" : "group-hover:invert"
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default SidebarNavigationSection;
