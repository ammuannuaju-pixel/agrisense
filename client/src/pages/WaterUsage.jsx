import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { API_URL } from "../api/config.js";
export default function WaterUsage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/water`)
      .then(res => { setData(res.data); setLoading(false); });
  }, []);

  if (loading) return <p>Loading water usage...</p>;

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "8px" }}>
        Water Usage Tracker
      </h1>
      <p style={{ color: "#888", marginBottom: "32px" }}>
        Daily irrigation water consumption per field · Last 7 days
      </p>

      {/* Weekly totals */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "16px", marginBottom: "32px",
      }}>
        {[
          { label: "Wadakkanchery Farm", value: data.weeklyTotals.northField, color: "#2d6a2d" },
          { label: "Irinjalakuda Fields", value: data.weeklyTotals.southField, color: "#2980b9" },
          { label: "Chalakudy Farm", value: data.weeklyTotals.eastOrchard, color: "#e67e22" },
          { label: "Total This Week", value: data.weeklyGrandTotal, color: "#1a3c1a" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "#fff", borderRadius: "12px", padding: "20px",
            border: "1px solid #e8e8e8",
          }}>
            <p style={{ color: "#888", fontSize: "12px", marginBottom: "8px" }}>{label}</p>
            <p style={{ fontSize: "22px", fontWeight: "700", color, margin: 0 }}>
              {value.toLocaleString()}
            </p>
            <p style={{ color: "#aaa", fontSize: "12px", margin: 0 }}>litres</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "24px",
        border: "1px solid #e8e8e8", marginBottom: "24px",
      }}>
        <h3 style={{ color: "#1a3c1a", fontFamily: "Georgia, serif", marginBottom: "20px" }}>
          Daily Water Usage (Litres)
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="northField" name="Wadakkanchery" fill="#2d6a2d" radius={[4, 4, 0, 0]} />
            <Bar dataKey="southField" name="Irinjalakuda" fill="#2980b9" radius={[4, 4, 0, 0]} />
            <Bar dataKey="eastOrchard" name="Chalakudy" fill="#e67e22" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily table */}
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "24px",
        border: "1px solid #e8e8e8", overflowX: "auto",
      }}>
        <h3 style={{ color: "#1a3c1a", fontFamily: "Georgia, serif", marginBottom: "16px" }}>
          Daily Breakdown
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "500px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e8e8e8" }}>
              {["Date", "Wadakkanchery", "Irinjalakuda", "Chalakudy", "Total"].map(h => (
                <th key={h} style={{ padding: "10px", textAlign: "left", color: "#888", fontWeight: "600" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.daily.map((day, i) => {
              const total = day.northField + day.southField + day.eastOrchard;
              return (
                <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "10px", color: "#555" }}>{day.date}</td>
                  <td style={{ padding: "10px", fontWeight: "600", color: "#2d6a2d" }}>{day.northField} L</td>
                  <td style={{ padding: "10px", fontWeight: "600", color: "#2980b9" }}>{day.southField} L</td>
                  <td style={{ padding: "10px", fontWeight: "600", color: "#e67e22" }}>{day.eastOrchard} L</td>
                  <td style={{ padding: "10px", fontWeight: "700", color: "#1a3c1a" }}>{total.toLocaleString()} L</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}