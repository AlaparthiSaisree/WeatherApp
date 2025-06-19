// Weather App Script with CRUD + Forecast + GPS + UI Toggle

const apiKey = "65ca267626ef1eba507ff5ff1604fed1";

// DOM Elements
const getWeatherBtn = document.getElementById("getWeatherBtn");
const geoBtn = document.getElementById("geoBtn");
const infoBtn = document.getElementById("infoBtn");
const aboutSection = document.getElementById("about");
const showRecordsBtn = document.getElementById("showRecordsBtn");
const savedRecordsDiv = document.getElementById("savedRecords");

// Event Listeners
getWeatherBtn.addEventListener("click", () => {
  const location = document.getElementById("locationInput").value;
  if (location.trim() === "") {
    alert("Please enter a location.");
    return;
  }
  fetchWeather(location);
});

geoBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoords(lat, lon);
      },
      error => alert("Unable to retrieve your location.")
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

infoBtn.addEventListener("click", () => {
  aboutSection.classList.toggle("hidden");
});

showRecordsBtn.addEventListener("click", () => {
  fetch("http://localhost:5000/api/weather")
    .then(res => res.json())
    .then(records => {
      if (records.length === 0) {
        savedRecordsDiv.innerHTML = "<p>No saved weather records.</p>";
        return;
      }

      let html = "<ul>";
      records.forEach(record => {
        html += `
          <li>
            <strong>${record.location}</strong><br/>
            Date Range: ${record.dateRange.from} to ${record.dateRange.to}<br/>
            Temp: ${record.temperature}°C<br/>
            Description: ${record.description}<br/>
            <button onclick="editRecord('${record._id}')">Edit</button>
            <button onclick="deleteRecord('${record._id}')">Delete</button>
          </li><hr/>
        `;
      });
      html += "</ul>";
      savedRecordsDiv.innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      alert("Error fetching saved records.");
    });
});

// Fetch weather by location string
function fetchWeather(location) {
  const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

  fetch(currentURL)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      return fetch(forecastURL);
    })
    .then(response => response.json())
    .then(data => displayForecast(data))
    .catch(error => {
      console.error(error);
      alert("Error fetching weather data.");
    });
}

// Fetch weather by coordinates
function fetchWeatherByCoords(lat, lon) {
  const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(currentURL)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      return fetch(forecastURL);
    })
    .then(response => response.json())
    .then(data => displayForecast(data))
    .catch(error => {
      console.error(error);
      alert("Error fetching weather data.");
    });
}

// Display current weather
function displayCurrentWeather(data) {
  if (!data || data.cod !== 200) {
    document.getElementById("weatherResult").innerHTML = "<p>Weather data not found.</p>";
    return;
  }
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  const html = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p><img src="${iconUrl}" alt="${data.weather[0].description} icon"/> ${data.weather[0].description}</p>
    <p>🌡️ Temp: ${data.main.temp}°C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬️ Wind: ${data.wind.speed} m/s</p>
  `;
  document.getElementById("weatherResult").innerHTML = html;
}

// Display 5-day forecast
function displayForecast(data) {
  if (!data || data.cod !== "200") {
    document.getElementById("forecastWeather").innerHTML = "<p>Forecast data not available.</p>";
    return;
  }

  let html = "<div class='forecast-grid'>";
  const forecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  forecasts.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateStr = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    }).format(date);
    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

    html += `
      <div class="forecast-card">
        <p><strong>${dateStr}</strong></p>
        <img src="${iconUrl}" alt="${item.weather[0].description} icon"/>
        <p>${item.weather[0].main}</p>
        <p>🌡️ ${item.main.temp}°C</p>
        <p>💧 ${item.main.humidity}%</p>
      </div>
    `;
  });

  html += "</div>";
  document.getElementById("forecastWeather").innerHTML = html;
}

// Delete record
function deleteRecord(id) {
  if (!confirm("Are you sure you want to delete this record?")) return;

  fetch(`http://localhost:5000/api/weather/${id}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(() => {
      alert("Record deleted.");
      showRecordsBtn.click();
    })
    .catch(err => {
      console.error(err);
      alert("Error deleting record.");
    });
}

// Edit record (date range)
function editRecord(id) {
  const newFrom = prompt("Enter new start date (YYYY-MM-DD):");
  const newTo = prompt("Enter new end date (YYYY-MM-DD):");

  if (!newFrom || !newTo || new Date(newFrom) > new Date(newTo)) {
    alert("Invalid date range.");
    return;
  }

  fetch(`http://localhost:5000/api/weather/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dateRange: { from: newFrom, to: newTo } }),
  })
    .then(res => res.json())
    .then(() => {
      alert("Record updated.");
      showRecordsBtn.click();
    })
    .catch(err => {
      console.error(err);
      alert("Error updating record.");
    });
}