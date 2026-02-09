import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage/landingpage";
import Register from "./pages/auth/register"; 
import Login from "./pages/auth/login"; 
import Dashboard from "./pages/admin/dashboard/dashboard";
import TransaksiPenjualan from "./pages/admin/transaksipenjualan/TransaksiPenjualan";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/transaksi" element={<TransaksiPenjualan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
