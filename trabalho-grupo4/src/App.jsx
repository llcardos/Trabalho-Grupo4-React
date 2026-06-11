import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'

function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<h1>Login</h1>} />
          <Route path="/avistamento" element={<h1>Avistamento</h1>} />
          <Route path="/aliens" element={<h1>Aliens</h1>} />
          <Route path="/planetas" element={<h1>Planetas</h1>} />
          <Route path="*" element={<h1>Pagina nao encontrada</h1>} />
        </Routes>
      </main>
    </>
  )
}

export default App
