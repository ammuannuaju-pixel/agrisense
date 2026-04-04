import { useEffect, useState } from "react";
import axios from "axios";

export default function PestAlerts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/pests")
      .then(res => { setData(res.data); setLoading(false); });
  }, []);

  if (loading) return <p>Analyzing pest risks...</p>;

  const riskColor = { high: "#e74c3c", medium: "#f39c12", low: "#2ecc71" };
  const riskBg = { high: "#fff5f0", medium: "#fffbf0", low: "#f0fff4" };

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "8px" }}>
        Pest & Disease Alerts
      </h1>
      <p style={{ color: "#888", marginBottom: "32px" }}>
        Real-time pest risk analysis based on sensor conditions
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {data.map((field, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: "12px", padding: "24px",
            border: "1px solid #e8e8e8",
          }}>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "4px" }}>
              {field.fieldName}
            </h2>
            <p style={{ color: "#888", fontSize: "13px", marginBottom: "20px" }}>{field.crop}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {field.alerts.map((alert, j) => (
                <div key={j} style={{
                  background: riskBg[alert.risk], borderRadius: "10px", padding: "16px",
                  border: `1px solid ${riskColor[alert.risk]}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "18px" }}>
                        {alert.risk === "high" ? "🚨" : alert.risk === "medium" ? "⚠️" : "✅"}
                      </span>
                      <p style={{ fontWeight: "700", color: "#1a1a1a", margin: 0 }}>{alert.pest}</p>
                    </div>
                    <span style={{
                      background: riskColor[alert.risk], color: "#fff",
                      borderRadius: "20px", padding: "3px 12px", fontSize: "12px", fontWeight: "600",
                      textTransform: "uppercase",
                    }}>
                      {alert.risk} risk
                    </span>
                  </div>
                  <p style={{ color: "#555", fontSize: "13px", marginBottom: "6px" }}>{alert.message}</p>
                  <p style={{ color: "#666", fontSize: "12px", marginBottom: "6px" }}>
                    <strong>Condition:</strong> {alert.condition}
                  </p>
                  <p style={{ color: "#2d6a2d", fontSize: "12px", fontWeight: "600", margin: 0 }}>
                    ✔ {alert.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}