import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import NavbarAdmin from "../dashboard/navbar_admin"; 

const ProfileAdmin = () => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    id_admin: "",
    nama_admin: "",
    username: "",
    jenis_kelamin: "", 
    no_telepon: "",
    alamat: "",
    old_password: "",
    password: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mengambil data auth login admin dari localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setFormData({
        id_admin: storedUser.id_admin || "",
        nama_admin: storedUser.nama_admin || "",
        username: storedUser.username || "",
        jenis_kelamin: storedUser.jenis_kelamin || "", 
        no_telepon: storedUser.no_telepon || "",
        alamat: storedUser.alamat || "",
        old_password: "",
        password: "",
      });

      // Sinkronisasi pratinjau foto profil jika sudah ada di database
      if (storedUser.foto_profil) {
        setAvatarPreview(
          `${import.meta.env.VITE_STORAGE_URL}/${storedUser.foto_profil}`
        );
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Membuat URL sementara untuk preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi: Jika password baru diisi, password lama wajib dimasukkan
    if (formData.password && !formData.old_password) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian!",
        text: "Silakan masukkan kata sandi lama Anda terlebih dahulu untuk mengubah kata sandi.",
        confirmButtonColor: "#1E3A5F",
      });
      return;
    }

    setLoading(true);

    try {
      let response;

      // KONDISI A: Jika user mengunggah foto profil baru (Menggunakan FormData)
      if (avatarFile) {
        const dataToSend = new FormData();
        dataToSend.append("_method", "PUT"); // Laravel spoofing method
        dataToSend.append("nama_admin", formData.nama_admin);
        dataToSend.append("username", formData.username);
        dataToSend.append("jenis_kelamin", formData.jenis_kelamin || ""); 
        dataToSend.append("no_telepon", formData.no_telepon || "");
        dataToSend.append("alamat", formData.alamat || "");

        if (formData.old_password) dataToSend.append("old_password", formData.old_password);
        if (formData.password) dataToSend.append("password", formData.password);
        dataToSend.append("foto_profil", avatarFile);

        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/${formData.id_admin}`,
          dataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } 
      // KONDISI B: Jika user HANYA mengupdate teks biasa (Tanpa ubah foto)
      else {
        const dataToSend = {
          nama_admin: formData.nama_admin,
          username: formData.username,
          jenis_kelamin: formData.jenis_kelamin || "",
          no_telepon: formData.no_telepon || "",
          alamat: formData.alamat || "",
        };

        if (formData.old_password) dataToSend.old_password = formData.old_password;
        if (formData.password) dataToSend.password = formData.password;

        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/admin/${formData.id_admin}`,
          dataToSend,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data && response.data.user) {
        const updatedAdminFromBackend = response.data.user;
        const oldUser = JSON.parse(localStorage.getItem("user")) || {};

        // Perbarui data admin di localStorage agar nama & foto di navbar langsung berubah
        const updatedUser = {
          ...oldUser,
          id_admin: updatedAdminFromBackend.id_admin,
          nama_admin: updatedAdminFromBackend.nama_admin,
          username: updatedAdminFromBackend.username,
          jenis_kelamin: updatedAdminFromBackend.jenis_kelamin, 
          no_telepon: updatedAdminFromBackend.no_telepon,
          alamat: updatedAdminFromBackend.alamat,
          foto_profil: updatedAdminFromBackend.foto_profil, 
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Profil Admin telah diperbarui.",
          confirmButtonColor: "#1E3A5F",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavbarAdmin />

      <div className="pt-24 px-12 pb-16 max-w-7xl mx-auto font-sans">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Profile Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola informasi data diri dan keamanan akun administrator.</p>
          </div>

          {/* Komponen Upload Avatar Lingkaran */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Admin"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 p-2 bg-[#1E3A5F] hover:bg-[#152943] text-white rounded-full shadow-md transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Nama Lengkap Admin
              </label>
              <input
                type="text"
                name="nama_admin"
                value={formData.nama_admin}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition"
                placeholder="Masukkan nama lengkap admin"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Username Admin
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="off"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition"
                placeholder="Masukkan username admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Alamat Lengkap
            </label>
            <textarea
              name="alamat"
              rows="2"
              value={formData.alamat}
              onChange={handleChange}
              placeholder="Masukkan alamat lengkap rumah Anda"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Jenis Kelamin
              </label>
              <select
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition bg-white"
              >
                <option value="">-- Pilih Jenis Kelamin --</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Nomor Telepon / WA Admin
              </label>
              <input
                type="text"
                name="no_telepon"
                value={formData.no_telepon}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition"
                placeholder="Contoh: 0812XXXXXXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Kata Sandi Lama <span className="text-gray-400 font-normal text-xs">(Wajib diisi jika ingin mengubah sandi)</span>
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="old_password"
                  value={formData.old_password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition"
                  placeholder="Masukkan kata sandi lama Anda"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showOldPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Kata Sandi Baru <span className="text-gray-400 font-normal text-xs">(Kosongkan jika tidak ingin diubah)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition"
                  placeholder="Masukkan kata sandi baru"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-5 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#1E3A5F] text-white text-sm font-medium rounded-md shadow-sm hover:bg-[#152943] transition disabled:bg-gray-400"
            >
              {loading ? "Simpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileAdmin;