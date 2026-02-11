import React from "react";
import { useNavigate } from "react-router-dom";

// Import Gambar
import CapBawang from "../../../assets/capbawang.jpeg";
import KeranjangIcon from "../../../assets/keranjang.svg";

const NavbarMember = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-[#E5E5EA] flex items-center justify-between px-8 z-50">
      
      {/* LOGO SECTION */}
      <div className="flex items-center gap-3 cursor-pointer">
        <img
          src={CapBawang}
          alt="Logo Cabaw"
          className="h-12 w-8 rounded-lg object-cover"
        />
        <div>
          <h2 className="font-bold text-lg leading-tight">Cabaw</h2>
          <p className="text-xs text-gray-500">Krupuke Pak Ugik</p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">
        
        {/* ICON KERANJANG */}
        <button
          onClick={() => navigate("/member/pemesanan")}
          className="relative hover:scale-110 transition"
        >
          <img
            src={KeranjangIcon}
            alt="Keranjang"
            className="w-6 h-6"
          />
        </button>

        {/* PROFILE */}
        <div className="flex items-center gap-3">
          
          {/* FOTO */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm">
            <img
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=Yayun"
              alt="Profile"
              className="w-full h-full object-cover bg-orange-100"
            />
          </div>

          {/* TEXT */}
          <div className="text-left">
            <h3 className="text-sm font-semibold text-slate-800 leading-tight">
              Yayun Eldina
            </h3>
            <p className="text-xs text-gray-400">
              yayuneldina@gmail.com
            </p>
          </div>

        </div>
      </div>

    </header>
  );
};

export default NavbarMember;
