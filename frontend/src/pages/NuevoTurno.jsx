import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function NuevoTurno() {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [breakMinutes, setBreakMinutes] = useState("0");
  const [propinas, setPropinas] = useState("");
  const [multiplicador, setMultiplicador] = useState("1.0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const calcularPreview = (start, end, brk, date) => {
    if (!start || !end || !date) return;
    const startDt = new Date(`${date}T${start}`);
    let endDt = new Date(`${date}T${end}`);
    if (endDt <= startDt) endDt.setDate(endDt.getDate() + 1);
    const diff = (endDt - startDt) / 3600000 - parseInt(brk || 0) / 60;
    setPreview(Math.max(0, diff).toFixed(2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/shifts/", {
        total_tips: parseFloat(propinas),
        restaurant_id: 1,
        shift_date: fecha,
        start_time: startTime,
        end_time: endTime,
        break_minutes: parseInt(breakMinutes),
        role_multiplier: parseFloat(multiplicador),
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Hubo un error al guardar el turno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "28px" }}>💵</div>
          <h1 style={{ fontSize: "22px", fontWeight: "500", marginBottom: "4px" }}>Registrar turno</h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>¿Cuánto ganaste?</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Fecha */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "13px", color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
              Fecha del turno
            </label>
            <input type="date" value={fecha}
              onChange={(e) => { setFecha(e.target.value); calcularPreview(startTime, endTime, breakMinutes, e.target.value); }}
              required style={{ width: "100%" }} />
          </div>

          {/* Hora inicio y fin */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
            <div>
              <label style={{ fontSize: "13px", color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
                Hora entrada
              </label>
              <input type="time" value={startTime}
                onChange={(e) => { setStartTime(e.target.value); calcularPreview(e.target.value, endTime, breakMinutes, fecha); }}
                required style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ fontSize: "13px", color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
                Hora salida
              </label>
              <input type="time" value={endTime}
                onChange={(e) => { setEndTime(e.target.value); calcularPreview(startTime, e.target.value, breakMinutes, fecha); }}
                required style={{ width: "100%" }} />
            </div>
          </div>

          {/* Break */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "13px", color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
              Break (minutos) — 0 si no aplica
            </label>
            <input type="number" min="0" max="120" step="5" value={breakMinutes}
              onChange={(e) => { setBreakMinutes(e.target.value); calcularPreview(startTime, endTime, e.target.value, fecha); }}
              style={{ width: "100%" }} />
          </div>

          {/* Preview horas */}
          {preview && (
            <div style={{ background: "var(--color-background-secondary)", border: "1px solid #EF9F27", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>Horas calculadas</span>
              <span style={{ fontSize: "18px", fontWeight: "500", color: "#EF9F27" }}>{preview} hrs</span>
            </div>
          )}

          {/* Propinas */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "13px", color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
              Total de propinas ($)
            </label>
            <input type="number" step="0.01" min="0" placeholder="ej: 180.50"
              value={propinas} onChange={(e) => setPropinas(e.target.value)}
              required style={{ width: "100%" }} />
          </div>

          {/* Rol */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "13px", color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
              Tu rol
            </label>
            <select value={multiplicador} onChange={(e) => setMultiplicador(e.target.value)} style={{ width: "100%" }}>
              <option value="1.0">Mesero</option>
              <option value="1.25">Mesero senior</option>
              <option value="1.5">Bartender</option>
              <option value="0.75">Busboy / Apoyo</option>
            </select>
          </div>

          {error && (
            <p style={{ color: "var(--color-text-danger)", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            style={{ width: "100%", background: "#EF9F27", color: "#000", border: "none", fontWeight: "500" }}>
            {loading ? "Guardando..." : "Guardar turno"}
          </button>

          <button type="button" onClick={() => navigate("/dashboard")}
            style={{ width: "100%", marginTop: "8px" }}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
