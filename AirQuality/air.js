document.addEventListener("weatherUpdated", async (e) => {
  const { lat, lon } = e.detail;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm2_5,alder_pollen`;

  try {
    const response = await fetch(aqiUrl);
    const data = await response.json();

    const aqi = data.current.european_aqi;
    document.getElementById("aqi-value").textContent = aqi;
    document.getElementById("pm25-value").textContent = data.current.pm2_5;

    const aqiLevel = document.getElementById("aqi-level");
    aqiLevel.className = "badge";

    if (aqi <= 40) {
      aqiLevel.textContent = "Good";
      aqiLevel.classList.add("aqi-good");
    } else if (aqi <= 80) {
      aqiLevel.textContent = "Moderate";
      aqiLevel.classList.add("aqi-moderate");
    } else {
      aqiLevel.textContent = "Poor";
      aqiLevel.classList.add("aqi-poor");
    }
  } catch (err) {}
});
