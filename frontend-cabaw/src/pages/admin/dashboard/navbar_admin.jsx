import React from "react";

// Import foto profil dari assets jika sudah ada filenya
// import ProfilePic from "../../../assets/cover.png"; 

const NavbarAdmin = () => {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-280px)] h-13 bg-white  flex items-center justify-end px-10 z-10">
      {/* SECTION PROFIL DI KANAN NAVBAR */}
      <div className="flex items-center gap-3">
        
        {/* FOTO PROFIL (Sekarang di sebelah kiri teks) */}
        <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-100 shadow-sm">
          <img 
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=Yayun" // Ganti dengan path foto kelinci Anda
            alt="User Profile" 
            className="w-full h-full object-cover bg-orange-100"
          />
        </div>

        {/* TEXT INFO (Sekarang di sebelah kanan foto) */}
        <div className="text-left flex flex-col justify-center">
          <h3 className="text-[15px] font-bold text-slate-800 leading-tight">
            Yayun Eldina
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            yayuneldina@gmail.com
          </p>
        </div>

      </div>
    </header>
  );
};

export default NavbarAdmin;