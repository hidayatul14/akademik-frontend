import axios from "axios";

const api = axios.create({
  baseURL: "https://akademik-api-production.up.railway.app/api",
});

export default api;
