document.addEventListener("weatherUpdated", (e) => {
  const { current } = e.detail.data;
  const container = document.getElementById("alerts-container");
  container.innerHTML = "";
  let hasAlert = false;

  if (current.wind_speed_10m > 40) {
    container.innerHTML += `<div class="alert-item">⚠️ Strong Wind Warning (${current.wind_speed_10m} km/h)</div>`;
    hasAlert = true;
  }
  if (current.precipitation > 10 || current.weather_code === 65) {
    container.innerHTML += `<div class="alert-item">🌧️ Heavy Rain & Flood Risk</div>`;
    hasAlert = true;
  }
  if (current.weather_code >= 95) {
    container.innerHTML += `<div class="alert-item">⚡ Thunderstorm Alert</div>`;
    hasAlert = true;
  }
  if (!hasAlert) {
    container.innerHTML = `<p class="safe-text">✅ No active alerts.</p>`;
  }
});
