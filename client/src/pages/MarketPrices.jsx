import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api/config.js";

export default function MarketPrices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/market`)
      .then(res => { setPrices(res.data); setLoading(false); });
  }, []);

  if (loading) return <p>Fetching market prices...</p>;

  const cropEmoji = { Wheat: "🌾", Rice: "🍚", Mango: "🥭", Coconut: "🥥" };

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "8px" }}>
        Market Prices
      </h1>
      <p style={{ color: "#888", marginBottom: "32px" }}>
        Current mandi prices for your crops · Kerala markets
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {prices.map(({ crop, prices: cropPrices }) => (
          <div key={crop} style={{
            background: "#fff", borderRadius: "12px", padding: "24px",
            border: "1px solid #e8e8e8",
          }}>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "20px" }}>
              {cropEmoji[crop] || "🌱"} {crop}
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}>
              {cropPrices.map((p, i) => (
                <div key={i} style={{
                  background: "#f8f9f4", borderRadius: "10px", padding: "16px",
                  border: "1px solid #e8e8e8",
                }}>
                  <p style={{ fontWeight: "700", color: "#1a3c1a", marginBottom: "12px", fontSize: "15px" }}>
                    📍 {p.market}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ color: "#888", fontSize: "13px" }}>Modal Price</span>
                    <span style={{ fontWeight: "700", color: "#2d6a2d", fontSize: "16px" }}>₹{p.modal}/q</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ color: "#888", fontSize: "13px" }}>Min</span>
                    <span style={{ fontWeight: "600", color: "#555" }}>₹{p.min}/q</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ color: "#888", fontSize: "13px" }}>Max</span>
                    <span style={{ fontWeight: "600", color: "#555" }}>₹{p.max}/q</span>
                  </div>
                  <p style={{ color: "#aaa", fontSize: "12px", margin: 0 }}>Updated: {p.date}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}