const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const { lat = 10.53, lon = 76.21 } = req.query;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,rain,windspeed_10m&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
    const response = await axios.get(url);
    res.json({
      current: response.data.current,
      daily: response.data.daily,
    });
  } catch (err) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

module.exports = router;