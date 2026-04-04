const express = require("express");
const router = express.Router();
const { fields, getSensorReading } = require("../mockSensors");

router.get("/fields", (req, res) => {
  res.json(fields);
});

router.get("/reading/:fieldId", (req, res) => {
  const data = getSensorReading(req.params.fieldId);
  res.json(data);
});

router.get("/readings/all", (req, res) => {
  const all = fields.map(f => ({
    ...f,
    ...getSensorReading(f.id),
  }));
  res.json(all);
});

module.exports = router;