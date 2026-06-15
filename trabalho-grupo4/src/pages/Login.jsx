import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Secao from "../components/Secao";
import "../styles/login.css";

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

            navigate("/home");
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
                <div className="login-card">
                    <div className="login-header">
                        <h2 className="login-title">Bem-vindo</h2>
                        <p className="login-subtitle">Entre com suas credenciais</p>
                    </div>

                    <div className="login-fields">
                        <div className="field-group">
                            <input
                                autoComplete="email"
                                name="email"
                                onChange={atualizarCampo}
                                placeholder=" "
                                required
                                type="email"
                                value={formLogin.email}
                                className="field-input"
                            />
                            <label className="field-label">Email</label>
                        </div>

                        <div className="field-group">
                            <input
                                autoComplete="current-password"
                                name="senha"
                                onChange={atualizarCampo}
                                placeholder=" "
                                required
                                type="password"
                                value={formLogin.senha}
                                className="field-input"
                            />
                            <label className="field-label">Senha</label>
                        </div>
                    </div>

                    {mensagem && <p className="login-mensagem erro">{mensagem}</p>}

                    <button className="btn-entrar" disabled={carregando} type="submit">
                        {carregando ? "Entrando..." : "Entrar"}
                    </button>

                    <button
                        className="btn-cadastro"
                        disabled={carregando}
                        type="button"
                        onClick={() => navigate("/cadastro")}
                    >
                        Criar novo usuário
                    </button>
                </div>
            </form>
        </Secao>
    );
}

export default Login;
