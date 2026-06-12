import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Secao from "../components/Secao";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formLogin, setFormLogin] = useState({
        email: "",
        senha: "",
    });

    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    function atualizarCampo(event) {
        const { name, value } = event.target;

        setFormLogin((formAtual) => ({
            ...formAtual,
            [name]: value,
        }));
    }

    async function enviarLogin(event) {
        event.preventDefault();
        setMensagem("");

        try {
            setCarregando(true);

            const dados = await login(formLogin);

            console.log("Login realizado:", dados);

            setMensagem("Login realizado com sucesso!");

            navigate("/avistamento");
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            console.error("Resposta da API:", error.response?.data);

            setMensagem("Email ou senha inválidos.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <Secao titulo="Login">
            <form className="login-form" onSubmit={enviarLogin}>
                <label>
                    Email
                    <input
                        autoComplete="email"
                        name="email"
                        onChange={atualizarCampo}
                        placeholder="usuario@email.com"
                        required
                        type="email"
                        value={formLogin.email}
                    />
                </label>

                <label>
                    Senha
                    <input
                        autoComplete="current-password"
                        name="senha"
                        onChange={atualizarCampo}
                        placeholder="Digite sua senha"
                        required
                        type="password"
                        value={formLogin.senha}
                    />
                </label>

                {mensagem && <p className="mensagem">{mensagem}</p>}

                <button disabled={carregando} type="submit">
                    {carregando ? "Entrando..." : "Entrar"}
                </button>

                <button
                    className="botao-secundario"
                    disabled={carregando}
                    type="button"
                    onClick={() => navigate("/cadastro")}
                >
                    Criar novo usuário
                </button>
            </form>
        </Secao>
    );
}

export default Login;