const express = require("express");
const router = express.Router();
const { getSprinklers, toggleSprinkler, toggleAuto, setThreshold } = require("../sprinklers");

router.get("/", async (req, res) => {
  try {
    const data = await getSprinklers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/toggle/:id", async (req, res) => {
  try {
    const { active } = req.body;
    const updated = await toggleSprinkler(req.params.id, active);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/auto/:id", async (req, res) => {
  try {
    const { auto } = req.body;
    const updated = await toggleAuto(req.params.id, auto);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/threshold/:id", async (req, res) => {
  try {
    const { threshold } = req.body;
    const updated = await setThreshold(req.params.id, threshold);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;