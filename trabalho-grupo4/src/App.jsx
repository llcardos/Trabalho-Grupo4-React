import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import './App.css'
import Header from './components/Header'
import Card from './components/Card.jsx'
import api from './services/api';
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from './pages/Home.jsx';
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { estaAutenticado } = useAuth();
  const [aliensAPI, setAliens] = useState([]);
  const [avistamentosAPI, setAvistamentos] = useState([]);
  const [planetas, setPlanetas] = useState([]);
  const urlAliens = "/aliens";
  const urlAvistamentos = "/avistamentos";
  const urlPlanetas = "/planetas";

  useEffect(() => {
    async function buscarDados() {
      try {
        const respostaAliens = await api.get(urlAliens);
        setAliens(respostaAliens.data);
      } catch (error) {
        console.error("Erro ao buscar aliens com axios:", error);
      }

      try {
        const respostaAvistamentos = await api.get(urlAvistamentos);
        setAvistamentos(respostaAvistamentos.data);
      } catch (error) {
        console.error("Erro ao buscar avistamentos com axios:", error);
      }

      try {
        const respostaPlanetas = await api.get(urlPlanetas);
        setPlanetas(respostaPlanetas.data);
      } catch (error) {
        console.error("Erro ao buscar planetas com axios:", error);
      }
    }

    buscarDados();
  }, []);

  return (
    <>
      <Header />

  <main>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/home" replace />}
        />
        <Route
          path="/login"
          element={estaAutenticado ? <Navigate to="/home" replace /> : <Login />}
        />
        <Route
          path="/cadastro"
          element={estaAutenticado ? <Navigate to="/home" replace /> : <Cadastro />}
        />
        <Route path="/home" element={<Home />} />

        <Route path="/avistamento" element={<Card
            items={avistamentosAPI}
            className="cardAvistamento"
            renderItem={(item) => (
              <>
                <h3>{item.id}. {item.titulo}</h3>
                <h4>{item.local}</h4>
                <h5>Data: {item.data}</h5>
                <p>{item.descricao}</p>
                <h6>Avistado em: {new Date(item.criadoEm).toLocaleString('pt-BR')}</h6>
              </>
            )} />} />

        <Route path="/aliens" element={<Card
          items={aliensAPI}
          className="cardAlien"
          renderItem={(item) => (
            <>
              <h3>{item.id}. {item.nome}</h3>
              <h2>Perigo: {item.periculosidade}</h2>
              <h4>{item.planeta}</h4>
              <h5>Especie: {item.especie}</h5>
              <p>{item.descricao}</p>
              <h6>Criado em: {new Date(item.criadoEm).toLocaleString('pt-BR')}</h6>
            </>
          )} />} />



        <Route path="/planetas" element={<Card
          className="cardPlaneta"
          items={planetas}
          renderItem={(item) => (
            <>
              <h3>{item.id}. {item.nome}</h3>
              <h4>Galaxia: {item.galaxia}</h4>
              <h4>Clima: {item.clima}</h4>
              <h6>{item.habitavel ? "Habitavel" : "Nao-habitavel"}</h6>
              <p>{item.descricao}</p>
              <h6>Criado em: {new Date(item.criadoEm).toLocaleString('pt-BR')}</h6>
            </>
          )} />} />

        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
    </main >
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App