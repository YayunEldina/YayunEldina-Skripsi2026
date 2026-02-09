import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage/landingpage";
import Register from "./pages/auth/register"; 
import Login from "./pages/auth/login"; 
import Dashboard from "./pages/admin/dashboard/dashboard";
import TransaksiPenjualan from "./pages/admin/transaksipenjualan/TransaksiPenjualan";
import Alternatif from "./pages/admin/alternatif/alternatif";
import Kriteria from "./pages/admin/kriteria/kriteria";
import Perhitungan from "./pages/admin/perhitungan/perhitungan";
import Ranking from "./pages/admin/ranking/ranking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/transaksi" element={<TransaksiPenjualan />} />
        <Route path="/admin/alternatif" element={<Alternatif />} />
        <Route path="/admin/kriteria" element={<Kriteria />} />
        <Route path="/admin/perhitungan" element={<Perhitungan />} />
        <Route path="/admin/ranking" element={<Ranking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
