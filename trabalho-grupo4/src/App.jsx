import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/avistamento" element={<h1>Avistamento</h1>} />
          <Route path="/aliens" element={<h1>Aliens</h1>} />
          <Route path="/planetas" element={<h1>Planetas</h1>} />
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;