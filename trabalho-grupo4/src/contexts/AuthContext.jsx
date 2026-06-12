import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const usuarioSalvo = localStorage.getItem("usuario");

        if (usuarioSalvo) {
            return JSON.parse(usuarioSalvo);
        }

        return null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("tokenAcesso");
    });

    const estaAutenticado = Boolean(token);

    async function login(dadosLogin) {
        const resposta = await api.post("/login", dadosLogin);

        const dados = resposta.data;

        const tokenRecebido = dados.tokenAcesso;

        setToken(tokenRecebido);
        setUsuario({
            email: dadosLogin.email,
        });

        localStorage.setItem("tokenAcesso", tokenRecebido);
        localStorage.setItem(
            "usuario",
            JSON.stringify({
                email: dadosLogin.email,
            })
        );

        return dados;
    }

    function logout() {
        setUsuario(null);
        setToken(null);

        localStorage.removeItem("tokenAcesso");
        localStorage.removeItem("usuario");
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                token,
                estaAutenticado,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider, useAuth };