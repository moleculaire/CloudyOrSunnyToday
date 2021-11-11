// --- Current date and time for search section --- //
function formatDateTime(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  let fetchDateTime = document.querySelector("#show-day-time");
  fetchDateTime.innerText = `${day} ${hours}:${minutes}`;
}

formatDateTime(new Date());

// --- Formatting Days for 6 days Forecast section --- //

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[day];
}

// --- Getting City input from Search Form --- //
function searchCity(event) {
  event.preventDefault();
  let citySubmission = document.querySelector("#city-input").value;
  getWeatherData(citySubmission);
  formatDateTime(new Date());
}

let searchForm = document.querySelector("#search-city-form");
searchForm.addEventListener("submit", searchCity);

// --- Getting weather Data from City search from Open Weather with Axios --- //

function getWeatherData(city) {
  let apiKey = "d625786419899cc1afc3fc85979c669b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}

// --- Getting city and temperature data from response, replacing values in HTML --- //

function showTemperature(response) {
  // selecting Elements from HTML
  let city = document.querySelector("#show-city");
  let country = document.querySelector("#show-country");
  let temperature = document.querySelector("#current-degrees");
  let description = document.querySelector("#weather-description");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind-speed");
  let weatherIcon = document.querySelector("#icon");

  // --- Convert country abbreviation to full name passing in values from API --- //
  let intlName = new Intl.DisplayNames(["en"], { type: "region" });
  let fullCountry = intlName.of(response.data.sys.country);
  // --- End convert country abbrevation --- //

  // --- Storing Celsius Temperature for later Fahrenheit conversion --- //
  celsiusTemperature = response.data.main.temp;

  coordinates = response.data.coord;

  // --- Replacing content with information from API on selected elements --- //
  city.innerText = response.data.name;
  country.innerText = `, ${fullCountry}`;
  temperature.innerText = Math.round(response.data.main.temp);
  description.innerText = response.data.weather[0].description;
  humidity.innerText = response.data.main.humidity;
  wind.innerText = Math.round(response.data.wind.speed);
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);
  getForecastData(coordinates);
  clearSearch();
}

// --- Reset input field when search was performed --- //

function clearSearch() {
  document.getElementById("city-input").value = "";
}

// --- Getting current weather for position when pressing "Current" button --- //
function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(fetchPositionData);
}

function fetchPositionData(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiKey = "d625786419899cc1afc3fc85979c669b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

let currentPosition = document.querySelector("#current-button");
currentPosition.addEventListener("click", getPosition);

// --- Getting Forecast from received WeatherData Coordinates for Celsius and Fahrenheit --- //

function getForecastData(coordinates) {
  let apiKey = "d625786419899cc1afc3fc85979c669b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function getForecastDataFahrenheit(coordinates) {
  let apiKey = "d625786419899cc1afc3fc85979c669b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

// --- Display Forecast for the coming days --- //

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
                <div class="weather-forecast-date">${formatDay(
                  forecastDay.dt
                )}</div>
                <img
                  src="https://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }@2x.png"
                  alt=""
                  width="64px"
                />
                <div class="weather-forecast-temperatures">
                  <span class="weather-forecast-temperature-max">${Math.round(
                    forecastDay.temp.max
                  )}°</span>
                  <span class="weather-forecast-temperature-min">${Math.round(
                    forecastDay.temp.min
                  )}°</span>
                </div>
              </div>
            `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// --- Handle Unit conversion Celsius to Fahrenheit --- //

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#current-degrees");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerText = Math.round(fahrenheitTemperature);
  getForecastDataFahrenheit(coordinates);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#current-degrees");
  temperatureElement.innerText = Math.round(celsiusTemperature);
  getForecastData(coordinates);
}

let celsiusTemperature = null;
let coordinates = null;

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

getWeatherData("Zürich");

// --- Getting data for selected cities in city list on top --- //

function setCities() {
  let cities = ["bern", "zurich", "geneve", "lugano", "basel"];
  for (city of cities) {
    document.querySelector(`#${city}`).addEventListener("click", setCity);
  }
}

setCities();

function setCity(event) {
  event.preventDefault();
  let defineCity = event.target.innerText;
  getWeatherData(defineCity);
}

/*
bern or zurich etc to result in let bern = document.querySelector("#bern");
bern.addEventListener("click", setCity); 
without having to replicate variables
*/
