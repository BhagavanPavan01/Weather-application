// JavaScript will be placed here
document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const themeToggleBtn = document.getElementById('themeToggle');
  const unitToggleBtn = document.getElementById('toggleUnit');
  const searchForm = document.getElementById('searchForm');
  const cityInput = document.getElementById('cityInput');
  const weatherLocation = document.querySelector('.weather-location');
  const weatherTemp = document.querySelector('.weather-temp');
  const weatherIcon = document.querySelector('.weather-icon');
  const weatherDesc = document.querySelector('.weather-desc');
  const weatherDate = document.querySelector('.weather-date');
  const feelsLike = document.querySelector('.detail-item:nth-child(1) .detail-value');
  const humidity = document.querySelector('.detail-item:nth-child(2) .detail-value');
  const windSpeed = document.querySelector('.detail-item:nth-child(3) .detail-value');
  const pressure = document.querySelector('.detail-item:nth-child(4) .detail-value');
  const visibility = document.querySelector('.detail-item:nth-child(5) .detail-value');
  const sunrise = document.querySelector('.detail-item:nth-child(6) .detail-value');
  const forecastItems = document.querySelectorAll('.forecast-item');

  // State variables
  let isCelsius = true;
  let currentWeather = {
    temp: 24,
    feelsLike: 26,
    humidity: 65,
    windSpeed: 12,
    pressure: 1012,
    visibility: 10,
    sunrise: '06:12 AM',
    condition: 'Clear',
    icon: '01d'
  };

  // Forecast data
  const forecastData = [
    { day: 'Tue', temp: 25, condition: 'Partly cloudy', icon: '02d' },
    { day: 'Wed', temp: 23, condition: 'Cloudy', icon: '03d' },
    { day: 'Thu', temp: 20, condition: 'Showers', icon: '09d' },
    { day: 'Fri', temp: 18, condition: 'Rain', icon: '10d' },
    { day: 'Sat', temp: 22, condition: 'Clear', icon: '01d' }
  ];

  // Initialize the app
  function initApp() {
    updateDateTime();
    updateWeatherUI();
    updateForecastUI();
    createWeatherAnimation(currentWeather.condition);

    // Set interval to update time every minute
    setInterval(updateDateTime, 60000);
  }

  // Update date and time display
  function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    weatherDate.textContent = now.toLocaleDateString('en-US', options);
  }

  // Update main weather UI
  function updateWeatherUI() {
    const temp = isCelsius ? currentWeather.temp : celsiusToFahrenheit(currentWeather.temp);
    const feels = isCelsius ? currentWeather.feelsLike : celsiusToFahrenheit(currentWeather.feelsLike);
    const wind = isCelsius ? currentWeather.windSpeed : kmhToMph(currentWeather.windSpeed);
    const unit = isCelsius ? '°C' : '°F';
    const speedUnit = isCelsius ? 'km/h' : 'mph';

    weatherTemp.innerHTML = `${Math.round(temp)}<span>${unit}</span>`;
    feelsLike.textContent = `${Math.round(feels)}${unit}`;
    humidity.textContent = `${currentWeather.humidity}%`;
    windSpeed.textContent = `${Math.round(wind)} ${speedUnit}`;
    pressure.textContent = `${currentWeather.pressure} hPa`;
    visibility.textContent = `${currentWeather.visibility} km`;
    sunrise.textContent = currentWeather.sunrise;
    weatherDesc.textContent = currentWeather.condition;
    weatherIcon.src = `https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;
    weatherIcon.alt = currentWeather.condition;
  }

  // Update forecast UI
  function updateForecastUI() {
    forecastItems.forEach((item, index) => {
      const data = forecastData[index];
      const temp = isCelsius ? data.temp : celsiusToFahrenheit(data.temp);

      item.querySelector('.forecast-day').textContent = data.day;
      item.querySelector('.forecast-temp').textContent = `${Math.round(temp)}${isCelsius ? '°C' : '°F'}`;
      item.querySelector('.forecast-icon').src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
      item.querySelector('.forecast-icon').alt = data.condition;
    });
  }

  // Create weather animation based on condition
  function createWeatherAnimation(condition) {
    const animationContainer = document.querySelector('.weather-animation');

    // Clear existing animations except sun
    const sun = document.querySelector('.sun');
    animationContainer.innerHTML = '';
    if (sun) animationContainer.appendChild(sun);

    // Add animations based on weather condition
    if (condition.toLowerCase().includes('rain')) {
      createRainAnimation();
    } else if (condition.toLowerCase().includes('cloud')) {
      createCloudAnimation();
    } else if (condition.toLowerCase().includes('snow')) {
      createSnowAnimation();
    }
  }

  // Create rain animation
  function createRainAnimation() {
    const animationContainer = document.querySelector('.weather-animation');

    for (let i = 0; i < 50; i++) {
      const rain = document.createElement('div');
      rain.className = 'rain';
      rain.style.left = `${Math.random() * 100}%`;
      rain.style.top = `${Math.random() * 100}%`;
      rain.style.height = `${10 + Math.random() * 20}px`;
      rain.style.animationDuration = `${0.5 + Math.random() * 1.5}s`;
      rain.style.animationDelay = `${Math.random() * 2}s`;
      animationContainer.appendChild(rain);
    }
  }

  // Create cloud animation
  function createCloudAnimation() {
    const animationContainer = document.querySelector('.weather-animation');

    for (let i = 0; i < 5; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      cloud.style.width = `${50 + Math.random() * 100}px`;
      cloud.style.height = `${30 + Math.random() * 50}px`;
      cloud.style.left = `${Math.random() * 100}%`;
      cloud.style.top = `${10 + Math.random() * 30}%`;
      cloud.style.opacity = `${0.5 + Math.random() * 0.3}`;
      animationContainer.appendChild(cloud);
    }
  }

  // Create snow animation
  function createSnowAnimation() {
    const animationContainer = document.querySelector('.weather-animation');

    for (let i = 0; i < 30; i++) {
      const snow = document.createElement('div');
      snow.className = 'snow';
      snow.style.left = `${Math.random() * 100}%`;
      snow.style.top = `${Math.random() * 100}%`;
      snow.style.width = `${3 + Math.random() * 4}px`;
      snow.style.height = snow.style.width;
      snow.style.animationDuration = `${5 + Math.random() * 10}s`;
      snow.style.animationDelay = `${Math.random() * 5}s`;
      animationContainer.appendChild(snow);
    }
  }

  // Unit conversion functions
  function celsiusToFahrenheit(c) {
    return (c * 9 / 5) + 32;
  }

  function kmhToMph(kmh) {
    return kmh * 0.621371;
  }

  // Generate random weather data
  function generateRandomWeather() {
    const conditions = ['Clear', 'Partly cloudy', 'Cloudy', 'Rain', 'Thunderstorm', 'Snow'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const icons = {
      'Clear': '01d',
      'Partly cloudy': '02d',
      'Cloudy': '03d',
      'Rain': '10d',
      'Thunderstorm': '11d',
      'Snow': '13d'
    };

    currentWeather = {
      temp: Math.floor(15 + Math.random() * 20),
      feelsLike: Math.floor(15 + Math.random() * 22),
      humidity: Math.floor(30 + Math.random() * 70),
      windSpeed: Math.floor(5 + Math.random() * 20),
      pressure: Math.floor(990 + Math.random() * 40),
      visibility: Math.floor(5 + Math.random() * 15),
      sunrise: `${5 + Math.floor(Math.random() * 2)}:${Math.floor(10 + Math.random() * 50)} AM`,
      condition: randomCondition,
      icon: icons[randomCondition]
    };

    // Update forecast with random but consistent data
    for (let i = 0; i < forecastData.length; i++) {
      forecastData[i] = {
        day: forecastData[i].day,
        temp: currentWeather.temp + Math.floor(-5 + Math.random() * 10),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        icon: icons[conditions[Math.floor(Math.random() * conditions.length)]]
      };
    }

    updateWeatherUI();
    updateForecastUI();
    createWeatherAnimation(currentWeather.condition);
  }

  // Event Listeners
  themeToggleBtn.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
  });

  unitToggleBtn.addEventListener('click', function () {
    isCelsius = !isCelsius;
    this.textContent = isCelsius ? '°C/°F' : '°F/°C';
    updateWeatherUI();
    updateForecastUI();
  });

  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
      weatherLocation.textContent = `${city}`;
      generateRandomWeather();
      cityInput.value = '';
    }
  });

  // Initialize the app
  initApp();

  // Simulate API call with random data every 30 seconds
  setInterval(generateRandomWeather, 30000);
});