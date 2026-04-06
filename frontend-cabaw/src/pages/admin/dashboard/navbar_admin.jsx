import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ name: "Admin", email: "admin@mail.com" });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setAdmin({
        ...storedUser,
        // Gunakan nama_admin atau nama_pelanggan sesuai data login
        name: storedUser.nama_admin || storedUser.nama_pelanggan || "Admin",
        email: storedUser.email || "admin@mail.com",
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
    <header className="fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-white flex items-center justify-end px-10 z-10 border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-5">
        
        {/* AREA PROFIL - SAMA DENGAN MEMBER TANPA KOTAK */}
        <div className="relative flex items-center gap-3 py-1.5">
          
          {/* AVATAR DI SEBELAH KIRI */}
          <div className="w-9 h-9 rounded-full overflow-hidden bg-orange-100 border border-orange-200">
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${admin.name}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* TEKS NAMA & EMAIL */}
          <div className="text-left pr-1">
            <h3 className="text-[13px] font-bold text-slate-800 leading-tight">{admin.name}</h3>
            <p className="text-[10px] text-gray-400 font-medium lowercase italic">{admin.email}</p>
          </div>

          {/* TOMBOL SEGITIGA UNTUK POPUP LOGOUT */}
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* DROPDOWN LOGOUT */}
          {isDropdownOpen && (
            <>
              {/* Overlay untuk menutup saat klik di luar */}
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
              
              <div className="absolute right-0 top-12 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1.5 animate-in fade-in zoom-in-95 duration-150">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default NavbarAdmin;