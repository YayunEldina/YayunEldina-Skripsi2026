import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage/landingpage";
import Register from "./pages/auth/register"; 
import Login from "./pages/auth/login"; 
import DashboardAdmin from "./pages/admin/dashboard/dashboard";
import TransaksiPenjualan from "./pages/admin/transaksipenjualan/TransaksiPenjualan";
import Alternatif from "./pages/admin/alternatif/alternatif";
import Kriteria from "./pages/admin/kriteria/kriteria";
import Perhitungan from "./pages/admin/perhitungan/perhitungan";
import Ranking from "./pages/admin/ranking/ranking";
import Pemesanan from "./pages/member/pemesanan/pemesanan";
import DashboardMember from "./pages/member/dashboard/dashboard";
import TambahTransaksiPenjualan from "./pages/admin/transaksipenjualan/TambahTransaksiPenjualan";
import EditTransaksiPenjualan from "./pages/admin/transaksipenjualan/EditTransaksiPenjualan";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/transaksi" element={<TransaksiPenjualan />} />
        <Route path="/admin/tambah/transaksi" element={<TambahTransaksiPenjualan />} />
        <Route path="/admin/edit/transaksi" element={<EditTransaksiPenjualan />} />
        <Route path="/admin/alternatif" element={<Alternatif />} />
        <Route path="/admin/kriteria" element={<Kriteria />} />
        <Route path="/admin/perhitungan" element={<Perhitungan />} />
        <Route path="/admin/ranking" element={<Ranking />} />
        <Route path="/member/dashboard" element={<DashboardMember />} />
        <Route path="/member/pemesanan" element={<Pemesanan />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
