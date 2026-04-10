import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Fields from "./pages/Fields";
import FieldsMap from "./pages/FieldsMap";
import Alerts from "./pages/Alerts";
import Recommendations from "./pages/Recommendations";
import Sprinklers from "./pages/Sprinklers";
import CropCalendar from "./pages/CropCalendar";
import MarketPrices from "./pages/MarketPrices";
import WaterUsage from "./pages/WaterUsage";
import CostTracker from "./pages/CostTracker";
import PestAlerts from "./pages/PestAlerts";
import Login from "./pages/Login";
import { useLanguage } from "./LanguageContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { supabase } from "./supabaseClient";

function App() {
  const [active, setActive] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { session } = useAuth();

  if (!session) return <Login />;

  const pages = {
    dashboard: <Dashboard />,
    fields: <Fields />,
    map: <FieldsMap />,
    alerts: <Alerts />,
    recommendations: <Recommendations />,
    sprinklers: <Sprinklers />,
    calendar: <CropCalendar />,
    market: <MarketPrices />,
    water: <WaterUsage />,
    costs: <CostTracker />,
    pests: <PestAlerts />,
  };

  const navItems = [
    { id: "dashboard", label: "🌿 " + t("dashboard") },
    { id: "fields", label: "🌾 " + t("fields") },
    { id: "map", label: "🗺️ " + (language === "en" ? "Fields Map" : "ഫീൽഡ് മാപ്പ്") },
    { id: "alerts", label: "🔔 " + t("alerts") },
    { id: "recommendations", label: "🧪 " + t("fertilizerAdvisor") },
    { id: "sprinklers", label: "💧 " + t("sprinklerControl") },
    { id: "calendar", label: "📅 " + t("cropCalendar") },
    { id: "market", label: "💰 " + t("marketPrices") },
    { id: "water", label: "💧 " + t("waterUsage") },
    { id: "costs", label: "📊 " + t("costTracker") },
    { id: "pests", label: "🐛 " + t("pestDisease") },
  ];

  const handleNav = (id) => {
    setActive(id);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9f4", fontFamily: "system-ui, sans-serif" }}>

      {/* Mobile header */}
      <div className="mobile-header" style={{
        display: "none", position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#fff", borderBottom: "1px solid #e8e8e8",
        padding: "16px 20px", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1a3c1a" }}>AgriSense</div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={toggleLanguage} style={{
            padding: "6px 12px", borderRadius: "20px", border: "1px solid #2d6a2d",
            background: "#f0f7f0", color: "#2d6a2d", fontWeight: "600",
            cursor: "pointer", fontSize: "12px",
          }}>
            {language === "en" ? "മലയാളം" : "English"}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#1a3c1a",
          }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="sidebar" style={{
        width: "220px", background: "#fff", borderRight: "1px solid #e8e8e8",
        height: "100vh", position: "fixed", padding: "32px 0", display: "flex",
        flexDirection: "column", gap: "4px", overflowY: "auto", zIndex: 99,
        transition: "transform 0.3s ease",
      }}>
        <div style={{ padding: "0 24px 24px", fontSize: "20px", fontWeight: "bold", color: "#1a3c1a" }}>
          AgriSense
        </div>

        {/* Language toggle */}
        <div style={{ padding: "0 24px 16px" }}>
          <button onClick={toggleLanguage} style={{
            width: "100%", padding: "8px", borderRadius: "8px",
            border: "1px solid #2d6a2d", background: "#f0f7f0",
            color: "#2d6a2d", fontWeight: "600", cursor: "pointer", fontSize: "13px",
          }}>
            {language === "en" ? "🇮🇳 മലയാളം" : "🇬🇧 English"}
          </button>
        </div>

        {navItems.map(({ id, label }) => (
          <button key={id} onClick={() => handleNav(id)} style={{
            display: "flex", alignItems: "center", padding: "12px 24px",
            border: "none", background: active === id ? "#f0f7f0" : "transparent",
            color: active === id ? "#2d6a2d" : "#666",
            fontWeight: active === id ? "600" : "400",
            cursor: "pointer", fontSize: "13px",
            borderLeft: active === id ? "3px solid #2d6a2d" : "3px solid transparent",
            textAlign: "left",
          }}>
            {label}
          </button>
        ))}

        {/* Logout */}
        <div style={{ marginTop: "auto", padding: "16px 24px" }}>
          <div style={{ fontSize: "11px", color: "#999", marginBottom: "8px", wordBreak: "break-all" }}>
            {session.user.email}
          </div>
          <button onClick={handleLogout} style={{
            width: "100%", padding: "8px", borderRadius: "8px",
            border: "1px solid #e57373", background: "#fff5f5",
            color: "#c62828", fontWeight: "600", cursor: "pointer", fontSize: "13px",
          }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content" style={{ marginLeft: "220px", flex: 1, padding: "32px", overflowX: "hidden" }}>
        {pages[active]}
      </main>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-header { display: flex !important; }
          .sidebar {
            transform: ${menuOpen ? "translateX(0)" : "translateX(-100%)"};
            top: 0;
            padding-top: 70px;
          }
          .main-content {
            margin-left: 0 !important;
            padding: 80px 16px 16px !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-header { display: none !important; }
          .sidebar { transform: translateX(0) !important; }
        }
      `}</style>
    </div>
  );
}

export default App;