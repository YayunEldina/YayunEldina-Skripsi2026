import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavbarAdmin from "../dashboard/navbar_admin";
import Swal from "sweetalert2";

// IMPORT GAMBAR
import Gorok from "../../../assets/krupuk_gorok.png";
import Ikan from "../../../assets/krupuk_ikan.png";
import Jari from "../../../assets/krupuk_jari.png";
import Keong from "../../../assets/krupuk_keong.png";
import Kotak from "../../../assets/krupuk_kotak.png";
import Padi from "../../../assets/krupuk_padi.png";
import Pedas from "../../../assets/krupuk_pedas.png";
import Saleho from "../../../assets/krupuk_saleho.png";
import UyelKuning from "../../../assets/krupuk_uyelkuning.png";
import UyelPutih from "../../../assets/krupuk_uyelputih.png";

const EditTransaksiPenjualan = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Semua");

  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [tempatTransaksi, setTempatTransaksi] = useState("");
  const [pedagang, setPedagang] = useState("");

  const [selectedKerupuk, setSelectedKerupuk] = useState([]);
  const [jumlah, setJumlah] = useState({});
  const [harga] = useState("2.500");

  // State sinkronisasi fitur pelanggan lama / baru dinamis
  const [diskon, setDiskon] = useState(0);
  const [prioritas, setPrioritas] = useState("-");
  const [alternatifList, setAlternatifList] = useState([]);
  const [selectedAlternatif, setSelectedAlternatif] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
  const [tempNewName, setTempNewName] = useState("");
  const [isNewFromDropdown, setIsNewFromDropdown] = useState(false);
  const [isLoadingDiskon, setIsLoadingDiskon] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  
  const dropdownRef = useRef(null);
  const normalize = (val) => (val || "").toString().toLowerCase().trim();

  // ================= PRODUK =================
  const allProducts = useMemo(() => [
    { name: "Kotak", img: Kotak, kategori: "Gurih" },
    { name: "Padi", img: Padi, kategori: "Gurih" },
    { name: "Pedas", img: Pedas, kategori: "Pedas" },
    { name: "Saleho", img: Saleho, kategori: "Gurih" },
    { name: "Uyel Kuning", img: UyelKuning, kategori: "Gurih" },
    { name: "Uyel Putih", img: UyelPutih, kategori: "Gurih" },
    { name: "Gorok", img: Gorok, kategori: "Manis" },
    { name: "Ikan", img: Ikan, kategori: "Gurih" },
    { name: "Jari", img: Jari, kategori: "Gurih" },
    { name: "Keong", img: Keong, kategori: "Gurih" },
  ], []);

  // ================= LOAD MASTER ALTERNATIF =================
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/alternatif/list`)
      .then(res => setAlternatifList(res.data))
      .catch(() => console.log("Gagal ambil alternatif"));
  }, []);

// ================= FETCH DATA TRANSAKSI DETAIL (EDIT MODE) =================
useEffect(() => {
  if (!id || alternatifList.length === 0) return;

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/transaksi/${id}`
      );
      const data = res.data.data || res.data;

      console.log("=== DATA TRANSAKSI EDIT ===", data);

      const currentNama = data.pelanggan?.nama_pelanggan || data.nama_pelanggan || "";
      const currentPedagang = (data.pedagang || "").trim();

      setNamaPelanggan(currentNama);
      setTanggal(data.tanggal ? data.tanggal.split(" ")[0] : "");
      setTempatTransaksi(data.tempat_transaksi || "");
      setPedagang(currentPedagang);

      const dbIdPelanggan = data.id_pelanggan;

      // =======================
      // CEK STATUS ASLI DATABASE
      // =======================
      
      if (Number(data.is_pelanggan_baru) === 1) {
      
        setSelectedAlternatif(null);
        setIsNewFromDropdown(true);
      
      } else {
      
        const matchAlternatif = alternatifList.find(
          (alt) => String(alt.id_pelanggan) === String(dbIdPelanggan)
        );
      
        if (matchAlternatif) {
          setSelectedAlternatif(matchAlternatif);
          setIsNewFromDropdown(false);
        } else {
          setSelectedAlternatif(null);
          setIsNewFromDropdown(false);
        }
      }

      // Load produk yang dibeli
      const details = data.detail_transaksi || [];
      const itemsMap = {};
      const itemsList = [];

      details.forEach((dt) => {
        const nama = dt.produk?.nama_produk || dt.nama_produk;
        const produkObj = allProducts.find((p) => p.name === nama);
        if (produkObj) {
          itemsMap[nama] = dt.jumlah || 1;
          itemsList.push(produkObj);
        }
      });

      setJumlah(itemsMap);
      setSelectedKerupuk(itemsList);

    } catch (err) {
      console.error("Gagal mengambil data detail edit:", err);
      alert("Gagal ambil data transaksi!");
      navigate("/admin/transaksi");
    } finally {
      setLoading(false);
      setIsDataLoaded(true); // Menandakan data selesai di-load agar useEffect validasi diskon bisa berjalan
    }
  };

  fetchData();
}, [id, allProducts, alternatifList, navigate]);

// ================= VALIDASI DISKON & KUOTA SPK REALTIME =================
useEffect(() => {

  console.log("isNewFromDropdown", isNewFromDropdown);
console.log("selectedAlternatif", selectedAlternatif);
console.log("prioritas", prioritas);
  if (!isDataLoaded) return; // ✅ Fix Bug 2: Jangan jalan sebelum data siap

  if (isNewFromDropdown) {
    setDiskon(0);
    setPrioritas("Pelanggan Baru");
    setIsLoadingDiskon(false);
    return;
  }

  if (!selectedAlternatif) {
    setDiskon(0);
    setPrioritas("Pelanggan Baru");
    return;
  }

  if (!namaPelanggan || !pedagang) {
    setDiskon(0);
    setPrioritas("-");
    return;
  }

  if (!tanggal) {
    setDiskon(0);
    setPrioritas("Pilih Tanggal Dahulu");
    return;
  }

  setIsLoadingDiskon(true);

  const delay = setTimeout(async () => {
    try {
      const tanggalPilihan = new Date(tanggal);
      const tahunPilihan = tanggalPilihan.getFullYear();
      const bulanPilihan = tanggalPilihan.getMonth() + 1;

      let tahunSumber;
      let bulanSumber = null;
      
      if (tahunPilihan === 2026 && bulanPilihan === 1) {
      
        // Januari 2026 memakai ranking tahunan 2025
        tahunSumber = 2025;
        bulanSumber = null;
      
      } else {
      
        // Selain Januari memakai ranking bulan sebelumnya
      
        if (bulanPilihan === 1) {
          tahunSumber = tahunPilihan - 1;
          bulanSumber = 12;
        } else {
          tahunSumber = tahunPilihan;
          bulanSumber = bulanPilihan - 1;
        }
      }

      const idAlternatifKirim = selectedAlternatif?.id_alternatif || selectedAlternatif?.id;

      const resKuota = await axios.get(`${import.meta.env.VITE_API_URL}/transaksi/cek-kuota`, {
        params: {
          id_pelanggan: idAlternatifKirim,
          pedagang: pedagang.trim(), // ✅ Fix Bug 3: pastikan trim
          tanggal: tanggal,
          id_transaksi: id
        }
      });

      const paramsSPK = { tahun: tahunSumber };
      if (bulanSumber !== null) paramsSPK.bulan = bulanSumber;

      const resSPK = await axios.get(`${import.meta.env.VITE_API_URL}/hasil-perhitungan`, {
        params: paramsSPK,
      });
      const dataSPK = resSPK.data || [];

      const found = dataSPK.find(
        (item) => String(item.id_alternatif) === String(idAlternatifKirim)
      );

      if (resKuota.data && resKuota.data.sudah_transaksi === true) {
        setDiskon(0);
        setPrioritas(found
          ? `${found.prioritas} (Kuota Bulan Ini Habis)`
          : "Pelanggan Lama (Kuota Bulan Ini Habis)"
        );
      } else {
        if (found) {
          setDiskon(parseFloat(found.diskon || 0));
          setPrioritas(found.prioritas);
        } else {
          setDiskon(0);
          setPrioritas("Pelanggan Lama (Tidak Ada di SPK)");
        }
      }
    } catch (error) {
      console.error("Gagal memproses validasi diskon:", error);
      setDiskon(0);
      setPrioritas("Error Jaringan");
    } finally {
      setIsLoadingDiskon(false);
    }
  }, 500);

  return () => clearTimeout(delay);
}, [namaPelanggan, pedagang, selectedAlternatif, isNewFromDropdown, tanggal, id, isDataLoaded]);
//                                                                              ✅ tambah isDataLoaded

  // Close dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ================= PERHITUNGAN HARGA =================
  const totalPembelian = useMemo(() => {
    return Object.values(jumlah).reduce((acc, val) => acc + (parseInt(val) || 0), 0);
  }, [jumlah]);

  const totalHarga = useMemo(() => {
    const hargaNumber = parseInt(harga.replace(/\./g, "")) || 0;
    return totalPembelian * hargaNumber;
  }, [totalPembelian, harga]);

  const totalSetelahDiskon = useMemo(() => {
    return totalHarga - (totalHarga * diskon) / 100;
  }, [totalHarga, diskon]);

  const handleTambahProduk = (produk) => {
    const existing = selectedKerupuk.find((p) => p.name === produk.name);
    if (!existing) {
      setSelectedKerupuk([...selectedKerupuk, produk]);
      setJumlah({ ...jumlah, [produk.name]: 1 });
    } else {
      setJumlah({ ...jumlah, [produk.name]: (jumlah[produk.name] || 0) + 1 });
    }
  };

  // ================= ACTION UPDATE =================
  const handleUpdate = async () => {
    if (!namaPelanggan || selectedKerupuk.length === 0) {
      alert("Mohon lengkapi data pelanggan dan pesanan");
      return;
    }
    if (!pedagang.trim()) {
      alert("Pedagang wajib diisi");
      return;
    }

    const isPelangganBaru = isNewFromDropdown;

    const payload = {
      nama_pelanggan: namaPelanggan,
      tanggal,
      tempat_transaksi: tempatTransaksi,
      pedagang: pedagang.trim() || "-",
      total_pembelian: totalPembelian,
      total_harga: totalHarga,
      harga_per_pcs: 2500,
      diskon: diskon,
      is_pelanggan_baru: isPelangganBaru ? 1 : 0,
      id_alternatif: selectedAlternatif ? selectedAlternatif.id_alternatif : "null",
      items: selectedKerupuk.map((item) => ({
        nama: item.name,
        jumlah: jumlah[item.name],
      })),
    };

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/transaksi/${id}`, payload);
    
      await Swal.fire({
        icon: "success",
        title: "Update Berhasil!",
        text: "Data transaksi berhasil diperbarui",
        confirmButtonText: "OK",
        confirmButtonColor: "#1E3A5F",
        timer: 2000,
        timerProgressBar: true,
      });
    
      navigate("/admin/transaksi");
    
    } catch (error) {
      console.log("ERROR:", error.response?.data);
    
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Transaksi gagal diperbarui",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const keyword = namaPelanggan.toLowerCase();
  const filteredAlternatif = alternatifList.filter((item) => {
    return (
      (item.nama_alternatif || "").toLowerCase().includes(keyword) ||
      (item.pedagang || "").toLowerCase().includes(keyword)
    );
  });

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-[30px]">
        <NavbarAdmin />
        <div className="p-8">
          <div className="grid grid-cols-3 gap-6">
            
            {/* DAFTAR PRODUK */}
            <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <div className="bg-gray-300 text-gray-800 px-5 py-3 rounded-xl mb-6 font-semibold">
                Daftar Krupuk Cap Bawang
              </div>
              <div className="flex gap-3 mb-6">
                {["Semua", "Gurih", "Pedas", "Manis"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveFilter(tag)}
                    className={`px-4 py-2 rounded-full text-sm border transition bg-white text-black ${
                      activeFilter === tag ? "border-[#1E3A5F]" : "border-gray-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-5">
                {allProducts
                  .filter((item) => activeFilter === "Semua" || item.kategori === activeFilter)
                  .map((item, i) => (
                    <div key={i} onClick={() => handleTambahProduk(item)} className="bg-white rounded-xl p-3 cursor-pointer hover:shadow-md transition">
                      <img src={item.img} className="w-full h-[120px] object-cover rounded-lg" alt={item.name} />
                      <p className="text-sm font-semibold mt-2">{item.name}</p>
                      <p className="text-xs text-gray-500">Rp 2.500 / bungkus</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* FORM EDIT */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="bg-[#1E3A5F] text-white px-5 py-3 rounded-xl mb-6 font-semibold">
                Edit Transaksi Penjualan
              </div>
              <div className="space-y-4 mb-4">
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">Nama Pelanggan</label>

                  {/* SEARCH DROPDOWN DENGAN LOGIKA NAMA SAMA / BARU */}
                  <div className="flex-1 relative" ref={dropdownRef}>
                    <input
                      type="text"
                      value={namaPelanggan}
                      onChange={(e) => {
                        setNamaPelanggan(e.target.value);
                        setShowDropdown(true);
                        setSelectedAlternatif(null);
                        setIsNewFromDropdown(true); // ✅ User ngetik manual = anggap pelanggan baru
                      }}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Cari / pilih pelanggan..."
                      className="w-full border rounded-lg px-3 py-2 bg-white"
                    />

                    {showDropdown && (
                      <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                        {filteredAlternatif.map((alt) => (
                          <div
                            key={alt.id_alternatif}
                            onClick={() => {
                              setSelectedAlternatif(alt);
                              setNamaPelanggan(alt.nama_alternatif);
                              setPedagang(alt.pedagang);
                              setIsNewFromDropdown(false); 
                              setShowDropdown(false);
                            }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {alt.nama_alternatif} - {alt.pedagang}
                          </div>
                        ))}

                        {filteredAlternatif.length === 0 && (
                          <div className="px-3 py-2 text-gray-400 text-sm">Tidak ditemukan</div>
                        )}

                        <div className="border-t mt-2 pt-2 px-3">
                          {!isAddingNewCustomer ? (
                            <button
                              type="button"
                              onMouseDown={() => setIsAddingNewCustomer(true)}
                              className="text-blue-600 text-sm font-semibold mb-2"
                            >
                              + Paksa Jadi Pelanggan Baru (Nama/Pedagang Sama)
                            </button>
                          ) : (
                            <div className="flex flex-col gap-2 pb-2">
                              <input
                                value={tempNewName}
                                onChange={(e) => setTempNewName(e.target.value)}
                                placeholder="Tulis ulang nama untuk data baru..."
                                className="w-full border px-2 py-1 rounded text-sm bg-white"
                                autoFocus
                              />
                              <button
                                type="button"
                                className="bg-blue-600 text-white py-1 px-2 rounded text-sm w-full font-medium"
                                onClick={() => {
                                  if (!tempNewName.trim()) return;
                                  setNamaPelanggan(tempNewName.trim());
                                  setPedagang(""); 
                                  setSelectedAlternatif(null); 
                                  setIsNewFromDropdown(true); 
                                  setTempNewName("");
                                  setIsAddingNewCustomer(false);
                                  setShowDropdown(false);
                                }}
                              >
                                Gunakan Sebagai Pelanggan Baru
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">Tanggal</label>
                  <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="flex-1 border rounded-lg px-3 py-2 bg-white" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">Tempat Transaksi</label>
                  <input type="text" value={tempatTransaksi} onChange={(e) => setTempatTransaksi(e.target.value)} className="flex-1 border rounded-lg px-3 py-2 bg-white" placeholder="Masukkan tempat transaksi" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">Pedagang</label>
                  <input
                    type="text"
                    value={pedagang}
                    onChange={(e) => setPedagang(e.target.value)}
                    readOnly={!!selectedAlternatif} 
                    placeholder="Masukkan nama pedagang"
                    className={`flex-1 border rounded-lg px-3 py-2 ${
                      selectedAlternatif ? "bg-gray-100 text-gray-500" : "bg-white text-gray-700"
                    }`}
                  />
                </div>
              </div>

              {/* DAFTAR PESANAN */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold mb-3">Daftar Pesanan</h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {selectedKerupuk.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-100 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img src={item.img} className="w-14 h-14 object-contain bg-white rounded-lg p-1" alt={item.name} />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                          <p className="text-sm text-gray-500 font-medium">Rp2.500</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => {
                            const updated = { ...jumlah };
                            delete updated[item.name];
                            setJumlah(updated);
                            setSelectedKerupuk(selectedKerupuk.filter((k) => k.name !== item.name));
                        }} className="bg-red-400 text-white px-2 py-1 rounded-md">🗑</button>
                        <button onClick={() => setJumlah({ ...jumlah, [item.name]: Math.max(1, (jumlah[item.name] || 1) - 1) })} className="bg-yellow-400 px-3 py-1 rounded-md">-</button>
                        <input
                          type="number"
                          min="1"
                          value={jumlah[item.name] ?? ""}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);

                            setJumlah({
                              ...jumlah,
                              [item.name]: isNaN(value) || value < 1 ? 1 : value,
                            });
                          }}
                          className="w-14 text-center bg-white border rounded-md font-bold"
                        />
                        <button onClick={() => setJumlah({ ...jumlah, [item.name]: (jumlah[item.name] || 1) + 1 })} className="bg-yellow-400 px-3 py-1 rounded-md">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col items-end text-right">
                  <p className="text-base text-gray-600">Total Item: <span className="font-semibold text-gray-800">{totalPembelian}</span></p>
                  <p className="text-2xl font-bold text-[#1E3A5F] mt-1">Rp {totalHarga.toLocaleString("id-ID")}</p>

                  <div className="mt-3">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                        isLoadingDiskon
                          ? "bg-gray-100 text-gray-400 animate-pulse"
                          : prioritas.includes("Kuota Bulan Ini Habis")
                          ? "bg-red-100 text-red-700"
                          : prioritas === "Prioritas Tinggi"
                          ? "bg-green-100 text-green-700"
                          : prioritas === "Prioritas Sedang"
                          ? "bg-yellow-100 text-yellow-700"
                          : prioritas === "Prioritas Rendah"
                          ? "bg-blue-100 text-blue-700"
                          : prioritas === "Pelanggan Baru"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-gray-100 text-gray-500"
                    }`}>
                      {isLoadingDiskon ? "Mengecek status..." : prioritas}
                    </span>

                    <p className="text-sm text-gray-500 mt-2">
                      Diskon: <span className="text-green-600 font-bold">{diskon}%</span>
                    </p>
                    <p className="text-xl font-bold text-green-600 mt-1">
                      Total Bayar: Rp {totalSetelahDiskon.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 w-full">
                  <button onClick={() => navigate("/admin/transaksi")} className="flex-[3] px-6 py-3 rounded-xl border border-gray-300 text-gray-500 hover:bg-gray-50 transition-all font-medium">
                    Batal
                  </button>
                  <button onClick={handleUpdate} className="flex-[7] px-6 py-3 rounded-xl bg-[#1E3A5F] text-white font-semibold hover:opacity-90 shadow-lg transition-all">
                    Update Transaksi
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTransaksiPenjualan;