// === CONFIGURATION ===
const API_KEY = "{6007bdf34158961e1b32c8b52c3fa0b9}"; // 
// =====================

const cityInput = document.getElementById("cityInput");
const searchForm = document.getElementById("searchForm");
const resultArea = document.getElementById("resultArea");
const cityName = document.getElementById("cityName");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const detailsEl = document.getElementById("details");
const unitToggle = document.getElementById("unitToggle");
const geoBtn = document.getElementById("geoBtn");

let units = "metric"; // default °C

unitToggle.addEventListener("click", () => {
  units = units === "metric" ? "imperial" : "metric";
  unitToggle.textContent = units === "metric" ? "°C" : "°F";
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

geoBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (err) => alert("Location access denied or unavailable.")
    );
  } else {
    alert("Geolocation not supported.");
  }
});

async function fetchWeather(city) {
  if (!API_KEY || API_KEY.includes("{6007bdf34158961e1b32c8b52c3fa0b9}")) {
    alert("6007bdf34158961e1b32c8b52c3fa0b9!");
    return;
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=${units}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new city("City found");
    const data = await res.json();
    renderWeather(data);
  } catch (err) {
    alert(err.message);
  }
}

async function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Location data not found");
    const data = await res.json();
    renderWeather(data);
  } catch (err) {
    alert(err.message);
  }
}

function renderWeather(data) {
  resultArea.classList.remove("hidden");
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  tempEl.textContent = `${Math.round(data.main.temp)}°${
    units === "metric" ? "C" : "F"
  }`;
  descEl.textContent = data.weather[0].description;
  detailsEl.innerHTML = `
    Humidity: ${data.main.humidity}%<br>
    Wind: ${data.wind.speed} ${units === "metric" ? "m/s" : "mph"}<br>
    Feels like: ${Math.round(data.main.feels_like)}°
  `;
}
