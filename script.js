const apiKey = "d2220c37f10b16e252e8b20937970f19";
let cities = {};

document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("addButton");
  addButton.addEventListener("click", addCity);
});

async function addCity() {
  const cityInput = document.getElementById("cityInput");
  const cityName = cityInput.value.trim();

  if (cityName === "") {
    alert("Please enter a city name.");
    return;
  }

  if (cities.hasOwnProperty(cityName)) {
    alert("City already added.");
    return;
  }

  try {
    const data = await fetchWeather(cityName);
    cities[cityName] = data;
    updateWeatherCards();
  } catch (error) {
    console.error("Error adding city:", error);
    alert("Failed to fetch weather data for the city. Please try again.");
  }

  cityInput.value = ""; // Clear the input field after adding the city
}

async function fetchWeather(cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  if (data.cod !== "404") {
    return data;
  } else {
    throw new Error("City not found.");
  }
}

function updateWeatherCards() {
  const weatherCardsContainer = document.getElementById("weatherCards");
  weatherCardsContainer.innerHTML = "";

  const sortedCities = Object.keys(cities).sort(
    (a, b) => getTemperature(a) - getTemperature(b)
  );

  sortedCities.forEach((city) => {
    const weatherCard = document.createElement("div");
    weatherCard.className = "weather-card";

    const temperature = getTemperature(city);
    const weatherCondition = getWeatherCondition(city);
    const iconUrl = getWeatherIconUrl(city);
    const humidity = getHumidity(city);
    const pressure = getPressure(city);
    const windSpeed = getWindSpeed(city);

    weatherCard.innerHTML = `
            <img src="${iconUrl}" alt="${weatherCondition}">
            <h2>${city}</h2>
            <p>Temperature: ${temperature}&deg;C</p>
            <p>Condition: ${weatherCondition}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Pressure: ${pressure} hPa</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;

    weatherCardsContainer.appendChild(weatherCard);
  });
}

function getTemperature(city) {
  return cities[city].main.temp;
}

function getWeatherCondition(city) {
  return cities[city].weather[0].main;
}

function getWeatherIconUrl(city) {
  const iconCode = cities[city].weather[0].icon;
  return `http://openweathermap.org/img/w/${iconCode}.png`;
}

function getHumidity(city) {
  return cities[city].main.humidity;
}

function getPressure(city) {
  return cities[city].main.pressure;
}

function getWindSpeed(city) {
  return cities[city].wind.speed;
}
