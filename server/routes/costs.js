const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

const estimatedRevenue = {
  "Wadakkanchery Farm": { crop: "Rice", estimatedYield: 3200, pricePerQuintal: 3400 },
  "Irinjalakuda Fields": { crop: "Coconut", estimatedYield: 2800, pricePerQuintal: 2200 },
  "Chalakudy Farm": { crop: "Mango", estimatedYield: 1500, pricePerQuintal: 5000 },
};

router.get("/", async (req, res) => {
  try {
    const { data: costs, error } = await supabase.from("costs").select("*").order("date", { ascending: false });
    if (error) throw error;

    const totalCosts = costs.reduce((sum, c) => sum + parseFloat(c.amount), 0);

    const revenueData = Object.entries(estimatedRevenue).map(([field, data]) => ({
      field,
      ...data,
      estimatedRevenue: (data.estimatedYield / 100) * data.pricePerQuintal,
      fieldCosts: costs.filter(c => c.field === field).reduce((sum, c) => sum + parseFloat(c.amount), 0),
    }));

    const totalRevenue = revenueData.reduce((sum, r) => sum + r.estimatedRevenue, 0);

    res.json({
      costs,
      revenueData,
      totalCosts,
      totalRevenue,
      estimatedProfit: totalRevenue - totalCosts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { field, category, description, amount, date } = req.body;
    const { data, error } = await supabase.from("costs").insert([{ field, category, description, amount: parseFloat(amount), date }]).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;