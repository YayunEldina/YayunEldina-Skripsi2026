import { useState } from "react";
import coverImg from "../../assets/cover.png";
import { useNavigate } from "react-router-dom";

import eyelineBuka from "../../assets/eyeline buka.svg";
import eyelineTutup from "../../assets/eyeline tutup.svg";

export const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // hapus error saat user mengetik
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // VALIDASI
    if (!formData.username) {
      newErrors.username = "Nama pengguna harus diisi";
    }

    if (!formData.password) {
      newErrors.password = "Kata sandi harus diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Kata sandi minimal 6 karakter";
    }

    // stop kalau ada error
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data); 

      if (response.ok) {
        // simpan ke localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("user", JSON.stringify(data.user));

        // redirect berdasarkan role
        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/member/dashboard");
        }
      } else {
        // kalau ada error dari backend
        if (data.field) {
          if (data.field === "both") {
            setErrors({
              username: "Nama pengguna tidak ditemukan",
              password: "Kata sandi salah",
            });
          } else {
            setErrors((prev) => ({
              ...prev,
              [data.field]: data.message,
            }));
          }
        } else {
          // fallback
          setServerError(data.message || "Terjadi kesalahan");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError("Gagal terhubung ke server");
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
            Masuk untuk accessing akun Anda
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
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

            {/* ERROR BACKEND */}
            {serverError && (
              <p className="text-red-600 text-sm text-center">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg bg-[#1E3A5F] py-3 font-semibold text-white hover:opacity-90 transition-opacity ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="mt-6 text-center text-base">
            Tidak memiliki akun?{" "}
            <a
              href="/register"
              className="font-bold underline hover:text-blue-900"
            >
              Daftar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;