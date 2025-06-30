const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

const cityElement = document.querySelector(".city");
const tempElement = document.querySelector(".temp");
const humyElement = document.querySelector(".humidity");
const windElement = document.querySelector(".wind");

async function checkWeather(city) {
  cityElement.classList.add("loading-line-animation");
  tempElement.classList.add("loading-line-animation");
  humyElement.classList.add("loading-line-animation");
  windElement.classList.add("loading-line-animation");
  
  const response = await fetch(`/api/weather?q=${city}`);

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    var data = await response.json();

    cityElement.classList.remove("loading-line-animation");
    tempElement.classList.remove("loading-line-animation");
    humyElement.classList.remove("loading-line-animation");
    windElement.classList.remove("loading-line-animation");
    searchBox.value = "";
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "km/hr";

    if (data.weather[0].main == "Clouds") {
      weatherIcon.src = "images/clouds.png";
    } else if (data.weather[0].main == "Clear") {
      weatherIcon.src = "images/clear.png";
    } else if (data.weather[0].main == "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (data.weather[0].main == "Drizzle") {
      weatherIcon.src = "images/drizzle.png";
    } else if (data.weather[0].main == "Mist") {
      weatherIcon.src = "images/mist.png";
    }
    document.querySelector(".error").style.display = "none";
    document.querySelector(".weather").style.display = "block";
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkWeather(searchBox.value);
  }
});

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const res = await fetch(`/api/geo?lat=${lat}&lon=${lon}`);
          const data = await res.json();

          if (res.ok && data.city) {
            checkWeather(data.city);
          } else {
            console.warn("City not found:", data.error);
          }
        } catch (err) {
          console.error("Failed to fetch city from server:", err);
        }
      },
      (error) => {
        console.warn("User denied geolocation or an error occurred", error);
      }
    );
  }
});
