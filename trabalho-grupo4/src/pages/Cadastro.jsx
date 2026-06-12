import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Secao from "../components/Secao";
import api from "../services/api";

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
      <form className="login-form" onSubmit={enviarCadastro}>
        <label>
          Nome
          <input
            name="nome"
            onChange={atualizarCampo}
            placeholder="Digite seu nome"
            required
            type="text"
            value={formCadastro.nome}
            disabled={cadastroConcluido}
          />
        </label>

        <label>
          Email
          <input
            autoComplete="email"
            name="email"
            onChange={atualizarCampo}
            placeholder="usuario@email.com"
            required
            type="email"
            value={formCadastro.email}
            disabled={cadastroConcluido}
          />
        </label>

        <label>
          Senha
          <input
            autoComplete="new-password"
            name="senha"
            onChange={atualizarCampo}
            placeholder="Crie uma senha"
            required
            type="password"
            value={formCadastro.senha}
            disabled={cadastroConcluido}
          />
        </label>

        {mensagem && <p className="mensagem">{mensagem}</p>}

        {!cadastroConcluido && (
          <button disabled={carregando} type="submit">
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        )}

        {cadastroConcluido && (
          <button type="button" onClick={() => navigate("/login")}>
            Ir para Login
          </button>
        )}

        {!cadastroConcluido && (
          <button
            disabled={carregando}
            type="button"
            onClick={() => navigate("/login")}
          >
            Voltar para Login
          </button>
        )}
      </form>
    </Secao>
  );
}

export default Cadastro;