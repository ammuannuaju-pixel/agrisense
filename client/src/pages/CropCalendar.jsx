import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api/config.js";

export default function CropCalendar() {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/calendar`)
      .then(res => {
        setCalendars(res.data);
        setSelected(res.data[0]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading crop calendar...</p>;

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "8px" }}>
        Crop Calendar
      </h1>
      <p style={{ color: "#888", marginBottom: "32px" }}>
        Weekly tasks and growth stages per field
      </p>

      {/* Field selector */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        {calendars.map(c => (
          <button key={c.fieldId} onClick={() => setSelected(c)} style={{
            padding: "10px 20px", borderRadius: "8px", border: "none",
            background: selected?.fieldId === c.fieldId ? "#2d6a2d" : "#fff",
            color: selected?.fieldId === c.fieldId ? "#fff" : "#666",
            fontWeight: "600", cursor: "pointer", fontSize: "14px",
            border: "1px solid #e8e8e8",
          }}>
            {c.fieldName}
          </button>
        ))}
      </div>

      {selected && (
        <>
          {/* Current stage */}
          <div style={{
            background: "#f0f7f0", borderRadius: "12px", padding: "24px",
            border: "2px solid #2d6a2d", marginBottom: "24px",
          }}>
            <p style={{ color: "#2d6a2d", fontWeight: "600", fontSize: "13px", marginBottom: "8px" }}>
              CURRENT STAGE — Week {selected.weeksSincePlanting}
            </p>
            <h2 style={{ color: "#1a3c1a", fontFamily: "Georgia, serif", marginBottom: "16px" }}>
              {selected.currentStage?.stage}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {selected.currentStage?.tasks.map((task, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ color: "#2d6a2d", fontWeight: "700" }}>→</span>
                  <p style={{ color: "#444", margin: 0, fontSize: "14px" }}>{task}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next stage */}
          {selected.nextStage && (
            <div style={{
              background: "#fff", borderRadius: "12px", padding: "24px",
              border: "1px solid #e8e8e8", marginBottom: "32px",
            }}>
              <p style={{ color: "#888", fontWeight: "600", fontSize: "13px", marginBottom: "8px" }}>
                COMING UP — Week {selected.nextStage.week}
              </p>
              <h3 style={{ color: "#1a3c1a", fontFamily: "Georgia, serif", marginBottom: "12px" }}>
                {selected.nextStage.stage}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {selected.nextStage.tasks.map((task, i) => (
                  <p key={i} style={{ color: "#888", margin: 0, fontSize: "13px" }}>• {task}</p>
                ))}
              </div>
            </div>
          )}

          {/* Full calendar timeline */}
          <h3 style={{ color: "#1a3c1a", fontFamily: "Georgia, serif", marginBottom: "16px" }}>
            Full Season Timeline
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {selected.fullCalendar.map((stage, i) => {
              const isPast = stage.week < selected.weeksSincePlanting;
              const isCurrent = stage.week === selected.currentStage?.week;
              return (
                <div key={i} style={{
                  display: "flex", gap: "16px", alignItems: "flex-start",
                }}>
                  <div style={{
                    width: "60px", flexShrink: 0, textAlign: "center",
                    padding: "6px", borderRadius: "8px",
                    background: isCurrent ? "#2d6a2d" : isPast ? "#f0f0f0" : "#fff",
                    border: "1px solid #e8e8e8",
                  }}>
                    <p style={{ margin: 0, fontSize: "11px", color: isCurrent ? "#fff" : "#888" }}>Week</p>
                    <p style={{ margin: 0, fontWeight: "700", color: isCurrent ? "#fff" : "#1a1a1a" }}>{stage.week}</p>
                  </div>
                  <div style={{
                    flex: 1, background: isCurrent ? "#f0f7f0" : "#fff",
                    borderRadius: "10px", padding: "12px 16px",
                    border: `1px solid ${isCurrent ? "#2d6a2d" : "#e8e8e8"}`,
                    opacity: isPast ? 0.5 : 1,
                  }}>
                    <p style={{ fontWeight: "600", color: "#1a3c1a", margin: "0 0 4px" }}>{stage.stage}</p>
                    <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
                      {stage.tasks.join(" · ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}