import { useState } from "react";
import axios from "axios";
import { API_URL } from "../api/config.js";

const suggestions = [
  "My rice leaves are turning yellow, what's wrong?",
  "When should I irrigate my wheat field today?",
  "How do I improve soil pH for mango trees?",
  "Is it a good time to apply fertilizer?",
  "How do I prevent pests after heavy rain?",
];

export default function FarmAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm your AI farm assistant. Ask me anything about your crops, soil, weather or farming practices. I have access to your live sensor data!" }
  ]);
  const [loading, setLoading] = useState(false);

  const ask = async (q) => {
    const userQuestion = q || question;
    if (!userQuestion.trim()) return;

    setMessages(prev => [...prev, { role: "user", text: userQuestion }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post("/api/assistant", { question: userQuestion });
      setMessages(prev => [...prev, { role: "assistant", text: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I'm unavailable right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "8px" }}>
        AI Farm Assistant
      </h1>
      <p style={{ color: "#888", marginBottom: "24px" }}>
        Ask anything about your crops, soil, or farming — powered by Gemini AI
      </p>

      {/* Suggestions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => ask(s)} style={{
            padding: "8px 14px", borderRadius: "20px", border: "1px solid #2d6a2d",
            background: "#fff", color: "#2d6a2d", fontSize: "12px",
            cursor: "pointer", fontWeight: "500",
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* Chat messages */}
      <div style={{
        background: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8",
        padding: "24px", marginBottom: "16px", minHeight: "400px",
        display: "flex", flexDirection: "column", gap: "16px",
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "75%", padding: "12px 16px", borderRadius: "12px",
              background: msg.role === "user" ? "#2d6a2d" : "#f0f7f0",
              color: msg.role === "user" ? "#fff" : "#1a1a1a",
              fontSize: "14px", lineHeight: "1.6",
              borderBottomRightRadius: msg.role === "user" ? "4px" : "12px",
              borderBottomLeftRadius: msg.role === "assistant" ? "4px" : "12px",
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "12px 16px", borderRadius: "12px", background: "#f0f7f0",
              color: "#888", fontSize: "14px",
            }}>
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "12px" }}>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === "Enter" && ask()}
          placeholder="Ask about your crops, soil, weather..."
          style={{
            flex: 1, padding: "14px 16px", borderRadius: "10px",
            border: "1px solid #e8e8e8", fontSize: "14px", outline: "none",
          }}
        />
        <button onClick={() => ask()} style={{
          padding: "14px 24px", borderRadius: "10px", border: "none",
          background: "#2d6a2d", color: "#fff", fontWeight: "600",
          cursor: "pointer", fontSize: "14px",
        }}>
          Ask
        </button>
      </div>
    </div>
  );
}