let rainChart = null;

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
  const rainData = hourly.precipitation.slice(currentHour, currentHour + 24);

  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--text-color")
    .trim();
  // Thêm logic tự động nhận diện màu lưới
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const gridColor =
    currentTheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  drawRainChart(times, rainData, textColor, gridColor);
});

function drawRainChart(labels, data, textColor, gridColor) {
  const ctx = document.getElementById("rain-chart").getContext("2d");

  if (rainChart) rainChart.destroy();

  rainChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Precipitation (mm)",
          data: data,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          borderRadius: 4,
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
          callbacks: { label: (context) => context.parsed.y + " mm" },
        },
      },
      scales: {
        x: {
          ticks: { color: textColor, maxTicksLimit: 8 },
          grid: { display: false }, // Đáy của Bar Chart thường không để sọc dọc cho đỡ rối
        },
        y: {
          ticks: { color: textColor, callback: (value) => value + " mm" },
          grid: { color: gridColor }, // Áp dụng sọc ngang tự động
          beginAtZero: true,
        },
      },
    },
  });
}

document.getElementById("theme-toggle").addEventListener("click", () => {
  if (rainChart) {
    setTimeout(() => {
      const newTextColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--text-color")
        .trim();
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newGridColor =
        currentTheme === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)";

      rainChart.options.scales.x.ticks.color = newTextColor;
      rainChart.options.scales.y.ticks.color = newTextColor;
      rainChart.options.scales.y.grid.color = newGridColor; // Cập nhật sọc ngang
      rainChart.update();
    }, 50);
  }
});
