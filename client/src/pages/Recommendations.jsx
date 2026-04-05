import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api/config.js";

export default function Recommendations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/recommendations`)
      .then(res => { setData(res.data); setLoading(false); });
  }, []);

  if (loading) return <p>Analyzing weather and soil data...</p>;

  const riskColor = { low: "#2ecc71", medium: "#f39c12", high: "#e74c3c" };

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "8px" }}>
        Fertilization Advisor
      </h1>
      <p style={{ color: "#888", marginBottom: "32px" }}>
        Based on 5-day weather forecast + soil nitrogen levels
      </p>

      {/* Main recommendation */}
      <div style={{
        background: data.safeTofertilize ? "#f0f7f0" : "#fff5f0",
        border: `2px solid ${data.safeTofertilize ? "#2d6a2d" : "#e74c3c"}`,
        borderRadius: "12px", padding: "24px", marginBottom: "20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <span style={{ fontSize: "32px" }}>{data.safeTofertilize ? "✅" : "🚫"}</span>
          <h2 style={{ color: data.safeTofertilize ? "#2d6a2d" : "#e74c3c", margin: 0 }}>
            {data.safeTofertilize ? "Safe to Fertilize" : "Do Not Fertilize Now"}
          </h2>
        </div>
        <p style={{ color: "#444", marginBottom: "8px" }}>{data.recommendation}</p>
        {data.warning && (
          <p style={{ color: "#e74c3c", fontWeight: "600", marginTop: "8px" }}>
            ⚠️ {data.warning}
          </p>
        )}
      </div>

      {/* Nitrogen leaching risk */}
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "24px",
        border: "1px solid #e8e8e8", marginBottom: "20px",
      }}>
        <h3 style={{ color: "#1a3c1a", marginBottom: "16px" }}>Nitrogen Leaching Risk</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
          <div style={{
            background: riskColor[data.leachingRisk], borderRadius: "8px",
            padding: "6px 16px", color: "#fff", fontWeight: "700",
            textTransform: "uppercase", fontSize: "13px",
          }}>
            {data.leachingRisk} risk
          </div>
          <p style={{ color: "#555", margin: 0 }}>
            Avg Soil Nitrogen: <strong>{data.avgNitrogen} mg/kg</strong>
          </p>
        </div>
        <p style={{ color: "#555" }}>{data.nitrogenAdvice}</p>
      </div>

      {/* 5-day forecast */}
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "24px",
        border: "1px solid #e8e8e8", marginBottom: "20px",
      }}>
        <h3 style={{ color: "#1a3c1a", marginBottom: "16px" }}>5-Day Rainfall Forecast</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "12px",
        }}>
          {data.forecast.time.map((day, i) => (
            <div key={day} style={{
              background: data.forecast.precipitation_sum[i] > 10 ? "#fff5f0" : "#f8f9f4",
              borderRadius: "10px", padding: "16px", textAlign: "center",
              border: `1px solid ${data.forecast.precipitation_sum[i] > 10 ? "#e74c3c" : "#e8e8e8"}`,
            }}>
              <p style={{ fontSize: "11px", color: "#888", marginBottom: "8px" }}>
                {new Date(day).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
              </p>
              <p style={{ fontSize: "22px", marginBottom: "4px" }}>
                {data.forecast.precipitation_sum[i] > 10 ? "🌧️" : data.forecast.precipitation_sum[i] > 3 ? "🌦️" : "☀️"}
              </p>
              <p style={{ fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
                {data.forecast.precipitation_sum[i]} mm
              </p>
              <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
                {data.forecast.temperature_2m_max[i]}°C
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaching prevention tips */}
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "24px",
        border: "1px solid #e8e8e8",
      }}>
        <h3 style={{ color: "#1a3c1a", marginBottom: "16px" }}>How to Prevent Nitrogen Leaching</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {data.leachingTips.map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{
                background: "#f0f7f0", borderRadius: "50%", width: "24px", height: "24px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: "700", color: "#2d6a2d", flexShrink: 0,
              }}>{i + 1}</span>
              <p style={{ color: "#555", margin: 0, fontSize: "14px" }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}