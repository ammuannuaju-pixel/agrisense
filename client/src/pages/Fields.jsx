import { useEffect, useState } from "react";
import { getAllReadings } from "../api/agrisense";

export default function Fields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllReadings().then(res => {
      setFields(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading fields...</p>;

  return (
    <div>
      <h1 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "8px" }}>My Fields</h1>
      <p style={{ color: "#888", marginBottom: "32px" }}>Live readings per field</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        {fields.map(field => (
          <div key={field.id} style={{
            background: "#fff", borderRadius: "12px", padding: "24px",
            border: "1px solid #e8e8e8",
          }}>
            <h3 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "4px" }}>{field.name}</h3>
            <p style={{ color: "#888", fontSize: "13px", marginBottom: "20px" }}>{field.crop} · {field.area}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                ["Soil Moisture", field.soilMoisture, "%"],
                ["Temperature", field.temperature, "°C"],
                ["Humidity", field.humidity, "%"],
                ["Soil pH", field.soilPH, ""],
                ["Nitrogen", field.nitrogenLevel, "mg/kg"],
              ].map(([label, val, unit]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#666" }}>{label}</span>
                  <span style={{ fontWeight: "600", color: "#1a1a1a" }}>{val} {unit}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}