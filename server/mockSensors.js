const axios = require("axios");

const fields = [
  { id: "field_1", name: "Wadakkanchery Farm", crop: "Rice", area: "3.2 ha", lat: 10.6588, lon: 76.2144, soilPH: 5.8, nitrogenLevel: 52 },
  { id: "field_2", name: "Irinjalakuda Fields", crop: "Coconut", area: "2.8 ha", lat: 10.3396, lon: 76.2144, soilPH: 6.2, nitrogenLevel: 48 },
  { id: "field_3", name: "Chalakudy Farm", crop: "Mango", area: "1.5 ha", lat: 10.3007, lon: 76.3317, soilPH: 6.8, nitrogenLevel: 65 },
];

// Cache per field
let cache = {};
let lastFetch = {};

async function fetchOpenMeteoData(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,rain,soil_moisture_0_to_1cm&hourly=soil_moisture_0_to_1cm&timezone=auto`;
  console.log(`Fetching Open-Meteo data for ${lat}, ${lon}...`);
  const response = await axios.get(url, { timeout: 15000 });
  const current = response.data.current;

  // Convert soil moisture from m³/m³ to percentage (multiply by 100)
  const soilMoisturePct = parseFloat((current.soil_moisture_0_to_1cm * 100).toFixed(1));

  console.log(`Open-Meteo: temp=${current.temperature_2m}, humidity=${current.relative_humidity_2m}, soilMoisture=${soilMoisturePct}%`);

  return {
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    rainfall: current.rain,
    soilMoisture: soilMoisturePct,
  };
}

async function getSensorReading(fieldId) {
  const field = fields.find(f => f.id === fieldId);

  try {
    const now = Date.now();
    // Refresh every 60 minutes
    if (!cache[fieldId] || !lastFetch[fieldId] || now - lastFetch[fieldId] > 60 * 60 * 1000) {
      cache[fieldId] = await fetchOpenMeteoData(field.lat, field.lon);
      lastFetch[fieldId] = now;
    }

    const data = cache[fieldId];

    return {
      fieldId,
      timestamp: new Date().toISOString(),
      temperature: data.temperature,
      humidity: data.humidity,
      rainfall: data.rainfall,
      soilMoisture: data.soilMoisture,
      lightIntensity: Math.round(600 + Math.random() * 600),
      soilPH: field.soilPH,
      nitrogenLevel: field.nitrogenLevel,
    };
  } catch (err) {
    console.error("Open-Meteo fetch failed:", err.message, "— using fallback data");
    return {
      fieldId,
      timestamp: new Date().toISOString(),
      soilMoisture: 55,
      temperature: 30,
      humidity: 70,
      rainfall: 0,
      lightIntensity: 800,
      soilPH: field.soilPH,
      nitrogenLevel: field.nitrogenLevel,
    };
  }
}

module.exports = { fields, getSensorReading };