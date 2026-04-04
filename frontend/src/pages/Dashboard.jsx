import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [shifts, setShifts] = useState([]);
  const [totalHoy, setTotalHoy] = useState(0);

  useEffect(() => {
    API.get("/shifts/").then((res) => {
      const data = res.data.shifts;
      setShifts(data);
      // sumar tips del día de hoy
      const hoy = new Date().toISOString().split("T")[0];
      const hoyTotal = data
        .filter((s) => s.shift_date === hoy)
        .reduce((acc, s) => acc + s.total_tips, 0);
      setTotalHoy(hoyTotal);
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 20px" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "500", color: "#EF9F27", margin: 0 }}>💵 TipFlow</h1>
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: "2px 0 0" }}>
            Hola, {user?.name}
          </p>
        </div>
        <button onClick={handleLogout} style={{ fontSize: "13px" }}>
          Salir
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "24px" }}>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "10px", padding: "16px" }}>
          <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Tips hoy</p>
          <h2 style={{ fontSize: "20px", fontWeight: "500", color: "#639922", margin: 0 }}>
            ${totalHoy.toFixed(2)}
          </h2>
        </div>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "10px", padding: "16px" }}>
          <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Turnos</p>
          <h2 style={{ fontSize: "20px", fontWeight: "500", color: "#378ADD", margin: 0 }}>
            {shifts.length}
          </h2>
        </div>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "10px", padding: "16px" }}>
          <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Total ganado</p>
          <h2 style={{ fontSize: "20px", fontWeight: "500", color: "#EF9F27", margin: 0 }}>
            ${shifts.reduce((acc, s) => acc + s.total_tips, 0).toFixed(2)}
          </h2>
        </div>
      </div>

      {/* Botón nuevo turno */}
      <button
        onClick={() => navigate("/nuevo-turno")}
        style={{ width: "100%", background: "#EF9F27", color: "#000", border: "none", fontWeight: "500", marginBottom: "24px" }}
      >
        + Registrar turno de hoy
      </button>

      {/* Lista de turnos */}
      <div>
        <p style={{ fontSize: "13px", fontWeight: "500", marginBottom: "10px" }}>Mis turnos recientes</p>
        {shifts.length === 0 ? (
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", textAlign: "center", padding: "20px" }}>
            Aún no tienes turnos registrados
          </p>
        ) : (
          shifts.slice().reverse().map((shift) => (
            <div
              key={shift.id}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px", background: "var(--color-background-secondary)",
                borderRadius: "8px", marginBottom: "8px"
              }}
            >
              <div>
                <p style={{ fontSize: "13px", fontWeight: "500", margin: 0 }}>{shift.shift_date}</p>
                <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "2px 0 0" }}>
                  {shift.status}
                </p>
              </div>
              <p style={{ fontSize: "16px", fontWeight: "500", color: "#639922", margin: 0 }}>
                ${shift.total_tips.toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}