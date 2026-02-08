import { useState } from "react";
import coverImg from "../../assets/cover.png";

export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Daftar:", formData);
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

          {/* IMAGE */}
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
          className="mt-2 w-full rounded-lg border border-[#D1D1D6] p-3 text-base focus:border-[#1E3A5F] focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-base font-medium">
          Kata Sandi
        </label>
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

      <div>
        <label className="block text-base font-medium">
          Konfirmasi Kata Sandi
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Ulangi kata sandi anda"
          className="mt-2 w-full rounded-lg border border-[#D1D1D6] p-3 text-base focus:border-[#1E3A5F] focus:outline-none"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-[#1E3A5F] py-3 font-semibold text-white hover:opacity-90"
      >
        Daftar
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
