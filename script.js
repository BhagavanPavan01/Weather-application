// Config keys (replace with your actual keys)
    const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';

    // DOM Elements
    const searchForm = document.getElementById('searchForm');
    const cityInput = document.getElementById('cityInput');
    const currentWeather = document.getElementById('currentWeather');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const cityNameEl = document.getElementById('cityName');
    const weatherIconEl = document.getElementById('weatherIcon');
    const tempValueEl = document.getElementById('tempValue');
    const tempUnitEl = document.getElementById('tempUnit');
    const weatherDescriptionEl = document.getElementById('weatherDescription');
    const feelsLikeEl = document.getElementById('feelsLike');
    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('windSpeed');
    const lastUpdatedEl = document.getElementById('lastUpdated');
    const themeToggleBtn = document.getElementById('themeToggle');
    const toggleUnitBtn = document.getElementById('toggleUnit');

    let isCelsius = true;
    let autocomplete;

    function showLoading(show) {
      if (show) {
        loadingSpinner.classList.add('show');
      } else {
        loadingSpinner.classList.remove('show');
      }
    }

    function showError(message) {
      errorMessage.textContent = message;
      errorMessage.classList.add('show');
      currentWeather.classList.remove('show');
    }

    function clearError() {
      errorMessage.classList.remove('show');
      errorMessage.textContent = '';
    }

    function updateBackground(weatherMain) {
      // Remove all weather background classes first
      document.body.classList.remove(
        'clear-sky',
        'few-clouds',
        'rain',
        'thunderstorm',
        'snow',
        'mist',
      );

      // Map weather main to our CSS classes
      const weatherMap = {
        Clear: 'clear-sky',
        Clouds: 'few-clouds',
        Rain: 'rain',
        Drizzle: 'rain',
        Thunderstorm: 'thunderstorm',
        Snow: 'snow',
        Mist: 'mist',
        Smoke: 'mist',
        Haze: 'mist',
        Dust: 'mist',
        Fog: 'mist',
        Sand: 'mist',
        Ash: 'mist',
        Squall: 'mist',
        Tornado: 'thunderstorm',
      };

      const className = weatherMap[weatherMain] || 'clear-sky';
      document.body.classList.add(className);
    }

    function updateWeatherUI(data) {
      clearError();
      cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
      weatherDescriptionEl.textContent = data.weather[0].description;
      weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
      weatherIconEl.alt = data.weather[0].description;

      // Show temperature in selected unit
      let temp = data.main.temp;
      let feelsLike = data.main.feels_like;
      let windSpeed = data.wind.speed;
      let humidity = data.main.humidity;

      if (!isCelsius) {
        temp = (temp * 9) / 5 + 32;
        feelsLike = (feelsLike * 9) / 5 + 32;
        windSpeed = windSpeed * 2.237; // m/s to mph
      }

      tempValueEl.textContent = Math.round(temp);
      tempUnitEl.textContent = isCelsius ? '°C' : '°F';
      feelsLikeEl.textContent = `${Math.round(feelsLike)}${isCelsius ? '°C' : '°F'}`;
      humidityEl.textContent = `${humidity}%`;
      windSpeedEl.textContent = `${windSpeed.toFixed(1)} ${isCelsius ? 'm/s' : 'mph'}`;

      // Last updated time
      const now = new Date();
      lastUpdatedEl.textContent = `Last updated: ${now.toLocaleTimeString()}`;

      // Fade in weather card
      currentWeather.classList.remove('show');
      setTimeout(() => currentWeather.classList.add('show'), 50);

      // Update background
      updateBackground(data.weather[0].main);
    }

    async function fetchWeatherByCoords(lat, lon) {
      showLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error('Weather data not found');
        const data = await response.json();
        showLoading(false);
        updateWeatherUI(data);
      } catch (error) {
        showLoading(false);
        showError('Could not fetch weather data. Try again.');
        console.error(error);
      }
    }

    async function fetchWeatherByCity(city) {
      showLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
          )}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        showLoading(false);
        updateWeatherUI(data);
      } catch (error) {
        showLoading(false);
        showError('City not found or error fetching data.');
        console.error(error);
      }
    }

    // Initialize Google Places Autocomplete restricted to India
    function initAutocomplete() {
      autocomplete = new google.maps.places.Autocomplete(cityInput, {
        componentRestrictions: { country: 'in' },
        fields: ['name', 'geometry'],
        types: ['(cities)'],
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          showError('Please select a valid place from suggestions.');
          return;
        }
        clearError();
        fetchWeatherByCoords(place.geometry.location.lat(), place.geometry.location.lng());
      });
    }

    // Toggle dark mode
    function toggleDarkMode() {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      themeToggleBtn.setAttribute('aria-pressed', isDark);
      themeToggleBtn.innerHTML = isDark
        ? '<i class="fas fa-sun"></i> Light Mode'
        : '<i class="fas fa-moon"></i> Dark Mode';
    }

    // Toggle temperature unit
    function toggleTemperatureUnit() {
      isCelsius = !isCelsius;
      toggleUnitBtn.setAttribute('aria-pressed', !isCelsius);
      toggleUnitBtn.textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';
      // Refresh weather data to update units
      const cityText = cityNameEl.textContent.split(',')[0];
      if (cityText) {
        fetchWeatherByCity(cityText);
      }
    }

    // Event listeners
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const city = cityInput.value.trim();
      if (!city) {
        showError('Please enter a city or place.');
        return;
      }
      clearError();
      fetchWeatherByCity(city);
    });

    themeToggleBtn.addEventListener('click', toggleDarkMode);
    toggleUnitBtn.addEventListener('click', toggleTemperatureUnit);

    // Initialize
    window.onload = () => {
      initAutocomplete();

      // Optional: Get current location weather on load
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          },
          () => {
            // Default to Delhi if geolocation denied
            fetchWeatherByCity('Delhi');
          }
        );
      } else {
        fetchWeatherByCity('Delhi');
      }
    };
