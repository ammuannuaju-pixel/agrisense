import { useState, useEffect } from "react";
import { getAllReadings, getWeather } from "../api/agrisense";
import SensorChart from "../components/SensorChart";
import { useLanguage } from "../LanguageContext.jsx";

export default function Dashboard() {
  const [readings, setReadings] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const fetchData = async () => {
    try {
      const [rRes, wRes] = await Promise.all([
        getAllReadings(),
        getWeather(10.53, 76.21),
      ]);
      setReadings(rRes.data);
      setWeather(wRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>{t("loading")}</p>;

  const avg = (key) =>
    (readings.reduce((sum, r) => sum + r[key], 0) / readings.length).toFixed(1);

  return (
    <div>
      <h1 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "8px" }}>
        {t("farmOverview")}
      </h1>
      <p style={{ color: "#888", marginBottom: "32px" }}>
        {t("liveReadings")}
      </p>

      {/* Sensor cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "16px", marginBottom: "32px",
      }}>
        {[
          { label: t("soilMoisture"), value: avg("soilMoisture"), unit: "%" },
          { label: t("temperature"), value: avg("temperature"), unit: "°C" },
          { label: t("humidity"), value: avg("humidity"), unit: "%" },
          { label: t("lightIntensity"), value: avg("lightIntensity"), unit: "lux" },
        ].map(({ label, value, unit }) => (
          <div key={label} style={{
            background: "#fff", borderRadius: "12px", padding: "20px",
            border: "1px solid #e8e8e8",
          }}>
            <p style={{ color: "#888", fontSize: "13px", marginBottom: "8px" }}>{label}</p>
            <p style={{ fontSize: "24px", fontWeight: "700", color: "#1a3c1a", margin: 0 }}>
              {value}<span style={{ fontSize: "13px", color: "#888" }}> {unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Chart + weather */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "16px",
      }}>
        <SensorChart />
        {weather && (
          <div style={{
            background: "#1a3c1a", borderRadius: "12px", padding: "24px",
            color: "#fff",
          }}>
            <p style={{ opacity: 0.7, marginBottom: "8px", fontSize: "13px" }}>
              {t("localWeather")}
            </p>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: "0 0 16px" }}>
              {weather.current.temperature_2m}°C
            </p>
            <p style={{ opacity: 0.7, margin: "0 0 6px" }}>
              {t("humidity")}: {weather.current.relative_humidity_2m}%
            </p>
            <p style={{ opacity: 0.7, margin: "0 0 6px" }}>
              Wind: {weather.current.windspeed_10m} km/h
            </p>
            <p style={{ opacity: 0.7, margin: 0 }}>
              Rain: {weather.current.rain} mm
            </p>
          </div>
        )}
      </div>
    </div>
  );
}