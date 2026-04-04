const supabase = require("./supabase");
const { fields, getSensorReading } = require("./mockSensors");

async function generateAlerts() {
  for (const field of fields) {
    const reading = getSensorReading(field.id);

    // Clear old auto-generated alerts for this field
    await supabase.from("alerts").delete().eq("field", field.name).eq("auto", true);

    const newAlerts = [];

    if (reading.soilMoisture < 40) {
      newAlerts.push({
        field: field.name,
        type: "warning",
        message: `Soil moisture critically low at ${reading.soilMoisture}% — irrigation recommended`,
        auto: true,
      });
    } else if (reading.soilMoisture > 70) {
      newAlerts.push({
        field: field.name,
        type: "warning",
        message: `Soil moisture too high at ${reading.soilMoisture}% — check drainage`,
        auto: true,
      });
    } else {
      newAlerts.push({
        field: field.name,
        type: "success",
        message: `Soil moisture optimal at ${reading.soilMoisture}%`,
        auto: true,
      });
    }

    if (reading.temperature > 35) {
      newAlerts.push({
        field: field.name,
        type: "warning",
        message: `High temperature alert: ${reading.temperature}°C — risk of heat stress`,
        auto: true,
      });
    }

    if (reading.nitrogenLevel < 45) {
      newAlerts.push({
        field: field.name,
        type: "warning",
        message: `Low nitrogen level at ${reading.nitrogenLevel} mg/kg — fertilization needed`,
        auto: true,
      });
    }

    if (newAlerts.length > 0) {
      await supabase.from("alerts").insert(newAlerts);
    }
  }

  console.log("Alerts updated from live sensor readings");
}

module.exports = { generateAlerts };