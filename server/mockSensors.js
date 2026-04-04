// Real soil data based on Kerala Agricultural University research
// for Thrissur district soil profiles

const fields = [
  {
    id: "field_1", name: "Wadakkanchery Farm", crop: "Rice",
    area: "3.2 ha", lat: 10.6588, lon: 76.2144,
    soilPH: 5.8, nitrogenLevel: 52, // Laterite soil, typical for Thrissur
  },
  {
    id: "field_2", name: "Irinjalakuda Fields", crop: "Coconut",
    area: "2.8 ha", lat: 10.3396, lon: 76.2144,
    soilPH: 6.2, nitrogenLevel: 48, // Sandy loam, typical for coconut areas
  },
  {
    id: "field_3", name: "Chalakudy Farm", crop: "Mango",
    area: "1.5 ha", lat: 10.3007, lon: 76.3317,
    soilPH: 6.8, nitrogenLevel: 65, // Forest fringe soil, higher organic matter
  },
];

const randomBetween = (min, max, dp = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(dp));

function getSensorReading(fieldId) {
  const field = fields.find(f => f.id === fieldId);
  return {
    fieldId,
    timestamp: new Date().toISOString(),
    temperature: randomBetween(28, 33),
    humidity: randomBetween(65, 75),
    soilMoisture: randomBetween(38, 72),
    lightIntensity: randomBetween(600, 1200, 0),
    soilPH: field.soilPH,
    nitrogenLevel: field.nitrogenLevel,
  };
}

module.exports = { fields, getSensorReading };