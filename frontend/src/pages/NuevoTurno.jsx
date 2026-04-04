import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function NuevoTurno() {
  const navigate = useNavigate();
  const [horas, setHoras] = useState("");
  const [propinas, setPropinas] = useState("");
  const [multiplicador, setMultiplicador] = useState("1.0");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const shiftRes = await API.post("/shifts/", {
        total_tips: parseFloat(propinas),
        restaurant_id: 1,
        shift_date: fecha,
      });

      const shiftId = shiftRes.data.shift.id;
      const userId = JSON.parse(localStorage.getItem("user")).id;

      await API.post(`/shifts/${shiftId}/employees`, {
        user_id: userId,
        hours_worked: parseFloat(horas),
        role_multiplier: parseFloat(multiplicador),
      });

      await API.post(`/shifts/${shiftId}/calculate`);
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
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "28px" }}>💵</div>
          <h1 style={{ fontSize: "22px", fontWeight: "500", marginBottom: "4px" }}>Registrar turno</h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>¿Cuánto ganaste?</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Fecha */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
              Fecha del turno
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>

          {/* Horas */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
              Horas trabajadas
            </label>
            <input
              type="number"
              step="0.01"
              min="0.5"
              max="24"
              placeholder="ej: 7.65"
              value={horas}
              onChange={(e) => setHoras(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>

          {/* Propinas */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
              Total de propinas ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="ej: 180.50"
              value={propinas}
              onChange={(e) => setPropinas(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>

          {/* Rol */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "13px", color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
              Tu rol
            </label>
            <select
              value={multiplicador}
              onChange={(e) => setMultiplicador(e.target.value)}
              style={{ width: "100%" }}
            >
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

          <button type="submit" disabled={loading} style={{ width: "100%", background: "#EF9F27", color: "#000", border: "none", fontWeight: "500" }}>
            {loading ? "Guardando..." : "Guardar turno"}
          </button>

          <button type="button" onClick={() => navigate("/dashboard")} style={{ width: "100%", marginTop: "8px" }}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}