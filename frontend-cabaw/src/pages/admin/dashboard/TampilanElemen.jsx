import React from "react";
import { FiSearch, FiFilter } from "react-icons/fi";

const TampilanElemen = () => {
  // Fungsi untuk mendapatkan tanggal hari ini otomatis
  const formatTanggal = () => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  };

  return (
    // justify-start membuat semua elemen menempel ke kiri
    <div className="flex items-center justify-start px-8 py-4 bg-white gap-6">
      
      {/* 1. Bagian Tanggal */}
      <div className="flex items-center gap-4 text-slate-500 font-medium">
        <span className="text-base whitespace-nowrap">{formatTanggal()}</span>
        {/* Garis pemisah vertikal */}
        <div className="h-4 w-[1px] bg-gray-300"></div>
      </div>

      {/* 2. Tombol Filter */}
      <button className="p-2 rounded-full border border-gray-200 text-slate-600 hover:bg-gray-50 transition shadow-sm flex-shrink-0">
        <FiFilter size={16} />
      </button>

      {/* 3. Search Bar */}
      <div className="relative group">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-400 group-focus-within:text-[#1E3A5F] transition-colors" />
        <input
          type="text"
          placeholder="Search all"
          className="pl-10 pr-6 py-2 w-64 bg-white border border-gray-200 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/10 focus:border-[#1E3A5F] transition-all"
        />
      </div>

    </div>
  );
};

export default TampilanElemen;