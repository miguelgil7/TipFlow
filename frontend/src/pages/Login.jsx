import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState("welcome");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.user, res.data.access_token);
      navigate("/dashboard");
    } catch {
      setError("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/register", { name, email, password });
      const res = await API.post("/auth/login", { email, password });
      login(res.data.user, res.data.access_token);
      navigate("/dashboard");
    } catch {
      setError("Error al crear la cuenta. Intenta con otro email.");
    } finally {
      setLoading(false);
    }
  };

  if (mode === "welcome") return (
    <div style={{ minHeight:"100vh", background:"#F8F5F0", display:"flex", flexDirection:"column", fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ background:"#1A1714", flex:1, display:"flex", flexDirection:"column", padding:"48px 28px 40px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"radial-gradient(circle, rgba(228,160,85,0.12), transparent 70%)" }} />
        <div style={{ position:"absolute", bottom:-40, left:-40, width:160, height:160, borderRadius:"50%", background:"radial-gradient(circle, rgba(228,160,85,0.06), transparent 70%)" }} />
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:64 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia, serif", fontSize:16, color:"#E8A055" }}>T</div>
          <span style={{ fontFamily:"Georgia, serif", fontSize:15, color:"#F5F0E8", fontWeight:700 }}>TipFlow</span>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <div style={{ fontSize:11, color:"#C17F3E", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:16 }}>Tu dinero. Tu control.</div>
          <h1 style={{ fontFamily:"Georgia, serif", fontSize:34, fontWeight:700, color:"#F5F0E8", lineHeight:1.15, marginBottom:20 }}>
            Conoce exactamente cuánto ganas cada turno
          </h1>
          <p style={{ fontSize:15, color:"rgba(245,240,232,0.5)", lineHeight:1.7 }}>
            La única app con IA que analiza tus propinas, proyecta tus ganancias y te dice cuándo y cómo ganar más.
          </p>
        </div>
        <div style={{ display:"flex", gap:24, marginTop:40, paddingTop:24, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          {[{val:"$4,800",label:"Proyección mensual"},{val:"34.5h",label:"Horas rastreadas"},{val:"✦ IA",label:"Análisis inteligente"}].map((s,i) => (
            <div key={i}>
              <div style={{ fontFamily:"Georgia, serif", fontSize:17, color:"#E8A055", fontWeight:700 }}>{s.val}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:"#F8F5F0", padding:"32px 24px 40px" }}>
        <button onClick={() => setMode("register")} style={{ width:"100%", padding:16, borderRadius:12, background:"#1A1714", border:"none", color:"#F5F0E8", fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:600, fontSize:15, cursor:"pointer", marginBottom:12 }}>
          Crear cuenta gratis →
        </button>
        <button onClick={() => setMode("login")} style={{ width:"100%", padding:15, borderRadius:12, background:"transparent", border:"1.5px solid #D4CDB8", color:"#8A8278", fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:500, fontSize:14, cursor:"pointer" }}>
          Ya tengo una cuenta
        </button>
        <p style={{ textAlign:"center", fontSize:11, color:"#C4BDB0", marginTop:20, lineHeight:1.6 }}>Gratis para siempre. Sin tarjeta requerida.</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#F8F5F0", display:"flex", flexDirection:"column", fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={() => { setMode("welcome"); setError(""); }} style={{ background:"none", border:"none", color:"#8A8278", fontSize:13, cursor:"pointer", padding:0 }}>← Volver</button>
        <div style={{ width:40, height:40, borderRadius:12, background:"#1A1714", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia, serif", fontSize:18, color:"#E8A055" }}>T</div>
      </div>
      <div style={{ flex:1, padding:"24px 24px 40px" }}>
        <h2 style={{ fontFamily:"Georgia, serif", fontSize:26, color:"#1A1714", marginBottom:6 }}>
          {mode === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
        </h2>
        <p style={{ fontSize:13, color:"#8A8278", marginBottom:32 }}>
          {mode === "login" ? "Ingresa para ver tus propinas y estadísticas" : "Empieza a trackear tus propinas hoy"}
        </p>
        <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
          {mode === "register" && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:"#8A8278", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Tu nombre</div>
              <input type="text" placeholder="Miguel Gil" value={name} onChange={e => setName(e.target.value)} required
                style={{ width:"100%", padding:"13px 14px", borderRadius:10, border:"1.5px solid #E8E2D8", background:"white", fontSize:14, color:"#1A1714", outline:"none", fontFamily:"'Plus Jakarta Sans', sans-serif", boxSizing:"border-box" }} />
            </div>
          )}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, color:"#8A8278", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Email</div>
            <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width:"100%", padding:"13px 14px", borderRadius:10, border:"1.5px solid #E8E2D8", background:"white", fontSize:14, color:"#1A1714", outline:"none", fontFamily:"'Plus Jakarta Sans', sans-serif", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:11, color:"#8A8278", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Contraseña</div>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width:"100%", padding:"13px 14px", borderRadius:10, border:"1.5px solid #E8E2D8", background:"white", fontSize:14, color:"#1A1714", outline:"none", fontFamily:"'Plus Jakarta Sans', sans-serif", boxSizing:"border-box" }} />
          </div>
          {error && (
            <div style={{ background:"rgba(220,53,69,0.06)", border:"1px solid rgba(220,53,69,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#DC3545", marginBottom:16, textAlign:"center" }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{ width:"100%", padding:15, borderRadius:12, background:"#1A1714", border:"none", color:"#F5F0E8", fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:600, fontSize:15, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1, marginBottom:16 }}>
            {loading ? "Un momento..." : mode === "login" ? "Entrar →" : "Crear cuenta →"}
          </button>
        </form>
        <div style={{ textAlign:"center" }}>
          <span style={{ fontSize:13, color:"#8A8278" }}>{mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}</span>
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            style={{ background:"none", border:"none", color:"#C17F3E", fontSize:13, fontWeight:600, cursor:"pointer", padding:0, textDecoration:"underline" }}>
            {mode === "login" ? "Crear una gratis" : "Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
