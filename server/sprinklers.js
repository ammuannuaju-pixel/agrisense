const supabase = require("./supabase");

async function getSprinklers() {
  const { data, error } = await supabase.from("sprinklers").select("*");
  if (error) throw error;
  return data;
}

async function toggleSprinkler(id, active) {
  const { data, error } = await supabase
    .from("sprinklers")
    .update({ active, updated_at: new Date() })
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
}

async function toggleAuto(id, auto) {
  const { data, error } = await supabase
    .from("sprinklers")
    .update({ auto, updated_at: new Date() })
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
}

async function setThreshold(id, threshold) {
  const { data, error } = await supabase
    .from("sprinklers")
    .update({ threshold, updated_at: new Date() })
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
}

async function runAutoIrrigation(getReadings) {
  const readings = await getReadings();
  const sprinklers = await getSprinklers();

  for (const s of sprinklers) {
    if (!s.auto) continue;
    const reading = readings.find(r => r.fieldId === s.field_id);
    if (!reading) continue;

    let newActive = s.active;
    if (reading.soilMoisture < s.threshold) newActive = true;
    else if (reading.soilMoisture >= s.threshold + 10) newActive = false;

    if (newActive !== s.active) {
      await supabase.from("sprinklers").update({ active: newActive }).eq("id", s.id);
    }
  }
}

module.exports = { getSprinklers, toggleSprinkler, toggleAuto, setThreshold, runAutoIrrigation };