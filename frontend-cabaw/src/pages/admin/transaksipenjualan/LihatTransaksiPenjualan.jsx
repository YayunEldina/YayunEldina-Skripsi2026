import React, { useState, useMemo, useEffect } from "react";
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

export default function LihatTransaksiPenjualan() {
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

  const [diskon, setDiskon] = useState(0);

  const [harga] = useState("2500");

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

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/transaksi/${id}`
        );

        const data = res.data.data || res.data;

        setNamaPelanggan(
          data.pelanggan?.nama_pelanggan || ""
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

        setDiskon(data.diskon || 0);

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

      } catch (err) {
        alert("Gagal ambil data!");
        navigate("/admin/transaksi");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, navigate]);

  // ================= TOTAL =================
  const totalPembelian = useMemo(() => {
    return Object.values(jumlah).reduce(
      (acc, val) => acc + (parseInt(val) || 0),
      0
    );
  }, [jumlah]);

  const totalHarga = useMemo(() => {
    return totalPembelian * (parseInt(harga) || 0);
  }, [totalPembelian, harga]);

  const totalSetelahDiskon = useMemo(() => {
    return totalHarga - (totalHarga * diskon) / 100;
  }, [totalHarga, diskon]);

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

              {/* FILTER */}
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

              {/* PRODUK */}
              <div className="grid grid-cols-4 gap-5">

                {allProducts
                  .filter(
                    (item) =>
                      activeFilter === "Semua" ||
                      item.kategori === activeFilter
                  )
                  .map((item, i) => {

                    const isSelected =
                      selectedKerupuk.some(
                        (k) => k.name === item.name
                      );

                    return (
                      <div
                        key={i}
                        className={`bg-white rounded-xl p-3 transition ${
                          isSelected
                            ? "shadow-md border border-[#1E3A5F]"
                            : "border border-gray-100"
                        }`}
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

                        {/* STATUS */}
                        <div className="mt-3">

                          {isSelected ? (
                            <div className="bg-[#1E3A5F] text-white rounded-lg py-2 text-center font-bold">
                              {jumlah[item.name]} pcs
                            </div>
                          ) : (
                            <div className="bg-gray-100 text-gray-400 rounded-lg py-2 text-center font-medium">
                              Belum dipilih
                            </div>
                          )}

                        </div>

                      </div>
                    );
                  })}

              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">

              <div className="bg-[#1E3A5F] text-white px-5 py-3 rounded-xl mb-6 font-semibold">
                Detail Transaksi Penjualan
              </div>

              <div className="space-y-4">

                {/* NAMA */}
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">
                    Nama Pelanggan
                  </label>

                  <input
                    value={namaPelanggan}
                    readOnly
                    className="flex-1 border rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                {/* TANGGAL */}
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">
                    Tanggal
                  </label>

                  <input
                    type="date"
                    value={tanggal}
                    readOnly
                    className="flex-1 border rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                {/* TEMPAT */}
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">
                    Tempat Transaksi
                  </label>

                  <input
                    value={tempatTransaksi}
                    readOnly
                    className="flex-1 border rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                {/* PEDAGANG */}
                <div className="flex items-center gap-4">
                  <label className="w-44 text-base font-medium text-gray-500">
                    Pedagang
                  </label>

                  <input
                    value={pedagang}
                    readOnly
                    className="flex-1 border rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

              </div>

              {/* DAFTAR PESANAN */}
              <div className="border-t border-gray-200 pt-4 mt-6">

                <h3 className="font-semibold mb-3">
                  Daftar Pesanan
                </h3>

                <div className="space-y-2 max-h-[200px] overflow-y-auto">

                  {selectedKerupuk.map((item, i) => (
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

                      <div className="bg-white border rounded-lg px-4 py-2 font-bold text-[#1E3A5F]">
                        {jumlah[item.name]} pcs
                      </div>

                    </div>
                  ))}

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
                    {totalHarga.toLocaleString("id-ID")}
                  </p>

                  <div className="mt-3">

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
                      navigate("/admin/transaksi")
                    }
                    className="w-full px-6 py-3 rounded-xl bg-[#1E3A5F] text-white font-semibold hover:opacity-90 shadow-lg transition-all"
                  >
                    Kembali
                  </button>

                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}