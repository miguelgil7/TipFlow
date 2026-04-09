import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const PERIODS = [
  { key: "week", label: "Esta semana" },
  { key: "month", label: "Este mes" },
  { key: "year", label: "Este año" },
];

export default function Stats() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("week");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`/stats/?period=${period}`).then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, [period]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 20px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "500", color: "#EF9F27", margin: 0 }}>📊 Estadísticas</h1>
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: "2px 0 0" }}>
            Tu rendimiento
          </p>
        </div>
        <button onClick={() => navigate("/dashboard")} style={{ fontSize: "13px" }}>
          ← Volver
        </button>
      </div>

      {/* Selector de período */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            style={{
              flex: 1,
              padding: "8px",
              fontSize: "13px",
              fontWeight: period === p.key ? "500" : "400",
              background: period === p.key ? "#EF9F27" : "var(--color-background-secondary)",
              color: period === p.key ? "#000" : "var(--color-text-secondary)",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: "40px" }}>
          Cargando...
        </p>
      ) : stats ? (
        <>
          {/* Cards principales */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div style={{ background: "var(--color-background-secondary)", borderRadius: "10px", padding: "16px" }}>
              <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Total propinas</p>
              <h2 style={{ fontSize: "24px", fontWeight: "500", color: "#639922", margin: 0 }}>
                ${stats.total_tips.toFixed(2)}
              </h2>
            </div>
            <div style={{ background: "var(--color-background-secondary)", borderRadius: "10px", padding: "16px" }}>
              <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Horas trabajadas</p>
              <h2 style={{ fontSize: "24px", fontWeight: "500", color: "#378ADD", margin: 0 }}>
                {stats.total_hours.toFixed(1)} hrs
              </h2>
            </div>
            <div style={{ background: "var(--color-background-secondary)", borderRadius: "10px", padding: "16px" }}>
              <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Promedio/hora</p>
              <h2 style={{ fontSize: "24px", fontWeight: "500", color: "#EF9F27", margin: 0 }}>
                ${stats.avg_per_hour.toFixed(2)}
              </h2>
            </div>
            <div style={{ background: "var(--color-background-secondary)", borderRadius: "10px", padding: "16px" }}>
              <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Salario ganado</p>
              <h2 style={{ fontSize: "24px", fontWeight: "500", color: "#A855F7", margin: 0 }}>
                ${stats.total_wage.toFixed(2)}
              </h2>
            </div>
          </div>

          {/* Total combinado */}
          <div style={{ background: "var(--color-background-secondary)", border: "1px solid #EF9F27", borderRadius: "10px", padding: "16px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "0 0 4px" }}>
                Total ganado (propinas + salario)
              </p>
              <h2 style={{ fontSize: "28px", fontWeight: "500", color: "#EF9F27", margin: 0 }}>
                ${(stats.total_tips + stats.total_wage).toFixed(2)}
              </h2>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Turnos</p>
              <h2 style={{ fontSize: "24px", fontWeight: "500", color: "#378ADD", margin: 0 }}>
                {stats.shifts_count}
              </h2>
            </div>
          </div>

          {/* Desglose por día */}
          <p style={{ fontSize: "13px", fontWeight: "500", marginBottom: "10px" }}>
            Desglose por día
          </p>
          {Object.keys(stats.days).length === 0 ? (
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", textAlign: "center", padding: "20px" }}>
              No hay turnos en este período
            </p>
          ) : (
            Object.entries(stats.days)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .map(([date, day]) => (
                <div key={date} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px", background: "var(--color-background-secondary)",
                  borderRadius: "8px", marginBottom: "8px"
                }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "500", margin: 0 }}>{date}</p>
                    <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "2px 0 0" }}>
                      {day.hours.toFixed(1)} hrs · ${day.wage.toFixed(2)} salario
                    </p>
                  </div>
                  <p style={{ fontSize: "16px", fontWeight: "500", color: "#639922", margin: 0 }}>
                    ${day.tips.toFixed(2)}
                  </p>
                </div>
              ))
          )}
        </>
      ) : null}
    </div>
  );
}
