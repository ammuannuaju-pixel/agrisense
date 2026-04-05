import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api/config.js";

const categories = ["Fertilizer", "Water", "Labour", "Pesticide", "Equipment", "Other"];
const fieldNames = ["Wadakkanchery Farm", "Irinjalakuda Fields", "Chalakudy Farm"];

export default function CostTracker() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    field: "Wadakkanchery Farm",
    category: "Fertilizer",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const fetchData = () => {
    axios.get(`${API_URL}/api/costs`)

      .then(res => { setData(res.data); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, []);

  const addCost = async () => {
    if (!form.description || !form.amount) return;
    await axios.post(`${API_URL}/api/costs/add`, form);
    setShowForm(false);
    setForm({
      field: "Wadakkanchery Farm",
      category: "Fertilizer",
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
    fetchData();
  };

  if (loading) return <p>Loading cost data...</p>;

  const profitColor = data.estimatedProfit > 0 ? "#2d6a2d" : "#e74c3c";

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "8px" }}>
        Cost & Profit Tracker
      </h1>
      <p style={{ color: "#888", marginBottom: "32px" }}>
        Track expenses and estimate season profit per field
      </p>

      {/* Summary cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px", marginBottom: "32px",
      }}>
        {[
          { label: "Total Costs", value: data.totalCosts, color: "#e74c3c" },
          { label: "Estimated Revenue", value: data.totalRevenue, color: "#2980b9" },
          { label: "Estimated Profit", value: data.estimatedProfit, color: profitColor },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "#fff", borderRadius: "12px", padding: "24px",
            border: "1px solid #e8e8e8",
          }}>
            <p style={{ color: "#888", fontSize: "13px", marginBottom: "8px" }}>{label}</p>
            <p style={{ fontSize: "28px", fontWeight: "700", color, margin: 0 }}>
              ₹{value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Per field revenue */}
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "24px",
        border: "1px solid #e8e8e8", marginBottom: "24px",
      }}>
        <h3 style={{ color: "#1a3c1a", fontFamily: "Georgia, serif", marginBottom: "16px" }}>
          Per Field Breakdown
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {data.revenueData.map((r, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "12px", padding: "12px 0",
              borderBottom: "1px solid #f0f0f0", fontSize: "14px",
            }}>
              <div>
                <p style={{ fontWeight: "600", color: "#1a3c1a", margin: 0 }}>{r.field}</p>
                <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{r.crop}</p>
              </div>
              <div>
                <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Costs</p>
                <p style={{ fontWeight: "600", color: "#e74c3c", margin: 0 }}>
                  ₹{r.fieldCosts.toLocaleString()}
                </p>
              </div>
              <div>
                <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Est. Revenue</p>
                <p style={{ fontWeight: "600", color: "#2980b9", margin: 0 }}>
                  ₹{r.estimatedRevenue.toLocaleString()}
                </p>
              </div>
              <div>
                <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Est. Profit</p>
                <p style={{
                  fontWeight: "600", margin: 0,
                  color: r.estimatedRevenue - r.fieldCosts > 0 ? "#2d6a2d" : "#e74c3c",
                }}>
                  ₹{(r.estimatedRevenue - r.fieldCosts).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost log */}
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "24px",
        border: "1px solid #e8e8e8",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "16px",
        }}>
          <h3 style={{ color: "#1a3c1a", fontFamily: "Georgia, serif", margin: 0 }}>
            Expense Log
          </h3>
          <button onClick={() => setShowForm(!showForm)} style={{
            padding: "8px 16px", borderRadius: "8px", border: "none",
            background: "#2d6a2d", color: "#fff", fontWeight: "600",
            cursor: "pointer", fontSize: "13px",
          }}>
            + Add Expense
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div style={{
            background: "#f8f9f4", borderRadius: "10px", padding: "16px",
            marginBottom: "16px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}>
            {[
              { label: "Field", key: "field", type: "select", options: fieldNames },
              { label: "Category", key: "category", type: "select", options: categories },
              { label: "Description", key: "description", type: "text" },
              { label: "Amount (₹)", key: "amount", type: "number" },
              { label: "Date", key: "date", type: "date" },
            ].map(({ label, key, type, options }) => (
              <div key={key}>
                <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px" }}>{label}</p>
                {type === "select" ? (
                  <select
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{
                      width: "100%", padding: "8px", borderRadius: "6px",
                      border: "1px solid #e8e8e8", fontSize: "13px",
                    }}>
                    {options.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{
                      width: "100%", padding: "8px", borderRadius: "6px",
                      border: "1px solid #e8e8e8", fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                )}
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "8px" }}>
              <button onClick={addCost} style={{
                padding: "8px 20px", borderRadius: "8px", border: "none",
                background: "#2d6a2d", color: "#fff", fontWeight: "600", cursor: "pointer",
              }}>Save</button>
              <button onClick={() => setShowForm(false)} style={{
                padding: "8px 20px", borderRadius: "8px", border: "1px solid #e8e8e8",
                background: "#fff", color: "#666", cursor: "pointer",
              }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {data.costs.map((cost, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0", borderBottom: "1px solid #f0f0f0", fontSize: "14px",
            }}>
              <div>
                <p style={{ fontWeight: "600", color: "#1a1a1a", margin: 0 }}>{cost.description}</p>
                <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
                  {cost.field} · {cost.category} · {cost.date}
                </p>
              </div>
              <p style={{ fontWeight: "700", color: "#e74c3c", margin: 0 }}>
                ₹{parseFloat(cost.amount).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}