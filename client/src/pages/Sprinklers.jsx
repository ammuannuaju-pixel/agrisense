import { useEffect, useState } from "react";
import axios from "axios";

export default function Sprinklers() {
  const [sprinklers, setSprinklers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSprinklers = () => {
    axios.get("http://localhost:5000/api/sprinklers")
      .then(res => { setSprinklers(res.data); setLoading(false); });
  };

  useEffect(() => {
    fetchSprinklers();
    const interval = setInterval(fetchSprinklers, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggle = async (id, active) => {
    await axios.post(`http://localhost:5000/api/sprinklers/toggle/${id}`, { active });
    fetchSprinklers();
  };

  const toggleAuto = async (id, auto) => {
    await axios.post(`http://localhost:5000/api/sprinklers/auto/${id}`, { auto });
    fetchSprinklers();
  };

  const setThreshold = async (id, threshold) => {
    await axios.post(`http://localhost:5000/api/sprinklers/threshold/${id}`, { threshold: parseInt(threshold) });
    fetchSprinklers();
  };

  if (loading) return <p>Loading sprinkler controls...</p>;

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "8px" }}>
        Sprinkler Control
      </h1>
      <p style={{ color: "#888", marginBottom: "32px" }}>
        Manual and auto irrigation control per field · Refreshes every 5s
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {sprinklers.map(s => (
          <div key={s.id} style={{
            background: "#fff", borderRadius: "12px", padding: "24px",
            border: `2px solid ${s.active ? "#2d6a2d" : "#e8e8e8"}`,
            transition: "border 0.3s",
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ color: "#1a3c1a", margin: 0, fontFamily: "Georgia, serif" }}>{s.name}</h3>
                <p style={{ color: "#888", fontSize: "13px", margin: "4px 0 0" }}>
                  {s.auto ? "Auto irrigation enabled" : "Manual control"}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{
                  background: s.active ? "#2d6a2d" : "#e8e8e8",
                  color: s.active ? "#fff" : "#888",
                  borderRadius: "20px", padding: "4px 14px", fontSize: "13px", fontWeight: "600",
                }}>
                  {s.active ? "💧 ON" : "OFF"}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {/* Manual toggle */}
              <button
                onClick={() => toggle(s.id, !s.active)}
                style={{
                  padding: "10px 20px", borderRadius: "8px", border: "none",
                  background: s.active ? "#e74c3c" : "#2d6a2d",
                  color: "#fff", fontWeight: "600", cursor: "pointer", fontSize: "14px",
                }}>
                {s.active ? "Turn OFF" : "Turn ON"}
              </button>

              {/* Auto mode toggle */}
              <button
                onClick={() => toggleAuto(s.id, !s.auto)}
                style={{
                  padding: "10px 20px", borderRadius: "8px",
                  border: "2px solid #2d6a2d",
                  background: s.auto ? "#f0f7f0" : "#fff",
                  color: "#2d6a2d", fontWeight: "600", cursor: "pointer", fontSize: "14px",
                }}>
                {s.auto ? "Auto: ON" : "Auto: OFF"}
              </button>

              {/* Threshold control */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "13px", color: "#666" }}>Moisture threshold:</label>
                <input
                  type="number" min="20" max="80" defaultValue={s.threshold}
                  onBlur={(e) => setThreshold(s.id, e.target.value)}
                  style={{
                    width: "60px", padding: "8px", borderRadius: "8px",
                    border: "1px solid #e8e8e8", fontSize: "14px", textAlign: "center",
                  }}
                />
                <span style={{ fontSize: "13px", color: "#666" }}>%</span>
              </div>
            </div>

            {/* Auto irrigation info */}
            {s.auto && (
              <div style={{
                marginTop: "16px", background: "#f0f7f0", borderRadius: "8px",
                padding: "12px 16px", fontSize: "13px", color: "#2d6a2d",
              }}>
                💡 Auto mode: sprinkler turns ON when soil moisture drops below <strong>{s.threshold}%</strong> and turns OFF when it reaches <strong>{s.threshold + 10}%</strong>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}