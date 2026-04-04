const express = require("express");
const router = express.Router();
const { getCropCalendar } = require("../cropCalendar");
const { fields } = require("../mockSensors");

// Get calendar for all fields
router.get("/", (req, res) => {
  const calendars = fields.map(f => ({
    fieldId: f.id,
    fieldName: f.name,
    area: f.area,
    ...getCropCalendar(f.crop),
  }));
  res.json(calendars);
});

// Get calendar for a specific crop
router.get("/:crop", (req, res) => {
  const calendar = getCropCalendar(req.params.crop);
  if (!calendar) return res.status(404).json({ error: "Crop not found" });
  res.json(calendar);
});

module.exports = router;