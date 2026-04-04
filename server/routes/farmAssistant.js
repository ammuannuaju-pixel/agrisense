const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { fields, getSensorReading } = require("../mockSensors");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    // Get current sensor readings for context
    const readings = fields.map(f => ({
      ...f,
      ...getSensorReading(f.id),
    }));

    const context = readings.map(r =>
      `${r.name} (${r.crop}): Soil Moisture ${r.soilMoisture}%, Temperature ${r.temperature}°C, Humidity ${r.humidity}%, Soil pH ${r.soilPH}, Nitrogen ${r.nitrogenLevel} mg/kg`
    ).join("\n");

    const prompt = `You are an expert agricultural assistant helping farmers in Kerala, India. 
You have access to real-time sensor data from the farmer's fields:

${context}

The farmer asks: "${question}"

Give practical, specific advice based on the sensor readings and Kerala's climate. 
Keep your answer concise, friendly and actionable. Use simple language.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ answer: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Farm assistant unavailable" });
  }
});

module.exports = router;