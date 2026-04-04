const express = require("express");
const router = express.Router();

// Simulated water usage data (litres per day per field)
const generateUsage = () => {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push({
      date: date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
      northField: Math.round(800 + Math.random() * 400),
      southField: Math.round(1000 + Math.random() * 500),
      eastOrchard: Math.round(600 + Math.random() * 300),
    });
  }
  return days;
};

router.get("/", (req, res) => {
  const usage = generateUsage();
  const totals = usage.reduce((acc, day) => ({
    northField: acc.northField + day.northField,
    southField: acc.southField + day.southField,
    eastOrchard: acc.eastOrchard + day.eastOrchard,
  }), { northField: 0, southField: 0, eastOrchard: 0 });

  res.json({
    daily: usage,
    weeklyTotals: totals,
    weeklyGrandTotal: totals.northField + totals.southField + totals.eastOrchard,
  });
});

module.exports = router;