import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

const generateHistory = () =>
  Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}:00`,
    soilMoisture: Math.round(40 + Math.random() * 30),
    temperature: Math.round(22 + Math.random() * 14),
    humidity: Math.round(50 + Math.random() * 35),
  }));

export default function SensorChart() {
  const data = generateHistory();

  return (
    <div style={{
      background: "#fff", borderRadius: "12px", padding: "24px",
      border: "1px solid #e8e8e8", marginTop: "24px",
    }}>
      <h2 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "20px" }}>
        24-Hour Sensor Trends
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="moisture" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2d6a2d" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2d6a2d" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="temp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e67e22" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#e67e22" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="humidity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2980b9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2980b9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="soilMoisture" stroke="#2d6a2d" fill="url(#moisture)" name="Soil Moisture (%)" />
          <Area type="monotone" dataKey="temperature" stroke="#e67e22" fill="url(#temp)" name="Temperature (°C)" />
          <Area type="monotone" dataKey="humidity" stroke="#2980b9" fill="url(#humidity)" name="Humidity (%)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}