const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const locateBtn = document.getElementById("locate-btn");
const mainDashboard = document.getElementById("main-dashboard");
const errorMsg = document.getElementById("error-msg");
const displayCity = document.getElementById("display-city");
const temperature = document.getElementById("temperature");
const weatherDesc = document.getElementById("weather-desc");

async function processWeatherData(latitude, longitude, cityName, countryName) {
  const safeCity = cityName || "Unknown Location";
  const safeCountry = countryName || "Unknown";

  // PHÁT TÍN HIỆU LƯU LỊCH SỬ NGAY LẬP TỨC
  document.dispatchEvent(
    new CustomEvent("addToHistory", {
      detail: {
        lat: latitude,
        lon: longitude,
        name: safeCity,
        country: safeCountry,
      },
    }),
  );

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,visibility,precipitation&daily=sunrise,sunset,uv_index_max,temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,precipitation&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    displayCity.textContent =
      safeCountry === "Unknown" ? safeCity : `${safeCity}, ${safeCountry}`;
    temperature.textContent = `${weatherData.current.temperature_2m}°C`;
    weatherDesc.textContent = getWeatherDescription(
      weatherData.current.weather_code,
    );

    mainDashboard.classList.remove("hidden");
    errorMsg.classList.add("hidden");

    const event = new CustomEvent("weatherUpdated", {
      detail: {
        lat: latitude,
        lon: longitude,
        name: safeCity,
        country: safeCountry,
        data: weatherData,
      },
    });
    document.dispatchEvent(event);
  } catch (error) {
    mainDashboard.classList.add("hidden");
    errorMsg.classList.remove("hidden");
  }
}

async function fetchWeather(city) {
  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`,
    );
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0)
      throw new Error("City not found");

    const { latitude, longitude, name, country } = geoData.results[0];
    await processWeatherData(latitude, longitude, name, country);
  } catch (error) {
    mainDashboard.classList.add("hidden");
    errorMsg.classList.remove("hidden");
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    const geoResponse = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
    );
    const geoData = await geoResponse.json();
    const cityName = geoData.city || geoData.locality || "Your Location";
    const countryName = geoData.countryName || "Unknown";

    await processWeatherData(lat, lon, cityName, countryName);
  } catch (error) {
    await processWeatherData(lat, lon, "Unknown City", "Unknown");
  }
}

function getWeatherDescription(code) {
  const codes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    95: "Thunderstorm",
  };
  return codes[code] || "Unknown weather";
}

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim()) fetchWeather(cityInput.value.trim());
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && cityInput.value.trim())
    fetchWeather(cityInput.value.trim());
});

locateBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    locateBtn.textContent = "⏳";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude,
        );
        locateBtn.textContent = "📍";
      },
      (error) => {
        alert("Location access denied or unavailable.");
        locateBtn.textContent = "📍";
      },
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      () => {},
    );
  }
});

const suggestionsList = document.getElementById("suggestions-list");
let debounceTimer;

cityInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  clearTimeout(debounceTimer);

  if (query.length < 2) {
    suggestionsList.innerHTML = "";
    suggestionsList.classList.add("hidden");
    return;
  }

  debounceTimer = setTimeout(async () => {
    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`,
      );
      const geoData = await geoResponse.json();

      suggestionsList.innerHTML = "";

      if (geoData.results && geoData.results.length > 0) {
        geoData.results.forEach((place) => {
          const li = document.createElement("li");
          const region = place.admin1 ? `${place.admin1}, ` : "";
          li.innerHTML = `<strong>${place.name}</strong> <span style="opacity: 0.7; font-size: 0.85em;">- ${region}${place.country || ""}</span>`;

          li.addEventListener("click", () => {
            cityInput.value = place.name;
            suggestionsList.classList.add("hidden");
            processWeatherData(
              place.latitude,
              place.longitude,
              place.name,
              place.country,
            );
          });
          suggestionsList.appendChild(li);
        });
        suggestionsList.classList.remove("hidden");
      } else {
        suggestionsList.classList.add("hidden");
      }
    } catch (err) {
      console.error("Error fetching suggestions");
    }
  }, 300);
});

document.addEventListener("click", (e) => {
  if (!cityInput.contains(e.target) && !suggestionsList.contains(e.target)) {
    suggestionsList.classList.add("hidden");
  }
});

document.addEventListener("requestWeather", (e) => {
  const { lat, lon, name, country } = e.detail;
  processWeatherData(lat, lon, name, country);
});
