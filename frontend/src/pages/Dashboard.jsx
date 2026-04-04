import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#F5A623" }}>💵 TipFlow</h1>
        <button onClick={handleLogout} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Logout
        </button>
      </div>
      <p>Bienvenido, <strong>{user?.name}</strong></p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "32px" }}>
        <div style={{ background: "#13131A", border: "1px solid #1E1E2E", borderRadius: "10px", padding: "24px" }}>
          <p style={{ color: "#888" }}>Tips hoy</p>
          <h2 style={{ color: "#2ECC71" }}>$500.00</h2>
        </div>
        <div style={{ background: "#13131A", border: "1px solid #1E1E2E", borderRadius: "10px", padding: "24px" }}>
          <p style={{ color: "#888" }}>Shifts activos</p>
          <h2 style={{ color: "#3B82F6" }}>1</h2>
        </div>
        <div style={{ background: "#13131A", border: "1px solid #1E1E2E", borderRadius: "10px", padding: "24px" }}>
          <p style={{ color: "#888" }}>Empleados</p>
          <h2 style={{ color: "#F5A623" }}>1</h2>
        </div>
      </div>
    </div>
  );
}
