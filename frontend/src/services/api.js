import axios from "axios";

// URL base del backend
const API = axios.create({
  baseURL: "https://effective-pancake-jjvxrjv99q7v3qw6p-5000.app.github.dev/api",
});

// Agregar el token JWT automáticamente a cada request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
