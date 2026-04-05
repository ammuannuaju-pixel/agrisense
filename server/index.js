const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sensorRoutes = require("./routes/sensors");
const alertRoutes = require("./routes/alerts");
const weatherRoutes = require("./routes/weather");
const recommendationRoutes = require("./routes/recommendations");
const sprinklerRoutes = require("./routes/sprinklers");
const cropCalendarRoutes = require("./routes/cropCalendar");
const marketPricesRoutes = require("./routes/marketPrices");
const farmAssistantRoutes = require("./routes/farmAssistant");
const waterUsageRoutes = require("./routes/waterUsage");
const costsRoutes = require("./routes/costs");
const pestAlertsRoutes = require("./routes/pestAlerts");

const { runAutoIrrigation } = require("./sprinklers");
const { generateAlerts } = require("./alertsEngine");
const { fields, getSensorReading } = require("./mockSensors");

const app = express();
app.use(cors({
  origin: "*",
  credentials: false,
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("AgriSense API running"));

app.use("/api/sensors", sensorRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/sprinklers", sprinklerRoutes);
app.use("/api/calendar", cropCalendarRoutes);
app.use("/api/market", marketPricesRoutes);
app.use("/api/assistant", farmAssistantRoutes);
app.use("/api/water", waterUsageRoutes);
app.use("/api/costs", costsRoutes);
app.use("/api/pests", pestAlertsRoutes);

// Auto irrigation — checks every 30 seconds
setInterval(() => {
  const readings = fields.map(f => getSensorReading(f.id));
  runAutoIrrigation(() => readings);
}, 30000);

// Generate dynamic alerts every 5 minutes
generateAlerts();
setInterval(generateAlerts, 5 * 60 * 1000);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));