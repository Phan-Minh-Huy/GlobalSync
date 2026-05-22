const weeklyGrid = document.getElementById("weekly-grid");

document.addEventListener("weatherUpdated", (e) => {
  const { daily } = e.detail.data;
  weeklyGrid.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const date = new Date(daily.time[i]);
    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
    const maxTemp = Math.round(daily.temperature_2m_max[i]);
    const minTemp = Math.round(daily.temperature_2m_min[i]);
    const code = daily.weather_code[i];

    const card = document.createElement("div");
    card.className = "day-card glass-panel-inner";

    card.innerHTML = `
            <h3>${dayName}</h3>
            <div class="icon">${getWeatherEmoji(code)}</div>
            <div class="temps">${maxTemp}° <span>${minTemp}°</span></div>
        `;

    weeklyGrid.appendChild(card);
  }
});

function getWeatherEmoji(code) {
  const icons = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌧️",
    53: "🌧️",
    55: "🌧️",
    61: "🌧️",
    63: "🌧️",
    65: "🌧️",
    71: "❄️",
    73: "❄️",
    75: "❄️",
    95: "⛈️",
  };
  return icons[code] || "🌡️";
}
