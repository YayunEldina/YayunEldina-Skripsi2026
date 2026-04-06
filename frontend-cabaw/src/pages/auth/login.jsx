import { useState } from "react";
import coverImg from "../../assets/cover.png";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // --- BAGIAN PENTING: SINKRONISASI KEY ---
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", data.role);
        
        // Kita simpan dengan key "user" (bukan userData) agar terbaca oleh Navbar & Pemesanan
        localStorage.setItem("user", JSON.stringify(data.user)); 

        alert(`Login Berhasil! Selamat datang, ${data.user.nama_admin || data.user.nama_pelanggan}`);
        
        // Navigasi berdasarkan Role
        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/member/dashboard");
        }
      } else {
        alert(data.message || "Username atau Password salah!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal terhubung ke server. Pastikan Backend menyala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* LEFT PANEL */}
      <div className="flex w-1/2 items-center justify-center p-6">
        <div className="relative h-full w-[85%] rounded-[32px] bg-[#1E3A5F] p-12 text-white overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold leading-tight">
              Akses ke <span className="font-light">krupuk Cap Bawang</span> <br />
              Berkualitas Tinggi
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Cita rasa Autentik, Gurih, Renyah
            </p>
          </div>

          <div className="absolute bottom-[-20px] right-[-100px] w-[90%] h-[78%]">
            <img
              src={coverImg}
              alt="Preview Dashboard"
              className="h-full w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-1/2 flex-col justify-center px-20">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-center text-3xl font-bold text-black">Masuk</h1>
          <p className="mt-2 text-center text-gray-500">
            Masuk untuk mengakses akun Anda
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label className="block text-base font-medium">Nama Pengguna</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Masukkan nama pengguna anda"
                className="mt-2 w-full rounded-lg border border-[#D1D1D6] p-3 text-base focus:border-[#1E3A5F] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium">Kata Sandi</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan kata sandi anda"
                className="mt-2 w-full rounded-lg border border-[#D1D1D6] p-3 text-base focus:border-[#1E3A5F] focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg bg-[#1E3A5F] py-3 font-semibold text-white hover:opacity-90 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="mt-6 text-center text-base">
            Tidak memiliki akun?{" "}
            <a href="/register" className="font-bold underline hover:text-blue-900">
              Daftar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;