const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const mockPrices = [
      {
        crop: "Wheat",
        prices: [
          { market: "Thrissur", min: 2100, max: 2300, modal: 2200, date: new Date().toLocaleDateString() },
          { market: "Kochi", min: 2050, max: 2250, modal: 2150, date: new Date().toLocaleDateString() },
        ],
      },
      {
        crop: "Rice",
        prices: [
          { market: "Thrissur", min: 3200, max: 3600, modal: 3400, date: new Date().toLocaleDateString() },
          { market: "Palakkad", min: 3100, max: 3500, modal: 3300, date: new Date().toLocaleDateString() },
        ],
      },
      {
        crop: "Mango",
        prices: [
          { market: "Thrissur", min: 4000, max: 6000, modal: 5000, date: new Date().toLocaleDateString() },
          { market: "Kochi", min: 3800, max: 5800, modal: 4800, date: new Date().toLocaleDateString() },
        ],
      },
    ];

    res.json(mockPrices);
  } catch (err) {
    res.status(500).json({ error: "Market price fetch failed" });
  }
});

module.exports = router;