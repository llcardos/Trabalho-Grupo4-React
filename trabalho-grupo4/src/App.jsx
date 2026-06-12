import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from "react";
import './App.css'
import Header from './components/Header'
import Card from './components/Card.jsx'
import api from './services/api';


// const aliens = [
//   { id: 1, nome: "Zorg", Planeta: "Xenon", Especie: "Reptiliana", Especiedescricao: "Seres inteligentes com aparência de répteis, conhecidos por sua astúcia e habilidades tecnológicas avançadas.", data: "2024-05-01", criadoEm: "2024-06-01" },
//   { id: 2, nome: "Blip", Planeta: "Zog", Especie: "Gelatinoso", Especiedescricao: "Seres amorfos feitos de uma substância gelatinosa, capazes de mudar de forma e cor para se camuflar em seu ambiente.", data: "2024-05-15", criadoEm: "2024-06-02" }
// ]

const avistamentos = [
  { id: 1, titulo: "Luz Estranha no Céu", local: "Campo Aberto", data: "2024-05-10", descricao: "Várias testemunhas relataram uma luz brilhante e pulsante no céu durante a noite, que se movia de maneira errática antes de desaparecer." },
  { id: 2, titulo: "Objeto Voador Não Identificado", local: "Cidade Grande", data: "2024-05-20", descricao: "Um objeto metálico em forma de disco foi visto pairando sobre a cidade por vários minutos, emitindo um zumbido baixo antes de subir rapidamente e desaparecer." }
]

const planetas = [
  { id: 1, nome: "Xenon", galaxia: "Andromeda", clima: "Árido", habitavel: false, descricao: "Planeta desértico com temperaturas extremas e pouca água, habitado por formas de vida adaptadas a condições severas.", criadoEm: "2024-06-03" },
]


function App() {
  const [aliensAPI, setAliens] = useState([]);
  const [loading, setLoading] = useState(false);
  const url = "/aliens";

  useEffect(() => {
    async function buscarAliensComAxios() {
      try {
        setLoading(true);
        const resposta = await api.get(url);
        setAliens(resposta.data);
      } catch (error) {
        console.error("Erro ao buscar aliens com axios:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarAliensComAxios();
  }, []);


  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<h1>Login</h1>} />



          <Route path="/avistamento" element={<Card
            items={avistamentos}
            className="cardAvistamento"
            renderItem={(item) => (
              <>
                <h3>{item.id}. {item.titulo}</h3>
                <h4>{item.local}</h4>
                <h5>Data: {item.data}</h5>
                <p>{item.descricao}</p>
                <h6>Avistado em: {new Date(item.criadoEm).toLocaleString('pt-BR')}</h6>
              </>
            )}
          />} />



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


          <Route path="*" element={<h1>Pagina nao encontrada</h1>} />
        </Routes>
      </main>
    </>
  )
}

export default App


