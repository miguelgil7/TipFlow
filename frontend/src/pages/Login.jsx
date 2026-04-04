import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.user, res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>💵 TipFlow</h1>
        <p style={styles.subtitle}>Gestión de propinas para restaurantes</p>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.button} type="submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0A0A0F",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#13131A",
    border: "1px solid #1E1E2E",
    borderRadius: 12,
    padding: 40,
    width: 360,
    textAlign: "center",
  },
  title: {
    color: "#F5A623",
    fontSize: 32,
    margin: 0,
  },
  subtitle: {
    color: "#888899",
    fontSize: 14,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    marginBottom: 12,
    background: "#0A0A0F",
    border: "1px solid #1E1E2E",
    borderRadius: 6,
    color: "#E8E8F0",
    fontSize: 14,
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#F5A623",
    color: "#000",
    border: "none",
    borderRadius: 6,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 8,
  },
  error: {
    color: "#E74C3C",
    fontSize: 13,
    marginBottom: 8,
  },
};
