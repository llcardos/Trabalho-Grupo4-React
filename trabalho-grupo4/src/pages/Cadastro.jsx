import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Secao from "../components/Secao";
import api from "../services/api";
import "../styles/login.css";
import loginVideo from '../videos/login.mp4';

function Cadastro() {
  const navigate = useNavigate();

  const [formCadastro, setFormCadastro] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [cadastroConcluido, setCadastroConcluido] = useState(false);

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setFormCadastro((formAtual) => ({
      ...formAtual,
      [name]: value,
    }));
  }

  async function enviarCadastro(event) {
    event.preventDefault();
    setMensagem("");
    setCadastroConcluido(false);

    try {
      setCarregando(true);

      const resposta = await api.post("/usuarios", formCadastro);

      console.log("Cadastro realizado:", resposta.data);

      setFormCadastro({
        nome: "",
        email: "",
        senha: "",
      });

      setMensagem("Cadastro realizado com sucesso!");
      setCadastroConcluido(true);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      console.error("Resposta da API:", error.response?.data);

      setMensagem("Erro ao realizar cadastro.");
      setCadastroConcluido(false);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Secao titulo="Cadastro">
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
                    <source src={loginVideo} type="video/mp4" />
                </video>
      <form className="login-form" onSubmit={enviarCadastro}>
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">Criar conta</h2>
            <p className="login-subtitle">Preencha os campos para se cadastrar</p>
          </div>

          <div className="login-fields">
            <div className="field-group">
              <input
                name="nome"
                onChange={atualizarCampo}
                placeholder=" "
                required
                type="text"
                value={formCadastro.nome}
                className="field-input"
                disabled={cadastroConcluido}
              />
              <label className="field-label">Nome</label>
            </div>

            <div className="field-group">
              <input
                autoComplete="email"
                name="email"
                onChange={atualizarCampo}
                placeholder=" "
                required
                type="email"
                value={formCadastro.email}
                className="field-input"
                disabled={cadastroConcluido}
              />
              <label className="field-label">Email</label>
            </div>

            <div className="field-group">
              <input
                autoComplete="new-password"
                name="senha"
                onChange={atualizarCampo}
                placeholder=" "
                required
                type="password"
                value={formCadastro.senha}
                className="field-input"
                disabled={cadastroConcluido}
              />
              <label className="field-label">Senha</label>
            </div>
          </div>

          {mensagem && <p className={`login-mensagem ${cadastroConcluido ? "sucesso" : "erro"}`}>{mensagem}</p>}

          {!cadastroConcluido && (
            <button className="btn-entrar" disabled={carregando} type="submit">
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </button>
          )}

          {cadastroConcluido && (
            <button className="btn-entrar" type="button" onClick={() => navigate("/login")}>
              Ir para Login
            </button>
          )}

          {!cadastroConcluido && (
            <button
              className="btn-cadastro"
              disabled={carregando}
              type="button"
              onClick={() => navigate("/login")}
            >
              Voltar para Login
            </button>
          )}
        </div>
      </form>
    </Secao>
  );
}

export default Cadastro;
