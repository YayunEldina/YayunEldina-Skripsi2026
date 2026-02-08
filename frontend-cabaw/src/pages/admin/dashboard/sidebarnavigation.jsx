import React from "react";

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

      {/* MENU NAVIGATION - Menggunakan space-y-1 agar rapat */}
      <nav className="space-y-1">
        <MenuItem
          icon={DashboardIcon}
          label="Dashboard"
          vectorIcon={VectorBukaIcon}
        />
        <MenuItem
          icon={TransaksiIcon}
          label="Transaksi Penjualan"
          vectorIcon={VectorBukaIcon}
        />

        {/* --- LABEL PELANGGAN --- */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-base text-gray-400 font-medium">
            Pelanggan
          </p>
        </div>

        <MenuItem
          icon={AlternatifIcon}
          label="Alternatif"
          vectorIcon={VectorBukaIcon}
        />
        <MenuItem
          icon={KriteriaIcon}
          label="Kriteria"
          vectorIcon={VectorBukaIcon}
        />
        <MenuItem
          icon={PerhitunganIcon}
          label="Perhitungan"
          vectorIcon={VectorBukaIcon}
        />
        <MenuItem
          icon={RankingIcon}
          label="Ranking"
          vectorIcon={VectorBukaIcon}
        />
      </nav>
    </aside>
  );
};

// Komponen MenuItem
const MenuItem = ({ label, icon, vectorIcon }) => {
  return (
    // py-1.5 untuk menjaga kerapatan menu
    <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg cursor-pointer text-slate-600 hover:bg-[#1E3A5F] hover:text-white transition group">
      
      {/* Icon Utama (Ukuran standar 20px) */}
      <div className="w-5 h-5 flex items-center justify-center">
        <img 
          src={icon} 
          alt={label} 
          className="w-full h-full grayscale group-hover:invert group-hover:brightness-0" 
        />
      </div>

      {/* Label Menu */}
      <span className="text-base font-medium flex-1">{label}</span>

      {/* VectorIcon (Dikecilkan menjadi w-3 h-3 atau sekitar 12px) */}
      {vectorIcon && (
        <div className="w-3 h-3 flex items-center justify-center">
          <img 
            src={vectorIcon} 
            alt="arrow" 
            className="w-full h-full opacity-40 group-hover:invert transition-all" 
          />
        </div>
      )}
    </div>
  );
};

export default SidebarNavigationSection;