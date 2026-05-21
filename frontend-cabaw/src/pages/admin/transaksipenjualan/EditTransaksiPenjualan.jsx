import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavbarAdmin from "../dashboard/navbar_admin";

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
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [tempatTransaksi, setTempatTransaksi] = useState("");
  const [pedagang, setPedagang] = useState("");

  const [selectedKerupuk, setSelectedKerupuk] = useState([]);
  const [jumlah, setJumlah] = useState({});
  const [harga] = useState("2.500");

  // ================= DROPDOWN =================
  const [alternatifList, setAlternatifList] = useState([]);
  const [selectedAlternatif, setSelectedAlternatif] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);

  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);

  const [tempNewName, setTempNewName] = useState("");

  const [isNewFromDropdown, setIsNewFromDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // ================= DISKON =================
  const [diskon, setDiskon] = useState(0);
  const [prioritas, setPrioritas] = useState("-");
  const [isLoadingDiskon, setIsLoadingDiskon] = useState(false);

  const [isDataReady, setIsDataReady] = useState(false);

  const normalize = (val) =>
    (val || "").toString().toLowerCase().trim();

  // ================= PRODUK =================
  const allProducts = [
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
  ];

  // ================= FETCH ALTERNATIF =================
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/alternatif/list")
      .then((res) => {
        setAlternatifList(res.data);
      })
      .catch(() => {
        console.log("Gagal ambil alternatif");
      });
  }, []);

  // ================= CLICK OUTSIDE =================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // ================= FILTER DROPDOWN =================
  const keyword = namaPelanggan.toLowerCase();

  const filteredAlternatif = alternatifList.filter((item) => {
    return (
      (item.nama_alternatif || "")
        .toLowerCase()
        .includes(keyword) ||
      (item.pedagang || "")
        .toLowerCase()
        .includes(keyword)
    );
  });

  // ================= FETCH TRANSAKSI =================
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/transaksi/${id}`
        );

        const data = res.data.data || res.data;

        setNamaPelanggan(
          data.pelanggan?.nama_pelanggan || ""
        );

        setJenisKelamin(
          data.pelanggan?.jenis_kelamin || ""
        );

        setTanggal(
          data.tanggal
            ? data.tanggal.split(" ")[0]
            : ""
        );

        setTempatTransaksi(
          data.tempat_transaksi || ""
        );

        setPedagang(data.pedagang || "");

        const details = data.detail_transaksi || [];

        const itemsMap = {};
        const itemsList = [];

        details.forEach((dt) => {
          const nama =
            dt.produk?.nama_produk ||
            dt.nama_produk;

          const produkObj = allProducts.find(
            (p) => p.name === nama
          );

          if (produkObj) {
            itemsMap[nama] = dt.jumlah || 1;
            itemsList.push(produkObj);
          }
        });

        setJumlah(itemsMap);
        setSelectedKerupuk(itemsList);

        const foundAlternatif = alternatifList.find(
          (alt) =>
            normalize(alt.nama_alternatif) ===
              normalize(
                data.pelanggan?.nama_pelanggan
              ) &&
            normalize(alt.pedagang) ===
              normalize(data.pedagang)
        );

        if (foundAlternatif) {
          setSelectedAlternatif(foundAlternatif);
        }

        setIsDataReady(true);
      } catch {
        alert("Gagal ambil data!");
        navigate("/admin/transaksi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, alternatifList]);

  // ================= FETCH DISKON =================
  // ================= FETCH DISKON =================
useEffect(() => {
  if (!isDataReady) return;

  // pelanggan baru murni
  if (isNewFromDropdown || !selectedAlternatif) {
    setDiskon(0);
    setPrioritas("Pelanggan Baru");
    setIsLoadingDiskon(false);
    return;
  }

  if (!namaPelanggan || !pedagang) {
    setDiskon(0);
    setPrioritas("-");
    return;
  }

  setIsLoadingDiskon(true);

  const delay = setTimeout(() => {
    axios
      .get(
        "http://127.0.0.1:8000/api/hasil-perhitungan",
        {
          params: {
            tahun:
              new Date().getFullYear() - 1,
          },
        }
      )
      .then((res) => {
        const found = res.data.find(
          (item) =>
            normalize(item.nama) ===
              normalize(namaPelanggan) &&
            normalize(item.pedagang) ===
              normalize(pedagang) &&
            item.id_alternatif ===
              selectedAlternatif?.id_alternatif
        );

        if (found) {
          setDiskon(found.diskon);
          setPrioritas(found.prioritas);
        } else {
          setDiskon(0);
          setPrioritas("Pelanggan Baru");
        }
      })
      .catch(() => {
        setDiskon(0);
        setPrioritas("Error");
      })
      .finally(() =>
        setIsLoadingDiskon(false)
      );
  }, 500);

  return () => clearTimeout(delay);
}, [
  namaPelanggan,
  pedagang,
  selectedAlternatif,
  isNewFromDropdown,
  isDataReady,
]);

  // ================= TOTAL =================
  const totalPembelian = useMemo(() => {
    return Object.values(jumlah).reduce(
      (acc, val) => acc + (parseInt(val) || 0),
      0
    );
  }, [jumlah]);

  const totalHarga = useMemo(() => {
    const hargaNumber =
      parseInt(harga.replace(/\./g, "")) || 0;

    return totalPembelian * hargaNumber;
  }, [totalPembelian, harga]);

  const totalSetelahDiskon = useMemo(() => {
    return totalHarga - (totalHarga * diskon) / 100;
  }, [totalHarga, diskon]);

  // ================= TAMBAH PRODUK =================
  const handleTambahProduk = (produk) => {
    const existing = selectedKerupuk.find(
      (p) => p.name === produk.name
    );

    if (!existing) {
      setSelectedKerupuk([
        ...selectedKerupuk,
        produk,
      ]);

      setJumlah({
        ...jumlah,
        [produk.name]: 1,
      });
    } else {
      setJumlah({
        ...jumlah,
        [produk.name]:
          (jumlah[produk.name] || 0) + 1,
      });
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (
      !namaPelanggan ||
      selectedKerupuk.length === 0
    ) {
      alert(
        "Mohon lengkapi data pelanggan dan pesanan"
      );
      return;
    }

    const payload = {
      nama_pelanggan: namaPelanggan,
      jenis_kelamin: jenisKelamin,
      tanggal,
      tempat_transaksi: tempatTransaksi,
      pedagang: pedagang.trim() || "-",
      total_pembelian: totalPembelian,
      total_harga: totalHarga,
      harga_per_pcs: 2500,
      diskon,
      id_alternatif: selectedAlternatif
        ? selectedAlternatif.id_alternatif
        : null,

      is_pelanggan_baru:
        !selectedAlternatif,

      items: selectedKerupuk.map((item) => ({
        nama: item.name,
        jumlah:
          parseInt(jumlah[item.name]) || 0,
      })),
    };

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/transaksi/${id}`,
        payload
      );

      alert("Transaksi berhasil diperbarui!");

      navigate("/admin/transaksi");
    } catch (err) {
      console.error(
        "ERROR:",
        err.response?.data
      );

      alert("Gagal update transaksi!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-[30px]">
        <NavbarAdmin />

        <div className="p-8">
          <div className="grid grid-cols-3 gap-6">

            {/* LEFT SIDE */}
            <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <div className="bg-gray-300 text-gray-800 px-5 py-3 rounded-xl mb-6 font-semibold">
                Daftar Krupuk Cap Bawang
              </div>

              <div className="flex gap-3 mb-6">
                {["Semua", "Gurih", "Pedas", "Manis"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setActiveFilter(tag)
                    }
                    className={`px-4 py-2 rounded-full text-sm border transition bg-white text-black ${
                      activeFilter === tag
                        ? "border-[#1E3A5F]"
                        : "border-gray-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-5">
                {allProducts
                  .filter(
                    (item) =>
                      activeFilter === "Semua" ||
                      item.kategori ===
                        activeFilter
                  )
                  .map((item, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        handleTambahProduk(item)
                      }
                      className="bg-white rounded-xl p-3 cursor-pointer hover:shadow-md transition"
                    >
                      <img
                        src={item.img}
                        className="w-full h-[120px] object-cover rounded-lg"
                        alt={item.name}
                      />

                      <p className="text-sm font-semibold mt-2">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        Rp 2.500 / bungkus
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">

              <div className="bg-[#1E3A5F] text-white px-5 py-3 rounded-xl mb-6 font-semibold">
                Edit Transaksi Penjualan
              </div>

              <div className="space-y-4 mb-4">

                {/* NAMA */}
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">
                    Nama Pelanggan
                  </label>

                  <div
                    className="flex-1 relative"
                    ref={dropdownRef}
                  >
                    <input
                      type="text"
                      value={namaPelanggan}
                      onChange={(e) => {
                        setNamaPelanggan(
                          e.target.value
                        );
                      
                        setShowDropdown(true);
                      
                        setSelectedAlternatif(null);
                      
                        setIsNewFromDropdown(false);
                      }}
                      onFocus={() =>
                        setShowDropdown(true)
                      }
                      placeholder="Cari / pilih pelanggan..."
                      className="w-full border rounded-lg px-3 py-2"
                    />

                    {showDropdown && (
                      <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">

                        {filteredAlternatif.map(
                          (alt) => (
                            <div
                              key={
                                alt.id_alternatif
                              }
                              onClick={() => {
                                setSelectedAlternatif(
                                  alt
                                );

                                setNamaPelanggan(
                                  alt.nama_alternatif
                                );

                                setPedagang(
                                  alt.pedagang
                                );

                                setIsNewFromDropdown(
                                  false
                                );

                                setShowDropdown(
                                  false
                                );
                              }}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {
                                alt.nama_alternatif
                              }{" "}
                              - {alt.pedagang}
                            </div>
                          )
                        )}

                        {filteredAlternatif.length ===
                          0 && (
                          <div className="px-3 py-2 text-gray-400 text-sm">
                            Tidak ditemukan
                          </div>
                        )}

                        <div className="border-t mt-2 pt-2 px-3">

                          {!isAddingNewCustomer ? (
                            <button
                              onMouseDown={() =>
                                setIsAddingNewCustomer(
                                  true
                                )
                              }
                              className="text-blue-600 text-sm font-semibold"
                            >
                              + Tambah pelanggan baru
                            </button>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                value={
                                  tempNewName
                                }
                                onChange={(e) =>
                                  setTempNewName(
                                    e.target
                                      .value
                                  )
                                }
                                placeholder="Nama pelanggan baru..."
                                className="w-full border px-2 py-1 rounded text-sm"
                              />

                              <button
                                className="bg-blue-600 text-white px-2 rounded text-sm"
                                onClick={() => {
                                  if (
                                    !tempNewName.trim()
                                  )
                                    return;

                                  const newName =
                                    tempNewName.trim();

                                  setNamaPelanggan(
                                    newName
                                  );

                                  setPedagang(
                                    "-"
                                  );

                                  setSelectedAlternatif(
                                    null
                                  );

                                  setIsNewFromDropdown(
                                    true
                                  );

                                  setTempNewName(
                                    ""
                                  );

                                  setIsAddingNewCustomer(
                                    false
                                  );

                                  setShowDropdown(
                                    false
                                  );
                                }}
                              >
                                Simpan
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* JENIS KELAMIN */}
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">
                    Jenis Kelamin
                  </label>

                  <select
                    value={jenisKelamin}
                    onChange={(e) =>
                      setJenisKelamin(
                        e.target.value
                      )
                    }
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700"
                  >
                    <option value="">
                      Pilih jenis kelamin
                    </option>

                    <option>
                      Laki-laki
                    </option>

                    <option>
                      Perempuan
                    </option>
                  </select>
                </div>

                {/* TANGGAL */}
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">
                    Tanggal
                  </label>

                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) =>
                      setTanggal(
                        e.target.value
                      )
                    }
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                </div>

                {/* TEMPAT */}
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">
                    Tempat Transaksi
                  </label>

                  <input
                    type="text"
                    value={tempatTransaksi}
                    onChange={(e) =>
                      setTempatTransaksi(
                        e.target.value
                      )
                    }
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="Masukkan tempat transaksi"
                  />
                </div>

                {/* PEDAGANG */}
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">
                    Pedagang
                  </label>

                  <input
                  type="text"
                  value={pedagang}
                  onChange={(e) => setPedagang(e.target.value)}
                  readOnly={!!selectedAlternatif}
                  placeholder="Masukkan nama pedagang"
                  className={`flex-1 border rounded-lg px-3 py-2 ${
                    selectedAlternatif
                      ? "bg-gray-100"
                      : "bg-white"
                  }`}
                />
                </div>
              </div>

              {/* DAFTAR PESANAN */}
              <div className="border-t border-gray-200 pt-4">

                <h3 className="font-semibold mb-3">
                  Daftar Pesanan
                </h3>

                <div className="space-y-2 max-h-[200px] overflow-y-auto">

                  {selectedKerupuk.map(
                    (item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-gray-100 p-3 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.img}
                            className="w-14 h-14 object-contain bg-white rounded-lg p-1"
                            alt={item.name}
                          />

                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {item.name}
                            </p>

                            <p className="text-sm text-gray-500 font-medium">
                              Rp2.500
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() => {
                              const updated = {
                                ...jumlah,
                              };

                              delete updated[
                                item.name
                              ];

                              setJumlah(updated);

                              setSelectedKerupuk(
                                selectedKerupuk.filter(
                                  (k) =>
                                    k.name !==
                                    item.name
                                )
                              );
                            }}
                            className="bg-red-400 text-white px-2 py-1 rounded-md"
                          >
                            🗑
                          </button>

                          <button
                            onClick={() =>
                              setJumlah({
                                ...jumlah,
                                [item.name]:
                                  Math.max(
                                    1,
                                    (jumlah[
                                      item.name
                                    ] || 1) - 1
                                  ),
                              })
                            }
                            className="bg-yellow-400 px-3 py-1 rounded-md"
                          >
                            -
                          </button>

                          <input
                            type="text"
                            value={
                              jumlah[
                                item.name
                              ] ?? ""
                            }
                            readOnly
                            className="w-10 text-center bg-transparent font-bold"
                          />

                          <button
                            onClick={() =>
                              setJumlah({
                                ...jumlah,
                                [item.name]:
                                  (jumlah[
                                    item.name
                                  ] || 1) + 1,
                              })
                            }
                            className="bg-yellow-400 px-3 py-1 rounded-md"
                          >
                            +
                          </button>

                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* TOTAL */}
                <div className="mt-6 flex flex-col items-end text-right">

                  <p className="text-base text-gray-600">
                    Total Item:{" "}
                    <span className="font-semibold text-gray-800">
                      {totalPembelian}
                    </span>
                  </p>

                  <p className="text-2xl font-bold text-[#1E3A5F] mt-1">
                    Rp{" "}
                    {totalHarga.toLocaleString(
                      "id-ID"
                    )}
                  </p>

                  <div className="mt-3">

                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        isLoadingDiskon
                          ? "bg-gray-100 text-gray-400 animate-pulse"
                          : prioritas ===
                            "Prioritas Tinggi"
                          ? "bg-green-100 text-green-700"
                          : prioritas ===
                            "Prioritas Sedang"
                          ? "bg-yellow-100 text-yellow-700"
                          : prioritas ===
                            "Prioritas Rendah"
                          ? "bg-blue-100 text-blue-700"
                          : prioritas ===
                            "Pelanggan Baru"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isLoadingDiskon
                        ? "Mengecek status..."
                        : prioritas}
                    </span>

                    <p className="text-sm text-gray-500 mt-2">
                      Diskon:{" "}
                      <span className="text-green-600 font-bold">
                        {diskon}%
                      </span>
                    </p>

                    <p className="text-xl font-bold text-green-600 mt-1">
                      Total Bayar: Rp{" "}
                      {totalSetelahDiskon.toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>

                {/* BUTTON */}
                <div className="flex gap-4 mt-8 w-full">

                  <button
                    onClick={() =>
                      navigate(
                        "/admin/transaksi"
                      )
                    }
                    className="flex-[3] px-6 py-3 rounded-xl border border-gray-300 text-gray-500 hover:bg-gray-50 transition-all font-medium"
                  >
                    Batal
                  </button>

                  <button
                    onClick={handleUpdate}
                    className="flex-[7] px-6 py-3 rounded-xl bg-[#1E3A5F] text-white font-semibold hover:opacity-90 shadow-lg transition-all"
                  >
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