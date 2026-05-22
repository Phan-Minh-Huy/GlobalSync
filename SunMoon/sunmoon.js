document.addEventListener("weatherUpdated", (e) => {
  const { daily } = e.detail.data;
  const sunriseStr = daily.sunrise[0];
  const sunsetStr = daily.sunset[0];

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  document.getElementById("sunrise-time").textContent = formatTime(sunriseStr);
  document.getElementById("sunset-time").textContent = formatTime(sunsetStr);
});
