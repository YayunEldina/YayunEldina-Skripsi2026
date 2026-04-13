import { useState, useEffect, useCallback } from "react";
import SidebarNavigationSection from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";
import { FiSearch, FiFilter } from "react-icons/fi";

const Alternatif = () => {
  // 1. STATE
  const [alternatifs, setAlternatifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // 2. FUNGSI TANGGAL OTOMATIS
  const formatTanggal = () => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  };

  // 3. FETCH DATA DARI BACKEND
  const fetchAlternatif = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/alternatifs?page=${page}&search=${search}`
      );
      const result = await response.json();
      setAlternatifs(result.data);
      setPagination(result);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. USE EFFECT (Initial Load & Search Debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAlternatif(1, searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchAlternatif]);

  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR */}
      <SidebarNavigationSection />

      {/* CONTENT */}
      <div className="flex-1 ml-[280px] pt-[50px]">
        {/* NAVBAR */}
        <NavbarAdmin />

        {/* --- BAGIAN TAMPILAN ELEMEN --- */}
        <div className="flex items-center justify-start px-8 py-9 bg-white gap-6">
          {/* 1. Bagian Tanggal */}
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span className="text-base whitespace-nowrap">{formatTanggal()}</span>
            <div className="h-4 w-[1px] bg-gray-300"></div>
          </div>

          {/* 2. Tombol Filter */}
          <button className="p-2 rounded-full border border-gray-200 text-slate-600 hover:bg-gray-50 transition shadow-sm flex-shrink-0">
            <FiFilter size={16} />
          </button>

          {/* 3. Search Bar */}
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1E3A5F] transition-colors" />
            <input
              type="text"
              placeholder="Search all"
              className="pl-10 pr-6 py-2 w-64 bg-white border border-gray-200 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/10 focus:border-[#1E3A5F] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TITLE */}
        <div className="px-8 mt-4">
          <button className="px-5 py-2 bg-[#1E3A5F] text-white rounded-full text-sm font-medium shadow-sm">
            Alternatif Pelanggan
          </button>
        </div>

        {/* TABLE SECTION */}
        <div className="px-8 mt-6">
          <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-slate-700 border-b border-[#E5E5EA]">
                <tr>
                  <th className="px-6 py-4 text-left">Kode Alternatif</th>
                  <th className="px-6 py-4 text-left">Nama Alternatif</th>
                  <th className="px-6 py-4 text-left">Pedagang</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-10">
                      <div className="flex justify-center items-center gap-2">
                        <div className="w-4 h-4 border-2 border-[#1E3A5F] border-t-transparent rounded-full animate-spin"></div>
                        Memuat data...
                      </div>
                    </td>
                  </tr>
                ) : alternatifs.length > 0 ? (
                  alternatifs.map((item, i) => (
                    <tr key={i} className="border-t border-[#E5E5EA] hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-medium text-[#1E3A5F]">
                        {item.kode_alternatif}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {item.nama_alternatif}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {item.pedagang || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-10 text-gray-500">
                      Data tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-6 mb-10 text-sm text-gray-600">
            <div>
              Menampilkan <span className="font-semibold">{alternatifs.length}</span> dari <span className="font-semibold">{pagination.total}</span> data
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchAlternatif(pagination.current_page - 1, searchTerm)}
                disabled={pagination.current_page === 1 || loading}
                className={`px-4 py-1.5 rounded-md border ${pagination.current_page === 1 ? "text-gray-300" : "hover:bg-gray-50"}`}
              >
                {"<"} Previous
              </button>
              <button className="px-4 py-1.5 bg-[#1E3A5F] text-white rounded-md">
                {pagination.current_page}
              </button>
              <button
                onClick={() => fetchAlternatif(pagination.current_page + 1, searchTerm)}
                disabled={pagination.current_page === pagination.last_page || loading}
                className={`px-4 py-1.5 rounded-md border ${pagination.current_page === pagination.last_page ? "text-gray-300" : "hover:bg-gray-50"}`}
              >
                Next {">"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alternatif;