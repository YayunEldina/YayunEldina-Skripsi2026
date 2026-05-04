import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CapBawang from "../../../assets/capbawang.jpeg";
import KeranjangIcon from "../../../assets/keranjang.svg";
import LogoutIcon from "../../../assets/logout.svg";

const NavbarMember = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Pelanggan",
    username: "",
    email: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        ...storedUser,
        name: storedUser.nama_pelanggan || "Pelanggan",
        username: storedUser.username || "user_guest",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white flex items-center justify-between px-8 z-50">
      
      {/* 🔹 LOGO */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/member/dashboard")}
      >
        <img
          src={CapBawang}
          alt="Logo"
          className="h-10 w-7 rounded-md object-cover"
        />
        <div>
          <h2 className="font-bold text-base leading-tight text-slate-800">
            Cabaw
          </h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
            Krupuk Pak Ugik
          </p>
        </div>
      </div>

      {/* 🔹 KANAN */}
      <div className="flex items-center gap-4">

        {/* 🛒 KERANJANG (LINGKARAN ABU) */}
        <button
  onClick={() => navigate("/member/pemesanan")}
  className="w-9 h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
>
  <img
    src={KeranjangIcon}
    alt="Keranjang"
    className="w-5 h-5 opacity-70"
  />
</button>

        {/* 👤 PROFILE + LOGOUT */}
        <div className="flex items-center gap-3">

          {/* 🔘 AVATAR (SAMA SEPERTI ADMIN) */}
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

          {/* 🧑 INFO USER */}
          <div className="text-left leading-tight">
            <h3 className="text-sm font-semibold">
              {user.name}
            </h3>
            <p className="text-[11px] text-gray-400">
              {user.username}
            </p>
          </div>

          {/* 🔴 LOGOUT BULAT */}
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <img
              src={LogoutIcon}
              alt="logout"
              className="w-4 h-4 opacity-70"
            />
          </button>

        </div>
      </div>
    </header>
  );
};

export default NavbarMember;