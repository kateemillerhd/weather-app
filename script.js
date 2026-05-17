const form = document.getElementById("weather-form");
const locationInput = document.getElementById("location");
const loading = document.getElementById("loading");
let currentWeather = null;
let isFarenheit = true;

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const location = locationInput.value;

    loading.textContent = "Loading...";

    try {
        currentWeather = await getWeather(location);
        displayWeather(currentWeather);
    } catch (error) {
        console.error(error);
        weatherResult.innerHTML = `
        <p>Could not find weather data.</p>
        `;
    }

    loading.textContent = "";
});

const toggleBtn = document.getElementById("unit-toggle");

toggleBtn.addEventListener("click", () => {
    isFarenheit = !isFarenheit;
    toggleBtn.textContent = isFarenheit
        ? "Show °C"
        : "Show °F";

    if (currentWeather) {
        displayWeather(currentWeather);
    }
});

function displayWeather(weather) {
    const result = document.getElementById("weather-result");

    let temp = weather.temp;
    let unit =  "°F";

    if (!isFarenheit) {
        temp = ((temp - 32) * 5) / 9;
        temp = temp.toFixed(1);
        unit = "°C";
    }

    result.innerHTML = `
    <h2>${weather.address}</h2>
    <img
        src="icons/${weather.icon}.svg"
        alt="${weather.conditions}"
        class="weather-icon"
    >
    
    <p>Temperature: ${temp}${unit}</p>
    <p>Conditions: ${weather.conditions}</p>
    <p>Humidity: ${weather.humidity}%</p>
    <p>Wind Speed: ${weather.wind} mph</p>
    `;

    setTheme(weather);
    result.style.background = "rgba(255,255,255,0.15)";
    displayForecast(weather.forecast);
}

async function getWeather(location) {
    const apiKey = "H4A8UGQD3FC25944TWK5BJHWT";
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Weather data not found");
    }

    const data = await response.json();

    return simplifyWeather(data);
}

function simplifyWeather(data) {
    return {
        address: data.resolvedAddress,
        temp: data.currentConditions.temp,
        conditions: data.currentConditions.conditions,
        humidity: data.currentConditions.humidity,
        wind: data.currentConditions.windspeed,
        icon: data.currentConditions.icon,
        forecast: data.days.slice(1, 4)
    };
}

function setTheme(weather) {
    const button = document.getElementById("unit-toggle");
    const condition = weather.icon;    

    if (condition.includes("rain")) {
        document.body.style.background = 
        "linear-gradient(to right, #4b79a1, #283e51)";
        

        button.style.background = "#34495e";
        button.style.color = "white";
        button.style.border = "1px solid white";
    }

    else if (condition.includes("clear")) {
        document.body.style.background = 
        "linear-gradient(to right, #fceabb, #f8b500";
        document.body.style.color = "black";

        button.style.background = "#f1c40f";
        button.style.color = "#222";
        button.style.border = "2px solid black";
    }

    else if (condition.includes("snow")) {
        document.body.style.background = 
        "linear-gradient(to right, #e6dada, #274046";

        button.style.background = "white";
        button.style.color = "#2d3436";
        button.style.border = "1px solid #999";
    }

    else if (condition.includes("cloudy")) {
        document.body.style.background = 
        "linear-gradient(to right, #bdc3c7, #2c3e50";
    }

    else {
        document.body.style.background = 
        "linear-gradient(to right, #74ebd5, #acb6e5)";

        button.style.background = "#2d3436";
        button.style.color = "white";
    }
}

function displayForecast(forecast) {
    const forecastContainer = document.getElementById("forecast");

    forecastContainer.innerHTML = "";

    forecast.forEach((day) => {
        let temp = day.temp;
        let unit = "°F";

        if (!isFarenheit) {
            temp = ((temp - 32) * 5) / 9;
            temp = temp.toFixed(1);
            unit = "°C";
        }
        
        const card = document.createElement("div");

        card.classList.add("forecast-card");

        card.innerHTML = `
        <h3>${day.datetime}</h3>
        
        <img
            src="icons/${day.icon}.svg"
            class="forecast-icon"
        >
        
        <p>${day.conditions}</p>
        <p>${temp}${unit}</p>
        `;

        forecastContainer.appendChild(card);
    });
}