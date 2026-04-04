function getFertilizeAdvice(dailyWeather, nitrogenLevel) {
  const { precipitation_sum, time } = dailyWeather;

  const rainyDays = precipitation_sum
    .map((rain, i) => ({ day: time[i], rain }))
    .filter(d => d.rain > 5);

  const next3DaysRain = precipitation_sum.slice(0, 3).reduce((a, b) => a + b, 0);
  const heavyRainComing = precipitation_sum.some(r => r > 20);
  const safeDay = precipitation_sum
    .map((rain, i) => ({ day: time[i], rain }))
    .find(d => d.rain < 3);

  let recommendation = "";
  let warning = "";
  let leachingRisk = "low";
  let safeTofertilize = true;

  // Nitrogen leaching risk
  if (heavyRainComing) {
    leachingRisk = "high";
    safeTofertilize = false;
    warning = "Heavy rainfall expected this week. Applying fertilizer now will cause nitrogen leaching — nutrients will wash away before crops absorb them.";
    recommendation = safeDay
      ? `Wait until ${safeDay.day} when rainfall drops below 3mm. Apply fertilizer in the early morning on that day.`
      : "No safe window this week. Delay fertilization until next week.";
  } else if (next3DaysRain > 10) {
    leachingRisk = "medium";
    safeTofertilize = false;
    warning = "Moderate rain expected in the next 3 days. Risk of nitrogen runoff is medium.";
    recommendation = safeDay
      ? `Consider waiting until ${safeDay.day} for safer application.`
      : "Apply split doses in small amounts to reduce leaching risk.";
  } else {
    leachingRisk = "low";
    safeTofertilize = true;
    recommendation = "Conditions are good for fertilization. Apply in early morning to allow absorption before any light rain.";
  }

  // Nitrogen level advice
  let nitrogenAdvice = "";
  if (nitrogenLevel < 50) {
    nitrogenAdvice = "Soil nitrogen is low. Fertilization is needed soon.";
  } else if (nitrogenLevel < 70) {
    nitrogenAdvice = "Soil nitrogen is moderate. Monitor and fertilize if levels drop further.";
  } else {
    nitrogenAdvice = "Soil nitrogen is sufficient. Avoid over-fertilizing to prevent excess runoff.";
  }

  // Leaching prevention tips
  const leachingTips = [
    "Apply fertilizer in split doses rather than all at once.",
    "Use slow-release nitrogen fertilizers (e.g. urea with inhibitors).",
    "Avoid fertilizing before heavy rainfall or irrigation.",
    "Maintain ground cover or mulch to reduce surface runoff.",
    "Apply fertilizer in the early morning, not before rain.",
  ];

  return {
    safeTofertilize,
    leachingRisk,
    recommendation,
    warning,
    nitrogenAdvice,
    leachingTips,
    rainyDays,
  };
}

module.exports = { getFertilizeAdvice };