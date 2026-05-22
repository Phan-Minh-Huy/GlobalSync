const historyBtn = document.getElementById("history-btn");
const historySidebar = document.getElementById("history-sidebar");
const closeHistoryBtn = document.getElementById("close-history-btn");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");

let searchHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];

function saveToHistory(lat, lon, name, country) {
  const newItem = { lat, lon, name, country };
  searchHistory = searchHistory.filter(
    (item) => !(item.lat === lat && item.lon === lon),
  );
  searchHistory.unshift(newItem);
  if (searchHistory.length > 8) searchHistory.pop();
  localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  if (searchHistory.length === 0) {
    historyList.innerHTML =
      '<li style="opacity: 0.5; cursor: default; border: none;">No recent searches</li>';
    clearHistoryBtn.style.display = "none";
    return;
  }
  clearHistoryBtn.style.display = "block";
  searchHistory.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name}, ${item.country}`;
    li.addEventListener("click", () => {
      historySidebar.classList.remove("open");
      document.dispatchEvent(
        new CustomEvent("requestWeather", { detail: item }),
      );
    });
    historyList.appendChild(li);
  });
}

historyBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  historySidebar.classList.add("open");
});

closeHistoryBtn.addEventListener("click", () => {
  historySidebar.classList.remove("open");
});

document.addEventListener("click", (e) => {
  if (!historySidebar.contains(e.target) && e.target !== historyBtn) {
    historySidebar.classList.remove("open");
  }
});

clearHistoryBtn.addEventListener("click", () => {
  searchHistory = [];
  localStorage.removeItem("weatherHistory");
  renderHistory();
});

// BẮT CẢ 2 TÍN HIỆU (Để chắc chắn 100% không bao giờ trượt)
document.addEventListener("addToHistory", (e) => {
  const { lat, lon, name, country } = e.detail;
  if (name && country) saveToHistory(lat, lon, name, country);
});

document.addEventListener("weatherUpdated", (e) => {
  const { lat, lon, name, country } = e.detail;
  if (name && country) saveToHistory(lat, lon, name, country);
});

renderHistory();
