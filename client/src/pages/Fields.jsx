import { useEffect, useState } from "react";
import { getAllReadings } from "../api/agrisense";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import FieldMapPicker from "../components/FieldMapPicker";

export default function Fields() {
  const { session } = useAuth();
  const [fields, setFields] = useState([]);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", crop: "", area_acres: "", location: null });
  const [error, setError] = useState("");

  const fetchFields = async () => {
    const { data, error } = await supabase.from("fields").select("*").order("created_at", { ascending: false });
    if (!error) setFields(data || []);
  };

  useEffect(() => {
    Promise.all([
      fetchFields(),
      getAllReadings().then(res => setReadings(Array.isArray(res.data) ? res.data : [])),
    ]).finally(() => setLoading(false));
  }, []);

  const handleAddField = async () => {
    if (!form.name) return setError("Field name is required.");
    setSaving(true);
    setError("");
    const { error } = await supabase.from("fields").insert([{
      name: form.name,
      crop: form.crop,
      area_acres: parseFloat(form.area_acres) || null,
      user_id: session.user.id,
      latitude: form.location?.lat || null,
      longitude: form.location?.lng || null,
    }]);
    if (error) {
      setError(error.message);
    } else {
      setForm({ name: "", crop: "", area_acres: "", location: null });
      setShowForm(false);
      await fetchFields();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("fields").delete().eq("id", id);
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const getReadingsForField = (field) => {
    return readings.find(r => r.name?.toLowerCase() === field.name?.toLowerCase()) || readings[0] || {};
  };

  if (loading) return <p style={{ padding: "32px", color: "#888" }}>Loading fields...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "8px" }}>My Fields</h1>
          <p style={{ color: "#888" }}>Live sensor readings per field</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError(""); }} style={{
          padding: "10px 20px", borderRadius: "10px", border: "none",
          background: "#2d6a2d", color: "#fff", fontWeight: "600",
          cursor: "pointer", fontSize: "14px",
        }}>
          {showForm ? "Cancel" : "+ Add Field"}
        </button>
      </div>

      {/* Add Field Form */}
      {showForm && (
        <div style={{
          background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px",
          padding: "24px", marginBottom: "24px",
        }}>
          <h3 style={{ color: "#1a3c1a", marginBottom: "16px", fontFamily: "Georgia, serif" }}>New Field</h3>

          {/* Text inputs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            {[
              { label: "Field Name *", key: "name", placeholder: "e.g. North Paddy" },
              { label: "Crop", key: "crop", placeholder: "e.g. Rice" },
              { label: "Area (acres)", key: "area_acres", placeholder: "e.g. 2.5" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "6px" }}>{label}</label>
                <input
                  value={form[key]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{
                    width: "100%", padding: "10px", borderRadius: "8px",
                    border: "1px solid #e8e8e8", fontSize: "14px",
                    boxSizing: "border-box", outline: "none",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Map picker */}
          <div style={{ marginBottom: "16px" }}>
            <FieldMapPicker
              value={form.location}
              onChange={(loc) => setForm(prev => ({ ...prev, location: loc }))}
            />
          </div>

          {error && <p style={{ color: "#e74c3c", fontSize: "13px", marginBottom: "12px" }}>⚠️ {error}</p>}

          <button onClick={handleAddField} disabled={saving} style={{
            padding: "10px 24px", borderRadius: "8px", border: "none",
            background: "#2d6a2d", color: "#fff", fontWeight: "600",
            cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
          }}>
            {saving ? "Saving..." : "Save Field"}
          </button>
        </div>
      )}

      {/* Empty state */}
      {fields.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px", background: "#fff",
          borderRadius: "12px", border: "1px solid #e8e8e8", color: "#888",
        }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌾</div>
          <p>No fields added yet. Click "+ Add Field" to get started.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {fields.map(field => {
            const r = getReadingsForField(field);
            return (
              <div key={field.id} style={{
                background: "#fff", borderRadius: "12px", padding: "24px",
                border: "1px solid #e8e8e8", position: "relative",
              }}>
                {/* Delete */}
                <button onClick={() => handleDelete(field.id)} style={{
                  position: "absolute", top: "16px", right: "16px",
                  background: "none", border: "none", color: "#ccc",
                  cursor: "pointer", fontSize: "16px",
                }} title="Remove field">✕</button>

                <h3 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "4px" }}>{field.name}</h3>
                <p style={{ color: "#888", fontSize: "13px", marginBottom: "4px" }}>
                  {field.crop || "—"} · {field.area_acres ? `${field.area_acres} acres` : "—"}
                </p>
                {field.latitude && field.longitude && (
                  <p style={{ color: "#aaa", fontSize: "11px", marginBottom: "16px" }}>
                    📍 {field.latitude.toFixed(4)}, {field.longitude.toFixed(4)}
                  </p>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    ["Soil Moisture", r.soilMoisture, "%"],
                    ["Temperature", r.temperature, "°C"],
                    ["Humidity", r.humidity, "%"],
                    ["Soil pH", r.soilPH, ""],
                    ["Nitrogen", r.nitrogenLevel, "mg/kg"],
                  ].map(([label, val, unit]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                      <span style={{ color: "#666" }}>{label}</span>
                      <span style={{ fontWeight: "600", color: "#1a1a1a" }}>
                        {val !== undefined ? `${val} ${unit}` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}