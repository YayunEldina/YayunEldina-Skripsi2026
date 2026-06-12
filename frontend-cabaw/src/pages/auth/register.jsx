import { useState } from "react";
import coverImg from "../../assets/cover.png";
import { useNavigate } from "react-router-dom";

// 🌟 IMPORT ASSET SVG MATA KUSTOM ANDA DISINI
import eyelineBuka from "../../assets/eyeline buka.svg";
import eyelineTutup from "../../assets/eyeline tutup.svg";

export const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_admin: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // State untuk kontrol visibilitas password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Hapus error saat user mulai mengetik
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // VALIDASI
    if (!formData.nama_admin) {
      newErrors.nama_admin = "Nama lengkap harus diisi";
    }

    if (!formData.username) {
      newErrors.username = "Nama pengguna harus diisi";
    }

    if (!formData.password) {
      newErrors.password = "Kata sandi harus diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Kata sandi minimal 6 karakter";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi kata sandi harus diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi kata sandi tidak cocok";
    }

    // Jika ada error → stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nama_admin: formData.nama_admin,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🌟 POPUP ALERT SUDAH DIHAPUS AGAR LANGSUNG REDIRECT OTOMATIS KE LOGIN
        navigate("/login");
      } else {
        alert(data.message || "Pendaftaran gagal.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan koneksi ke server.");
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
          <h1 className="text-center text-3xl font-bold text-black">
            Daftar
          </h1>
          <p className="mt-2 text-center text-gray-500">
            Masukkan data Anda di bawah ini untuk membuat akun Anda.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-base font-medium">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama_admin"
                value={formData.nama_admin}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap anda"
                className={`mt-2 w-full rounded-lg border p-3 text-base focus:outline-none ${
                  errors.nama_admin
                    ? "border-red-500"
                    : "border-[#D1D1D6] focus:border-[#1E3A5F]"
                }`}
              />
              {errors.nama_admin && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nama_admin}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-base font-medium">
                Nama Pengguna
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Masukkan nama pengguna anda"
                className={`mt-2 w-full rounded-lg border p-3 text-base focus:outline-none ${
                  errors.username
                    ? "border-red-500"
                    : "border-[#D1D1D6] focus:border-[#1E3A5F]"
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-base font-medium">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Masukkan kata sandi anda"
                  className={`mt-2 w-full rounded-lg border p-3 pr-12 text-base focus:outline-none ${
                    errors.password
                      ? "border-red-500"
                      : "border-[#D1D1D6] focus:border-[#1E3A5F]"
                  }`}
                />
                {/* Tombol dengan SVG Kustom Anda */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 top-2 flex items-center focus:outline-none"
                >
                  <img 
                    src={showPassword ? eyelineBuka : eyelineTutup} 
                    alt="Toggle Password" 
                    className="h-6 w-6 opacity-70 hover:opacity-100 transition-opacity"
                  />
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-base font-medium">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Ulangi kata sandi anda"
                  className={`mt-2 w-full rounded-lg border p-3 pr-12 text-base focus:outline-none ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-[#D1D1D6] focus:border-[#1E3A5F]"
                  }`}
                />
                {/* Tombol dengan SVG Kustom Anda */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 top-2 flex items-center focus:outline-none"
                >
                  <img 
                    src={showConfirmPassword ? eyelineBuka : eyelineTutup} 
                    alt="Toggle Confirm Password" 
                    className="h-6 w-6 opacity-70 hover:opacity-100 transition-opacity"
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#1E3A5F] py-3 font-semibold text-white hover:opacity-90 disabled:bg-gray-400 transition-opacity"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="mt-6 text-center text-base">
            Sudah memiliki akun?{" "}
            <a href="/login" className="font-bold underline hover:text-blue-900">
              Masuk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;