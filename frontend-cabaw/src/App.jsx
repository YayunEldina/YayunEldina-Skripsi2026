import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage/landingpage";
import Register from "./pages/auth/register"; // Sesuaikan path
import Login from "./pages/auth/login"; // Sesuaikan path

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
