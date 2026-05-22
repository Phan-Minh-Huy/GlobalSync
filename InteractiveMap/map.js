// Khởi tạo bản đồ
let map = L.map("weather-map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "© OpenStreetMap",
}).addTo(map);

let marker;

document.addEventListener("weatherUpdated", (e) => {
  const { lat, lon } = e.detail;

  // Dùng setTimeout chờ 100ms để giao diện HTML mở ra hoàn toàn
  // Sau đó ép Leaflet tính toán lại kích thước bản đồ rồi mới zoom tới vị trí
  setTimeout(() => {
    map.invalidateSize(); // Tuyệt chiêu sửa lỗi bản đồ xám
    map.setView([lat, lon], 10);

    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lon]).addTo(map);
  }, 100);
});
