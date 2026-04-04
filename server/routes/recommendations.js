const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getFertilizeAdvice } = require("../recommendations");
const { fields, getSensorReading } = require("../mockSensors");

router.get("/", async (req, res) => {
  try {
    const { lat = 10.53, lon = 76.21 } = req.query;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum,temperature_2m_max&timezone=auto&forecast_days=5`;
    const response = await axios.get(url);
    const dailyWeather = response.data.daily;

    // Get average nitrogen across all fields
    const readings = fields.map(f => getSensorReading(f.id));
    const avgNitrogen = readings.reduce((sum, r) => sum + r.nitrogenLevel, 0) / readings.length;

    const advice = getFertilizeAdvice(dailyWeather, avgNitrogen);

    res.json({
      ...advice,
      forecast: dailyWeather,
      avgNitrogen: avgNitrogen.toFixed(1),
    });
  } catch (err) {
    res.status(500).json({ error: "Recommendation fetch failed" });
  }
});

module.exports = router;