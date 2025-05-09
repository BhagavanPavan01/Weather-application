// Replace with your actual OpenWeatherMap API key
const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const currentWeather = document.getElementById('currentWeather');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const themeToggle = document.getElementById('themeToggle');
const toggleUnit = document.getElementById('toggleUnit');

// Weather data elements
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const tempValue = document.getElementById('tempValue');
const tempUnit = document.getElementById('tempUnit');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const lastUpdated = document.getElementById('lastUpdated');

// Store original temperature in Celsius for unit conversion
let currentTempC = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
    
    // Set default city or get user's location
    fetchWeatherByCity('London');
});

// Event Listeners
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    }
});

themeToggle.addEventListener('click', toggleTheme);
toggleUnit.addEventListener('click', toggleTemperatureUnit);

// Toggle Theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        localStorage.setItem('darkMode', 'disabled');
    }
    
    // Update background based on current weather
    updateWeatherBackground();
}

// Fetch Weather by City
function fetchWeatherByCity(city) {
    // Show loading spinner
    loadingSpinner.classList.remove('d-none');
    currentWeather.classList.add('d-none');
    errorMessage.classList.add('d-none');
    
    // Fetch data from API
    fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found. Please try another location.');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            showError(error.message);
        });
}

// Display Weather Data
function displayWeatherData(data) {
    // Hide loading spinner and show weather data
    loadingSpinner.classList.add('d-none');
    currentWeather.classList.remove('d-none');
    
    // Store temperature in Celsius for unit conversion
    currentTempC = data.main.temp;
    
    // Update DOM elements
    cityName.textContent = `${data.name}, ${data.sys.country || ''}`;
    tempValue.textContent = Math.round(currentTempC);
    weatherDescription.textContent = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`; // Convert m/s to km/h
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].main;
    
    // Update last updated time
    const now = new Date();
    lastUpdated.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Update background based on weather
    updateWeatherBackground(data.weather[0].main.toLowerCase());
}

// Update Weather Background
function updateWeatherBackground(weatherCondition = '') {
    // Remove all weather background classes
    const weatherClasses = [
        'clear-sky', 'few-clouds', 'scattered-clouds', 'broken-clouds',
        'shower-rain', 'rain', 'thunderstorm', 'snow', 'mist', 'fog', 'haze'
    ];
    
    weatherClasses.forEach(cls => {
        document.body.classList.remove(cls);
    });
    
    // Map OpenWeather conditions to our classes
    const weatherMap = {
        'clear': 'clear-sky',
        'clouds': 'few-clouds',
        'scattered clouds': 'scattered-clouds',
        'broken clouds': 'broken-clouds',
        'shower rain': 'shower-rain',
        'rain': 'rain',
        'thunderstorm': 'thunderstorm',
        'snow': 'snow',
        'mist': 'mist',
        'fog': 'fog',
        'haze': 'haze'
    };
    
    // Add the appropriate class
    if (weatherCondition && weatherMap[weatherCondition]) {
        document.body.classList.add(weatherMap[weatherCondition]);
    } else if (weatherCondition) {
        // Fallback for unknown conditions
        document.body.classList.add('clear-sky');
    }
}

// Show Error Message
function showError(message) {
    loadingSpinner.classList.add('d-none');
    currentWeather.classList.add('d-none');
    errorMessage.classList.remove('d-none');
    document.getElementById('errorText').textContent = message;
}

// Convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Toggle Temperature Unit
function toggleTemperatureUnit() {
    if (tempUnit.textContent === '°C') {
        const fahrenheit = celsiusToFahrenheit(currentTempC);
        tempValue.textContent = Math.round(fahrenheit);
        tempUnit.textContent = '°F';
        feelsLike.textContent = `${Math.round(celsiusToFahrenheit(parseFloat(feelsLike.textContent)))}°F`;
        toggleUnit.textContent = 'Switch to °C';
    } else {
        tempValue.textContent = Math.round(currentTempC);
        tempUnit.textContent = '°C';
        feelsLike.textContent = `${Math.round(parseFloat(feelsLike.textContent) - 32 * 5/9)}°C`;
        toggleUnit.textContent = 'Switch to °F';
    }
}