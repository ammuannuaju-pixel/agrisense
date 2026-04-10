import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://agrisense.pages.dev", // ✅ fixed
      },
    });
    if (error) {
      setError(error.message);
    } else {
      await supabase.from("farmers").insert([{ id: data.user.id, name }]);
      setMessage("Account created! Please check your email to verify.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f8f9f4", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px", padding: "40px",
        border: "1px solid #e8e8e8", width: "100%", maxWidth: "400px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>🌿</div>
          <h1 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", margin: 0, fontSize: "28px" }}>
            AgriSense
          </h1>
          <p style={{ color: "#888", fontSize: "14px", margin: "4px 0 0" }}>
            Smart farming for Kerala
          </p>
        </div>

        <div style={{
          display: "flex", background: "#f8f9f4", borderRadius: "10px",
          padding: "4px", marginBottom: "24px",
        }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); setMessage(""); }} style={{
              flex: 1, padding: "10px", border: "none", borderRadius: "8px",
              background: mode === m ? "#fff" : "transparent",
              color: mode === m ? "#2d6a2d" : "#888",
              fontWeight: mode === m ? "600" : "400",
              cursor: "pointer", fontSize: "14px",
              boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}>
              {m === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "6px" }}>
                Full Name
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                style={{
                  width: "100%", padding: "12px", borderRadius: "8px",
                  border: "1px solid #e8e8e8", fontSize: "14px",
                  boxSizing: "border-box", outline: "none",
                }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "6px" }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: "100%", padding: "12px", borderRadius: "8px",
                border: "1px solid #e8e8e8", fontSize: "14px",
                boxSizing: "border-box", outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "6px" }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "12px", borderRadius: "8px",
                border: "1px solid #e8e8e8", fontSize: "14px",
                boxSizing: "border-box", outline: "none",
              }}
            />
          </div>

          {error && <p style={{ color: "#e74c3c", fontSize: "13px", margin: 0 }}>⚠️ {error}</p>}
          {message && <p style={{ color: "#2d6a2d", fontSize: "13px", margin: 0 }}>✅ {message}</p>}

          <button
            onClick={mode === "login" ? handleLogin : handleSignup}
            disabled={loading}
            style={{
              padding: "14px", borderRadius: "10px", border: "none",
              background: "#2d6a2d", color: "#fff", fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer", fontSize: "15px",
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}