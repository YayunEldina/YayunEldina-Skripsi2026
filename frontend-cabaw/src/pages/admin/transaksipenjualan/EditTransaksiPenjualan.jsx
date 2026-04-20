import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SidebarNavigation from "../dashboard/sidebarnavigation";
import NavbarAdmin from "../dashboard/navbar_admin";

const EditTransaksiPenjualan = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [tempatTransaksi, setTempatTransaksi] = useState("");
  const [pedagang, setPedagang] = useState("");
  const [selectedKerupuk, setSelectedKerupuk] = useState([]);
  const [jumlah, setJumlah] = useState({});
  const [harga, setHarga] = useState("2500");

  const daftarKerupuk = [
    "Uyel Putih","Uyel Kuning","Kotak","Ikan",
    "Pedas","Saleho","Gorok","Keong","Jari","Padi"
  ];

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/transaksi/${id}`);
        console.log("DATA API:", res.data); // DEBUG

      const data = res.data.data || res.data; // FLEXIBLE (AMAN)

      setNamaPelanggan(
        data.pelanggan?.nama_pelanggan || ""
      );
      
      setJenisKelamin(
        data.pelanggan?.jenis_kelamin || ""
      );
        setTanggal(data.tanggal ? data.tanggal.split(" ")[0] : "");
        setTempatTransaksi(data.tempat_transaksi || "");
        setPedagang(data.pedagang || "");

        const details = data.detail_transaksi || [];

        const itemsMap = {};
        const itemsLabel = [];

        details.forEach((dt) => {
          const nama = dt.produk?.nama_produk || dt.nama_produk;
          if (nama) {
            itemsMap[nama] = dt.jumlah || "";
            itemsLabel.push(nama);
          }
        });

        setJumlah(itemsMap);
        setSelectedKerupuk(itemsLabel);

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
      (acc, val) => acc + (parseInt(val) || 0), 0
    );
  }, [jumlah]);

  const totalHarga = useMemo(() => {
    return totalPembelian * (parseInt(harga) || 0);
  }, [totalPembelian, harga]);

  // ================= HANDLE =================
  const handleSelectKerupuk = (value) => {
    if (!value || value === "-Pilih jenis kerupuk-") return;

    if (!selectedKerupuk.includes(value)) {
      setSelectedKerupuk([...selectedKerupuk, value]);
      setJumlah({ ...jumlah, [value]: "" });
    }
  };

  const handleUpdate = async () => {
    const payload = {
      nama_pelanggan: namaPelanggan,
      jenis_kelamin: jenisKelamin,
      tanggal,
      tempat_transaksi: tempatTransaksi,
      pedagang,
      total_pembelian: totalPembelian,
      total_harga: totalHarga,
      harga_per_pcs: parseInt(harga) || 0,
      items: selectedKerupuk.map(item => ({
        nama: item,
        jumlah: parseInt(jumlah[item]) || 0
      }))
    };

    try {
      await axios.put(`http://127.0.0.1:8000/api/transaksi/${id}`, payload);
      alert("Berhasil update!");
      navigate("/admin/transaksi");
    } catch (err) {
      alert("Gagal update!");
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
    <div className="bg-[#F4F7FE] min-h-screen">

      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-full w-[260px] z-40">
        <SidebarNavigation />
      </div>

      {/* MAIN */}
      <div className="ml-[260px] flex flex-col min-h-screen">

        {/* NAVBAR */}
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <NavbarAdmin />
        </div>

        {/* CONTENT */}
        <div className="px-10 py-10">
          <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-md">

            <h1 className="text-2xl font-bold mb-12 text-[#1E3A5F]">
              Edit Transaksi
            </h1>

            <div className="grid grid-cols-2 gap-14">

              {/* KIRI */}
              <div className="space-y-7">

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Nama Pelanggan
                  </label>
                  <input
                    value={namaPelanggan}
                    onChange={(e)=>setNamaPelanggan(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Jenis Kelamin
                  </label>
                  <select
                    value={jenisKelamin}
                    onChange={(e)=>setJenisKelamin(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                  >
                    <option value="">-Pilih jenis kelamin-</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e)=>setTanggal(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Tempat Transaksi
                  </label>
                  <input
                    value={tempatTransaksi}
                    onChange={(e)=>setTempatTransaksi(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                  />
                </div>

              </div>

              {/* KANAN */}
              <div className="space-y-7">

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Pilih Jenis Kerupuk
                  </label>

                  <select
                    onChange={(e)=>handleSelectKerupuk(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-3"
                  >
                    <option>-Pilih jenis kerupuk-</option>
                    {daftarKerupuk.map((item,i)=>(
                      <option key={i} value={item}>{item}</option>
                    ))}
                  </select>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedKerupuk.map((item,i)=>(
                      <div key={i} className="flex justify-between items-center border border-gray-200 rounded-xl px-4 py-3 bg-white shadow-sm">
                        <span>{item}</span>
                        <div className="flex gap-3">
                          <input
                            type="number"
                            value={jumlah[item]}
                            onChange={(e)=>setJumlah({...jumlah,[item]:e.target.value})}
                            className="w-20 border border-gray-300 rounded text-center"
                          />
                          <button
                            onClick={()=>{
                              const newJumlah={...jumlah};
                              delete newJumlah[item];
                              setJumlah(newJumlah);
                              setSelectedKerupuk(selectedKerupuk.filter(k=>k!==item));
                            }}
                            className="text-red-500"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Nama Pedagang
                  </label>
                  <input
                    value={pedagang}
                    onChange={(e)=>setPedagang(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

                {/* TOTAL */}
                <div className="pt-6 border-t">
                  <div className="flex justify-between">
                    <span>Total Pembelian:</span>
                    <span>{totalPembelian} pcs</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1E3A5F]">
                    <span>Total Harga:</span>
                    <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="flex justify-end gap-4 mt-16">
              <button
                onClick={()=>navigate("/admin/transaksi")}
                className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-100"
              >
                Batal
              </button>

              <button
                onClick={handleUpdate}
                className="px-8 py-3 bg-[#1E3A5F] hover:bg-[#16324a] text-white rounded-xl shadow"
              >
                Update Transaksi
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTransaksiPenjualan;