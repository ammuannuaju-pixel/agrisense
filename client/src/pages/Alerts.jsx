import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api/config.js";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/alerts`)
      .then(res => { setAlerts(Array.isArray(res.data) ? res.data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading alerts...</p>;

  return (
    <div style={{ maxWidth: "700px" }}>
      <h1 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "8px" }}>Alerts</h1>
      <p style={{ color: "#888", marginBottom: "32px" }}>Crop health notifications</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {alerts.map(alert => (
          <div key={alert.id} style={{
            background: "#fff", borderRadius: "12px", padding: "20px",
            border: `1px solid ${alert.type === "warning" ? "#f39c12" : "#2ecc71"}`,
            display: "flex", gap: "16px", alignItems: "flex-start",
          }}>
            <span style={{ fontSize: "20px" }}>{alert.type === "warning" ? "⚠️" : "✅"}</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1a1a1a", marginBottom: "4px" }}>{alert.field}</p>
              <p style={{ fontSize: "13px", color: "#555", marginBottom: "6px" }}>{alert.message}</p>
              <p style={{ fontSize: "12px", color: "#aaa" }}>
                {new Date(alert.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}