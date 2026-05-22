let tempChart = null;

document.addEventListener("weatherUpdated", (e) => {
  const { hourly } = e.detail.data;
  const currentHour = new Date().getHours();

  const times = hourly.time
    .slice(currentHour, currentHour + 24)
    .map((timeStr) => {
      const date = new Date(timeStr);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        hour12: true,
      });
    });
  const temps = hourly.temperature_2m.slice(currentHour, currentHour + 24);

  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--text-color")
    .trim();
  // Thêm logic tự động nhận diện màu lưới theo Theme
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const gridColor =
    currentTheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  drawChart(times, temps, textColor, gridColor);
});

function drawChart(labels, data, textColor, gridColor) {
  const ctx = document.getElementById("temp-chart").getContext("2d");

  if (tempChart) tempChart.destroy();

  tempChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: data,
          borderColor: "#00d2ff",
          backgroundColor: "rgba(0, 210, 255, 0.2)",
          borderWidth: 3,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#00d2ff",
          pointRadius: 4,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          titleColor: "#fff",
          bodyColor: "#fff",
          displayColors: false,
          callbacks: { label: (context) => context.parsed.y + " °C" },
        },
      },
      scales: {
        x: {
          ticks: { color: textColor, maxTicksLimit: 8 },
          grid: { color: gridColor }, // Áp dụng màu lưới tự động
        },
        y: {
          ticks: { color: textColor, callback: (value) => value + "°" },
          grid: { color: gridColor }, // Áp dụng màu lưới tự động
        },
      },
    },
  });
}

document.getElementById("theme-toggle").addEventListener("click", () => {
  if (tempChart) {
    setTimeout(() => {
      const newTextColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--text-color")
        .trim();
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newGridColor =
        currentTheme === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)";

      tempChart.options.scales.x.ticks.color = newTextColor;
      tempChart.options.scales.y.ticks.color = newTextColor;
      tempChart.options.scales.x.grid.color = newGridColor; // Cập nhật sọc dọc
      tempChart.options.scales.y.grid.color = newGridColor; // Cập nhật sọc ngang
      tempChart.update();
    }, 50);
  }
});
