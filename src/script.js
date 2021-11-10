// Display current date and time
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

// Getting City input from Search Form
function searchCity(event) {
  event.preventDefault();
  let citySubmission = document.querySelector("#city-input").value;
  getWeatherData(citySubmission);
  formatDateTime(new Date());
}

let searchForm = document.querySelector("#search-city-form");
searchForm.addEventListener("submit", searchCity);

// Getting weather Data from Open Weather with Axios

function getWeatherData(city) {
  let apiKey = "d625786419899cc1afc3fc85979c669b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}

// Getting city and temperature from response and replacing values in HTML

function showTemperature(response) {
  //console.log(response); => check what we get back
  // selecting Elements from HTML
  let city = document.querySelector("#show-city");
  let country = document.querySelector("#show-country");
  let temperature = document.querySelector("#current-degrees");
  let description = document.querySelector("#weather-description");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind-speed");
  let weatherIcon = document.querySelector("#icon");

  // convert country abbreviation to full name passing in values from API
  let intlName = new Intl.DisplayNames(["en"], { type: "region" });
  let fullCountry = intlName.of(response.data.sys.country);
  // end convert country abbrevation

  // Storing Celsius Temperature for later Fahrenheit conversion
  celsiusTemperature = response.data.main.temp;

  // replacing content with information from API on selected elements
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
  getForecastData(response.data.coord);
}

// Getting current weather for position when pressing "Current" button
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

// Getting Forecast Coordinates out of the received WeatherData

function getForecastData(coordinates) {
  let apiKey = "d625786419899cc1afc3fc85979c669b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// Display Forecast for the coming days

function displayForecast() {
  let forecastElement = document.querySelector("#forecast");

  let days = ["Wen", "Thu", "Fri", "Sat", "Sun", "Mon"];

  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col-2">
                <div class="weather-forecast-date">THU</div>
                <img
                  src="https://openweathermap.org/img/wn/01d@2x.png"
                  alt=""
                  width="64px"
                />
                <div class="weather-forecast-temperatures">
                  <span class="weather-forecast-temperature-max"> 18°</span>
                  <span class="weather-forecast-temperature-min">12°</span>
                </div>
              </div>
            `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// Handle Unit conversion

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#current-degrees");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerText = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#current-degrees");
  temperatureElement.innerText = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

getWeatherData("Zürich");

// Getting data for selected cities in city list on top
function setCity(event) {
  event.preventDefault();
  let defineCity = event.target.innerText;
  getWeatherData(defineCity);
}

let bern = document.querySelector("#bern");
bern.addEventListener("click", setCity);

let zurich = document.querySelector("#zurich");
zurich.addEventListener("click", setCity);

let geneve = document.querySelector("#geneve");
geneve.addEventListener("click", setCity);

let lugano = document.querySelector("#lugano");
lugano.addEventListener("click", setCity);

let basel = document.querySelector("#basel");
basel.addEventListener("click", setCity);

// Feature 3 Display a fake temperature (i.e 17) in Celsius and add a link to convert it to Fahrenheit. When clicking on it, it should convert the temperature to Fahrenheit.
/*
function switchTemperature(event) {
  event.preventDefault();
  let link = document.querySelector("#switch-temp");
  let currentCelsius = document.querySelector("#current-degrees");
  if (link.innerText === "°C" && currentCelsius.innerText === "11°") {
    link.innerText = "°F";
    currentCelsius.innerText = "52°";
  } else {
    link.innerText = "°C";
    currentCelsius.innerText = "11°";
  }
}

let TemperatureLink = document.querySelector("#switch-temp");
TemperatureLink.addEventListener("click", switchTemperature);
*/
