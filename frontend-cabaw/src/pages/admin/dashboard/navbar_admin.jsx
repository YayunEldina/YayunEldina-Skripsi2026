import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Logo
import CapBawang from "../../../assets/capbawang.jpeg";

// Icons Menu
import DashboardIcon from "../../../assets/dashboard.svg";
import TransaksiIcon from "../../../assets/transaksi.svg";
import AlternatifIcon from "../../../assets/alternatif.svg";
import KriteriaIcon from "../../../assets/kriteria.svg";
import PerhitunganIcon from "../../../assets/perhitungan.svg";
import RankingIcon from "../../../assets/ranking.svg";

// Logout Icon
import LogoutIcon from "../../../assets/logout.svg";

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [admin, setAdmin] = useState({
    name: "Admin",
    email: "admin@mail.com",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setAdmin({
        ...storedUser,
        name:
          storedUser.nama_admin ||
          storedUser.nama_pelanggan ||
          "Admin",
        email: storedUser.email || "admin@mail.com",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 border-b border-gray-100">
      <div className="w-full px-8 h-16 flex items-center justify-between">

        {/* 🔹 KIRI - LOGO */}
        <div className="flex items-center gap-3">
          <img src={CapBawang} alt="logo" className="w-6 h-10" />
          <div>
            <h2 className="font-bold text-sm leading-tight">Cabaw</h2>
            <p className="text-xs text-gray-500">
              Krupuk Pak Ugik
            </p>
          </div>
        </div>

        {/* 🔹 TENGAH - MENU */}
        <nav className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">

          <NavItem
            icon={DashboardIcon}
            label="Dashboard"
            active={location.pathname === "/admin/dashboard"}
            onClick={() => navigate("/admin/dashboard")}
          />

          <NavItem
            icon={TransaksiIcon}
            label="Transaksi"
            active={location.pathname === "/admin/transaksi"}
            onClick={() => navigate("/admin/transaksi")}
          />

          <NavItem
            icon={AlternatifIcon}
            label="Alternatif"
            active={location.pathname === "/admin/alternatif"}
            onClick={() => navigate("/admin/alternatif")}
          />

          <NavItem
            icon={KriteriaIcon}
            label="Kriteria"
            active={location.pathname === "/admin/kriteria"}
            onClick={() => navigate("/admin/kriteria")}
          />

          <NavItem
            icon={PerhitunganIcon}
            label="Perhitungan"
            active={location.pathname === "/admin/perhitungan"}
            onClick={() => navigate("/admin/perhitungan")}
          />

          <NavItem
            icon={RankingIcon}
            label="Ranking"
            active={location.pathname === "/admin/ranking"}
            onClick={() => navigate("/admin/ranking")}
          />

        </nav>

        {/* 🔹 KANAN - PROFILE + LOGOUT */}
        <div className="flex items-center gap-3">

          {/* 🔘 AVATAR */}
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7h14c0-3.866-3.134-7-7-7z" />
            </svg>
          </div>

          {/* 🧑 INFO */}
          <div className="text-left leading-tight">
            <h3 className="text-sm font-semibold">
              {admin.name}
            </h3>
            <p className="text-[11px] text-gray-400">
              {admin.email}
            </p>
          </div>

          {/* 🔴 LOGOUT BULAT */}
          <button
  onClick={handleLogout}
  className="w-9 h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
>
  <img src={LogoutIcon} alt="logout" className="w-4 h-4 opacity-70" />
</button>

        </div>
      </div>
    </header>
  );
};

// 🔹 NAV ITEM
const NavItem = ({ icon, label, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition text-sm font-medium
      ${
        active
          ? "bg-white shadow-sm text-gray-800"
          : "text-gray-600 hover:bg-gray-200"
      }`}
    >
      <img
        src={icon}
        alt={label}
        className={`w-4 h-4 ${
          active ? "brightness-0" : "opacity-60"
        }`}
      />
      <span>{label}</span>
    </div>
  );
};

export default NavbarAdmin;