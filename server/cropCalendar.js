const cropCalendars = {
  Wheat: [
    { week: 1, stage: "Land Preparation", tasks: ["Plough field to 20cm depth", "Apply basal dose of phosphorus", "Level the field for uniform irrigation"] },
    { week: 2, stage: "Sowing", tasks: ["Sow seeds at 5cm depth", "Maintain row spacing of 20cm", "Apply pre-emergence herbicide"] },
    { week: 3, stage: "Germination", tasks: ["Check germination rate", "Fill gaps if germination is below 80%", "First light irrigation if soil is dry"] },
    { week: 4, stage: "Early Growth", tasks: ["Apply first nitrogen dose", "Monitor for aphids", "Irrigate if soil moisture below threshold"] },
    { week: 6, stage: "Tillering", tasks: ["Apply second nitrogen dose", "Control weeds manually or with herbicide", "Check for yellow rust disease"] },
    { week: 8, stage: "Stem Extension", tasks: ["Apply potassium fertilizer", "Scout for stem borers", "Irrigate at critical stage"] },
    { week: 10, stage: "Heading", tasks: ["Apply foliar spray for micronutrients", "Monitor for aphids and whitefly", "Avoid water stress at this stage"] },
    { week: 12, stage: "Grain Filling", tasks: ["Final irrigation", "Stop nitrogen application", "Monitor grain development"] },
    { week: 14, stage: "Maturity", tasks: ["Check moisture content of grain", "Prepare harvesting equipment", "Arrange storage facility"] },
    { week: 16, stage: "Harvest", tasks: ["Harvest when grain moisture is 12-14%", "Thresh and clean grain", "Store in dry ventilated space"] },
  ],
  Rice: [
    { week: 1, stage: "Nursery Preparation", tasks: ["Prepare nursery bed", "Soak seeds for 24 hours", "Sow pre-germinated seeds in nursery"] },
    { week: 2, stage: "Nursery Management", tasks: ["Apply light irrigation daily", "Apply urea at 2g per sq meter", "Remove weeds from nursery"] },
    { week: 3, stage: "Field Preparation", tasks: ["Flood field for pudding", "Plough and level field", "Apply basal fertilizer (P and K)"] },
    { week: 4, stage: "Transplanting", tasks: ["Transplant 21-day old seedlings", "Maintain 2-3 seedlings per hill", "Keep 2-3cm water level after transplanting"] },
    { week: 6, stage: "Tillering", tasks: ["Apply first nitrogen dose", "Maintain water level at 5cm", "Control weeds with herbicide"] },
    { week: 8, stage: "Active Tillering", tasks: ["Apply second nitrogen dose", "Scout for brown plant hopper", "Drain field for 7 days to control tillering"] },
    { week: 10, stage: "Panicle Initiation", tasks: ["Apply third nitrogen dose", "Maintain water level", "Monitor for blast disease"] },
    { week: 12, stage: "Flowering", tasks: ["Avoid pesticide spray during flowering", "Maintain water level", "Monitor for neck blast"] },
    { week: 14, stage: "Grain Filling", tasks: ["Alternate wetting and drying irrigation", "Monitor for grain discolouration", "Apply zinc if deficiency observed"] },
    { week: 16, stage: "Harvest", tasks: ["Drain field 10 days before harvest", "Harvest when 80% grains are golden", "Dry grain to 14% moisture"] },
  ],
  Mango: [
    { week: 1, stage: "Pre-flowering", tasks: ["Apply potassium and phosphorus", "Prune dead and crossing branches", "Spray paclobutrazol to induce flowering"] },
    { week: 3, stage: "Flowering", tasks: ["Spray micronutrients on leaves", "Do not irrigate during flowering", "Control powdery mildew with fungicide"] },
    { week: 5, stage: "Fruit Set", tasks: ["Light irrigation to support fruit set", "Apply nitrogen fertilizer", "Control hoppers with insecticide"] },
    { week: 8, stage: "Fruit Development", tasks: ["Increase irrigation frequency", "Apply calcium spray to prevent cracking", "Monitor for fruit fly"] },
    { week: 12, stage: "Fruit Maturity", tasks: ["Reduce irrigation 2 weeks before harvest", "Check sugar content", "Arrange harvest and packing team"] },
    { week: 14, stage: "Harvest", tasks: ["Harvest with 2cm stalk attached", "Do not drop fruits", "Grade and pack in ventilated boxes"] },
  ],
  Coconut: [
  { week: 1, stage: "Land Preparation", tasks: ["Dig pits 1m x 1m x 1m", "Fill with topsoil and compost", "Apply basal dose of fertilizer"] },
  { week: 4, stage: "Planting", tasks: ["Plant seedlings in pits", "Stake young palms", "Apply irrigation immediately after planting"] },
  { week: 8, stage: "Establishment", tasks: ["Water every 3-4 days", "Apply nitrogen fertilizer", "Remove weeds around base"] },
  { week: 16, stage: "Early Growth", tasks: ["Apply NPK fertilizer", "Monitor for rhinoceros beetle", "Maintain basin irrigation"] },
  { week: 24, stage: "Vegetative Growth", tasks: ["Apply potassium fertilizer", "Check for leaf rot disease", "Clean dead leaves"] },
  { week: 36, stage: "Pre-bearing", tasks: ["Apply micronutrients", "Monitor for bud rot", "Increase irrigation frequency"] },
  { week: 48, stage: "Bearing", tasks: ["Harvest every 45 days", "Apply full fertilizer dose", "Check for eriophyid mite"] },
],
};

function getCropCalendar(crop, plantingWeek = 1) {
  const calendar = cropCalendars[crop];
  if (!calendar) return null;

  const currentWeek = Math.floor((Date.now() - Date.now() % (7 * 24 * 60 * 60 * 1000)) / (7 * 24 * 60 * 60 * 1000));
  const weeksSincePlanting = (currentWeek - plantingWeek + 52) % 52;

  const currentStage = calendar.reduce((prev, curr) =>
    curr.week <= weeksSincePlanting ? curr : prev
  );

  const nextStage = calendar.find(s => s.week > weeksSincePlanting);

  return {
    crop,
    weeksSincePlanting,
    currentStage,
    nextStage,
    fullCalendar: calendar,
  };
}

module.exports = { getCropCalendar };