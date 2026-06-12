import axios from "axios";

const api = axios.create({
    baseURL: "https://api.serratec.mwmsoftware.com",
});

export default api;