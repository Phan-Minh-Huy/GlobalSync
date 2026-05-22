document.addEventListener("weatherUpdated", (e) => {
  const { current, daily } = e.detail.data;

  document.getElementById("uv-index").textContent = daily.uv_index_max[0];
  document.getElementById("humidity").textContent =
    `${current.relative_humidity_2m}%`;
  document.getElementById("visibility").textContent =
    `${(current.visibility / 1000).toFixed(1)} km`;

  const uv = daily.uv_index_max[0];
  const uvStatus = uv > 7 ? "(High Risk)" : "(Safe)";
  document.getElementById("uv-index").textContent += ` ${uvStatus}`;
});
