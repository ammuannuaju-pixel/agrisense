const express = require("express");
const router = express.Router();
const { fields, getSensorReading } = require("../mockSensors");

function analyzePestRisk(reading, crop) {
  const alerts = [];

  if (reading.humidity > 80) {
    alerts.push({
      type: "warning", pest: "Fungal Disease", risk: "high",
      condition: `Humidity at ${reading.humidity}% (above 80%)`,
      message: `High risk of fungal infection in ${crop}. Apply fungicide spray immediately.`,
      action: "Spray copper-based fungicide early morning. Improve field drainage.",
    });
  } else if (reading.humidity > 70) {
    alerts.push({
      type: "caution", pest: "Fungal Disease", risk: "medium",
      condition: `Humidity at ${reading.humidity}% (above 70%)`,
      message: `Moderate fungal risk. Monitor leaves for spots or discolouration.`,
      action: "Inspect leaves daily. Apply preventive fungicide if symptoms appear.",
    });
  }

  if (reading.temperature > 32) {
    alerts.push({
      type: "warning", pest: "Aphids & Whitefly", risk: "high",
      condition: `Temperature at ${reading.temperature}°C (above 32°C)`,
      message: `Hot conditions favour aphid and whitefly activity.`,
      action: "Spray neem oil solution. Check undersides of leaves for colonies.",
    });
  }

  if (reading.soilMoisture < 40) {
    alerts.push({
      type: "caution", pest: "Spider Mites", risk: "medium",
      condition: `Soil moisture at ${reading.soilMoisture}% (below 40%)`,
      message: `Dry conditions increase spider mite risk in ${crop}.`,
      action: "Increase irrigation. Apply miticide if webbing is visible on leaves.",
    });
  }

  if (crop === "Rice" && reading.humidity > 75) {
    alerts.push({
      type: "warning", pest: "Rice Blast", risk: "high",
      condition: `High humidity conditions`,
      message: "Rice blast disease risk is high. Most destructive rice disease.",
      action: "Apply tricyclazole fungicide. Avoid excess nitrogen fertilization.",
    });
  }

  if (crop === "Mango" && reading.temperature > 28) {
    alerts.push({
      type: "caution", pest: "Mango Hopper", risk: "medium",
      condition: `Warm temperature at ${reading.temperature}°C`,
      message: "Mango hoppers are active in warm weather. Check flower clusters.",
      action: "Spray imidacloprid on flower clusters. Remove weeds around trees.",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: "success", pest: "No Threats", risk: "low",
      condition: "All conditions normal",
      message: "No pest or disease threats detected.",
      action: "Continue regular monitoring.",
    });
  }

  return alerts;
}

router.get("/", async (req, res) => {
  const results = await Promise.all(fields.map(async f => {
    const reading = await getSensorReading(f.id);
    return {
      fieldId: f.id,
      fieldName: f.name,
      crop: f.crop,
      alerts: analyzePestRisk(reading, f.crop),
    };
  }));
  res.json(results);
});

module.exports = router;