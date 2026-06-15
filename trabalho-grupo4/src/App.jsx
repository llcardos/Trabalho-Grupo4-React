import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import './App.css'
import Header from './components/Header'
import Card from './components/Card.jsx'
import api from './services/api';
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from './pages/Home.jsx';
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import espacoVideo from './videos/espaco.mp4';
import discoVideo from './videos/discovoador.mp4';
import alienVideo from './videos/alien.mp4';
import planetaVideo from './videos/planetas.mp4';

function AppContent() {
  const { estaAutenticado } = useAuth();
  const location = useLocation();
  const [aliensAPI, setAliens] = useState([]);
  const [avistamentosAPI, setAvistamentos] = useState([]);
  const [planetas, setPlanetas] = useState([]);
  const urlAliens = "/aliens";
  const urlAvistamentos = "/avistamentos";
  const urlPlanetas = "/planetas";
  const mainClassByRoute = {
    "/home": "main-home",
    "/avistamento": "main-avistamento",
    "/aliens": "main-aliens",
    "/planetas": "main-planetas",
    "/login": "main-login",
    "/cadastro": "main-cadastro",
  };
  const mainClass = mainClassByRoute[location.pathname] || "main-default";

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

      <main className={mainClass}>
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
          <Route
            path="/home"
            element={
              <>
                <video
                  key="home-video"
                  autoPlay
                  loop
                  muted
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'cover',
                    zIndex: -1,
                  }}
                >
                  <source src={espacoVideo} type="video/mp4" />
                </video>
                <Home />
              </>
            }
          />

          <Route path="/avistamento" element={
            <>
              <video
                key="avistamento-video"
                autoPlay
                loop
                muted
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  objectFit: 'cover',
                  zIndex: -1,
                  filter: 'blur(2px)'
                }}
              >
                <source src={discoVideo} type="video/mp4" />
              </video>
              <Card
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
                )} />
            </>
          } />

          <Route path="/aliens" element={
            <>
              <video
                key="aliens-video"
                autoPlay
                loop
                muted
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  objectFit: 'cover',
                  zIndex: -1,
                  filter: 'blur(2px)'
                }}
              >
                <source src={alienVideo} type="video/mp4" />
              </video>
              <Card
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
                )} />
            </>
          } />



          <Route path="/planetas" element={
            <>
              <video
                key="planetas-video"
                autoPlay
                loop
                muted
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  objectFit: 'cover',
                  zIndex: -1,
                  filter: 'blur(2px)'
                }}
              >
                <source src={planetaVideo} type="video/mp4" />
              </video>
              <Card
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
                )}
              />
            </>
          } />

          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </main>
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