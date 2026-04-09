import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [shifts, setShifts] = useState([]);
  const [totalHoy, setTotalHoy] = useState(0);
  const [aiInsight, setAiInsight] = useState(null);

  useEffect(() => {
    API.get("/shifts/").then((res) => {
      const data = res.data.shifts;
      setShifts(data);
      const hoy = new Date().toISOString().split("T")[0];
      const hoyTotal = data
        .filter((s) => s.shift_date === hoy)
        .reduce((acc, s) => acc + s.total_tips, 0);
      setTotalHoy(hoyTotal);
    });

    API.get("/ai/insights").then((res) => {
      setAiInsight(res.data);
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
        <button onClick={handleLogout} style={{ fontSize: "13px" }}>Salir</button>
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

      {/* AI Insight */}
      {aiInsight && (
        <div style={{
          background: "var(--color-background-secondary)",
          border: "1px solid #EF9F27",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "24px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: "16px" }}>✦</span>
            <span style={{ fontSize: "13px", fontWeight: "500", color: "#EF9F27" }}>Tu análisis IA</span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--color-text-primary)", lineHeight: "1.7", margin: 0 }}>
            {aiInsight.insight}
          </p>
          {aiInsight.stats && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              <div style={{ background: "var(--color-background-tertiary)", borderRadius: 6, padding: "8px 10px" }}>
                <p style={{ fontSize: "10px", color: "var(--color-text-secondary)", margin: "0 0 2px" }}>Promedio/hora</p>
                <p style={{ fontSize: "15px", fontWeight: "500", color: "#EF9F27", margin: 0 }}>
                  ${aiInsight.stats.promedio_por_hora}
                </p>
              </div>
              <div style={{ background: "var(--color-background-tertiary)", borderRadius: 6, padding: "8px 10px" }}>
                <p style={{ fontSize: "10px", color: "var(--color-text-secondary)", margin: "0 0 2px" }}>Total ganado</p>
                <p style={{ fontSize: "15px", fontWeight: "500", color: "#639922", margin: 0 }}>
                  ${aiInsight.stats.total_ganado}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

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
            <div key={shift.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px", background: "var(--color-background-secondary)",
              borderRadius: "8px", marginBottom: "8px"
            }}>
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