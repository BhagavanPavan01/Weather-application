document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const themeToggleBtn = document.getElementById('themeToggle');
  const unitToggleBtn = document.getElementById('toggleUnit');
  const locationBtn = document.getElementById('locationBtn');
  const searchForm = document.getElementById('searchForm');
  const cityInput = document.getElementById('cityInput');
  const saveLocationBtn = document.getElementById('saveLocation');
  const compareBtn = document.getElementById('compareBtn');
  
  // Weather display elements
  const weatherLocation = document.querySelector('.weather-location');
  const weatherTemp = document.querySelector('.weather-temp');
  const weatherIcon = document.querySelector('.weather-icon');
  const weatherDesc = document.querySelector('.weather-desc');
  const weatherDate = document.querySelector('.weather-date');
  
  // Detail elements
  const feelsLike = document.querySelector('.detail-item:nth-child(1) .detail-value');
  const humidity = document.querySelector('.detail-item:nth-child(2) .detail-value');
  const windSpeed = document.querySelector('.detail-item:nth-child(3) .detail-value');
  const pressure = document.querySelector('.detail-item:nth-child(4) .detail-value');
  const visibility = document.querySelector('.detail-item:nth-child(5) .detail-value');
  const sunrise = document.querySelector('.detail-item:nth-child(6) .detail-value');
  const sunset = document.querySelector('.detail-item:nth-child(7) .detail-value');
  const precipitation = document.querySelector('.detail-item:nth-child(8) .detail-value');
  
  // New elements
  const hourlyContainer = document.querySelector('.hourly-scroll');
  const uvValue = document.querySelector('.uv-value');
  const uvSegments = document.querySelectorAll('.uv-segment');
  const temperatureChartCtx = document.getElementById('temperatureChart').getContext('2d');
  
  // State variables
  let isCelsius = true;
  let currentWeather = {
    temp: 24,
    feelsLike: 26,
    high: 26,
    low: 18,
    humidity: 65,
    windSpeed: 12,
    pressure: 1012,
    visibility: 10,
    sunrise: '06:12 AM',
    sunset: '08:45 PM',
    precipitation: 0,
    condition: 'Clear',
    icon: '01d',
    uvIndex: 4.3,
    airQuality: 'Good',
    pollenCount: 'Moderate',
    humidityComfort: 'Comfortable'
  };

  // Forecast data
  const forecastData = [
    { day: 'Tue', date: 'Jun 4', temp: 25, condition: 'Partly Cloudy', icon: '02d', precip: 10 },
    { day: 'Wed', date: 'Jun 5', temp: 23, condition: 'Cloudy', icon: '03d', precip: 20 },
    { day: 'Thu', date: 'Jun 6', temp: 20, condition: 'Showers', icon: '09d', precip: 60 },
    { day: 'Fri', date: 'Jun 7', temp: 18, condition: 'Rain', icon: '10d', precip: 80 },
    { day: 'Sat', date: 'Jun 8', temp: 22, condition: 'Clear', icon: '01d', precip: 0 }
  ];

  // Hourly data
  const hourlyData = [];
  for (let i = 0; i < 24; i++) {
    hourlyData.push({
      time: i <= 12 ? `${i} AM` : `${i-12} PM`,
      temp: 18 + Math.sin(i / 24 * Math.PI) * 10,
      icon: i > 6 && i < 18 ? '01d' : '01n',
      precip: i > 12 && i < 15 ? 30 : 0
    });
  }

  // Chart instance
  let temperatureChart;

  // Initialize the app
  function initApp() {
    updateDateTime();
    updateWeatherUI();
    updateForecastUI();
    updateHourlyUI();
    updateUVIndex();
    createWeatherAnimation(currentWeather.condition);
    initTemperatureChart();
    
    // Set interval to update time every minute
    setInterval(updateDateTime, 60000);
  }

  // Update date and time display
  function updateDateTime() {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    weatherDate.textContent = now.toLocaleDateString('en-US', options);
  }

  // Update main weather UI
  function updateWeatherUI() {
    const temp = isCelsius ? currentWeather.temp : celsiusToFahrenheit(currentWeather.temp);
    const feels = isCelsius ? currentWeather.feelsLike : celsiusToFahrenheit(currentWeather.feelsLike);
    const high = isCelsius ? currentWeather.high : celsiusToFahrenheit(currentWeather.high);
    const low = isCelsius ? currentWeather.low : celsiusToFahrenheit(currentWeather.low);
    const wind = isCelsius ? currentWeather.windSpeed : kmhToMph(currentWeather.windSpeed);
    const unit = isCelsius ? '°C' : '°F';
    const speedUnit = isCelsius ? 'km/h' : 'mph';

    weatherTemp.innerHTML = `${Math.round(temp)}<span>${unit}</span>`;
    feelsLike.textContent = `${Math.round(feels)}${unit}`;
    document.querySelector('.extra-item:nth-child(1)').innerHTML = `<i class="fas fa-arrow-up"></i> H:${Math.round(high)}${unit}`;
    document.querySelector('.extra-item:nth-child(2)').innerHTML = `<i class="fas fa-arrow-down"></i> L:${Math.round(low)}${unit}`;
    humidity.textContent = `${currentWeather.humidity}%`;
    windSpeed.textContent = `${Math.round(wind)} ${speedUnit}`;
    pressure.textContent = `${currentWeather.pressure} hPa`;
    visibility.textContent = `${currentWeather.visibility} km`;
    sunrise.textContent = currentWeather.sunrise;
    sunset.textContent = currentWeather.sunset;
    precipitation.textContent = `${currentWeather.precipitation} mm`;
    document.querySelector('.extra-item:nth-child(3)').innerHTML = `<i class="fas fa-umbrella"></i> ${currentWeather.precipitation}%`;
    weatherDesc.textContent = currentWeather.condition;
    weatherIcon.src = `https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;
    weatherIcon.alt = currentWeather.condition;
  }

  // Update forecast UI
  function updateForecastUI() {
    const forecastItems = document.querySelectorAll('.forecast-item');
    
    forecastItems.forEach((item, index) => {
      const data = forecastData[index];
      const temp = isCelsius ? data.temp : celsiusToFahrenheit(data.temp);

      item.querySelector('.forecast-day').textContent = data.day;
      item.querySelector('.forecast-date').textContent = data.date;
      item.querySelector('.forecast-temp').textContent = `${Math.round(temp)}${isCelsius ? '°C' : '°F'}`;
      item.querySelector('.forecast-desc').textContent = data.condition;
      item.querySelector('.forecast-icon').src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
      item.querySelector('.forecast-icon').alt = data.condition;
      item.querySelector('.forecast-precip').innerHTML = `<i class="fas fa-umbrella"></i> ${data.precip}%`;
    });
  }

  // Update hourly forecast UI
  function updateHourlyUI() {
    hourlyContainer.innerHTML = '';
    
    hourlyData.forEach(hour => {
      const temp = isCelsius ? hour.temp : celsiusToFahrenheit(hour.temp);
      const hourElement = document.createElement('div');
      hourElement.className = 'hourly-item';
      hourElement.innerHTML = `
        <div class="hourly-time">${hour.time}</div>
        <img src="https://openweathermap.org/img/wn/${hour.icon}@2x.png" alt="Weather" class="hourly-icon">
        <div class="hourly-temp">${Math.round(temp)}${isCelsius ? '°C' : '°F'}</div>
        ${hour.precip > 0 ? `<div class="hourly-precip">${hour.precip}%</div>` : ''}
      `;
      hourlyContainer.appendChild(hourElement);
    });
  }

  // Update UV Index display
  function updateUVIndex() {
    const uv = currentWeather.uvIndex;
    uvValue.textContent = uv.toFixed(1);
    
    // Set UV color based on level
    let uvColor = '';
    if (uv < 3) uvColor = 'var(--uv-low)';
    else if (uv < 6) uvColor = 'var(--uv-moderate)';
    else if (uv < 8) uvColor = 'var(--uv-high)';
    else if (uv < 11) uvColor = 'var(--uv-very-high)';
    else uvColor = 'var(--uv-extreme)';
    
    uvValue.style.color = uvColor;
    
    // Update active segments
    uvSegments.forEach((segment, index) => {
      const segmentMax = [2, 5, 7, 10, 11][index];
      segment.classList.toggle('active', uv >= segmentMax);
    });
  }

  // Initialize temperature chart
  function initTemperatureChart() {
    const labels = hourlyData.map((_, i) => `${i}:00`);
    const temps = hourlyData.map(h => isCelsius ? h.temp : celsiusToFahrenheit(h.temp));
    
    temperatureChart = new Chart(temperatureChartCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `Temperature (${isCelsius ? '°C' : '°F'})`,
          data: temps,
          borderColor: '#4361ee',
          backgroundColor: 'rgba(67, 97, 238, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw.toFixed(1)}`;
              }
            }
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: `Temperature (${isCelsius ? '°C' : '°F'})`
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Update temperature chart when units change
  function updateTemperatureChart() {
    const temps = hourlyData.map(h => isCelsius ? h.temp : celsiusToFahrenheit(h.temp));
    temperatureChart.data.datasets[0].data = temps;
    temperatureChart.data.datasets[0].label = `Temperature (${isCelsius ? '°C' : '°F'})`;
    temperatureChart.options.scales.y.title.text = `Temperature (${isCelsius ? '°C' : '°F'})`;
    temperatureChart.update();
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
      high: Math.floor(18 + Math.random() * 10),
      low: Math.floor(10 + Math.random() * 8),
      humidity: Math.floor(30 + Math.random() * 70),
      windSpeed: Math.floor(5 + Math.random() * 20),
      pressure: Math.floor(990 + Math.random() * 40),
      visibility: Math.floor(5 + Math.random() * 15),
      sunrise: `${5 + Math.floor(Math.random() * 2)}:${Math.floor(10 + Math.random() * 50)} AM`,
      sunset: `${6 + Math.floor(Math.random() * 3)}:${Math.floor(10 + Math.random() * 50)} PM`,
      precipitation: Math.floor(Math.random() * 100),
      condition: randomCondition,
      icon: icons[randomCondition],
      uvIndex: (Math.random() * 12).toFixed(1),
      airQuality: ['Good', 'Moderate', 'Poor'][Math.floor(Math.random() * 3)],
      pollenCount: ['Low', 'Moderate', 'High'][Math.floor(Math.random() * 3)],
      humidityComfort: ['Dry', 'Comfortable', 'Humid'][Math.floor(Math.random() * 3)]
    };

    // Update forecast with random but consistent data
    for (let i = 0; i < forecastData.length; i++) {
      forecastData[i] = {
        day: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        date: `Jun ${4 + i}`,
        temp: currentWeather.temp + Math.floor(-5 + Math.random() * 10),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        icon: icons[conditions[Math.floor(Math.random() * conditions.length)]],
        precip: Math.floor(Math.random() * 100)
      };
    }

    // Update hourly data
    for (let i = 0; i < hourlyData.length; i++) {
      hourlyData[i] = {
        time: i <= 12 ? `${i} AM` : `${i-12} PM`,
        temp: currentWeather.low + Math.sin(i / 24 * Math.PI) * (currentWeather.high - currentWeather.low),
        icon: i > 6 && i < 18 ? 
          (randomCondition === 'Clear' ? '01d' : 
           randomCondition === 'Partly cloudy' ? '02d' : 
           randomCondition === 'Cloudy' ? '03d' : 
           randomCondition === 'Rain' ? '10d' : 
           randomCondition === 'Thunderstorm' ? '11d' : '13d') : 
          (randomCondition === 'Clear' ? '01n' : 
           randomCondition === 'Partly cloudy' ? '02n' : 
           randomCondition === 'Cloudy' ? '03n' : 
           randomCondition === 'Rain' ? '10n' : 
           randomCondition === 'Thunderstorm' ? '11n' : '13n'),
        precip: i > 12 && i < 15 ? Math.floor(30 + Math.random() * 70) : 0
      };
    }

    updateWeatherUI();
    updateForecastUI();
    updateHourlyUI();
    updateUVIndex();
    updateTemperatureChart();
    createWeatherAnimation(currentWeather.condition);
    updateHealthIndicators();
  }

  // Update health indicators
  function updateHealthIndicators() {
    // Air Quality
    const airQualityItem = document.querySelector('.health-item:nth-child(1)');
    airQualityItem.className = `health-item ${currentWeather.airQuality.toLowerCase()}`;
    airQualityItem.querySelector('.health-value').textContent = currentWeather.airQuality;
    
    // Pollen Count
    const pollenItem = document.querySelector('.health-item:nth-child(2)');
    pollenItem.className = `health-item ${currentWeather.pollenCount.toLowerCase()}`;
    pollenItem.querySelector('.health-value').textContent = currentWeather.pollenCount;
    
    // Humidity Comfort
    const humidityItem = document.querySelector('.health-item:nth-child(3)');
    humidityItem.className = `health-item ${currentWeather.humidityComfort.toLowerCase()}`;
    humidityItem.querySelector('.health-value').textContent = currentWeather.humidityComfort;
    
    // Update recommendations
    const recommendations = document.querySelector('.health-recommendations ul');
    recommendations.innerHTML = '';
    
    if (currentWeather.airQuality === 'Poor') {
      recommendations.innerHTML += '<li>Limit outdoor activities</li>';
    } else {
      recommendations.innerHTML += '<li>Good day for outdoor exercise</li>';
    }
    
    if (currentWeather.pollenCount === 'High') {
      recommendations.innerHTML += '<li>Pollen levels are high - take precautions</li>';
    } else if (currentWeather.pollenCount === 'Moderate') {
      recommendations.innerHTML += '<li>Pollen may affect allergy sufferers</li>';
    }
    
    if (currentWeather.humidityComfort === 'Humid') {
      recommendations.innerHTML += '<li>High humidity - stay cool and hydrated</li>';
    } else if (currentWeather.humidityComfort === 'Dry') {
      recommendations.innerHTML += '<li>Low humidity - use moisturizer</li>';
    } else {
      recommendations.innerHTML += '<li>Comfortable humidity levels</li>';
    }
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
    updateHourlyUI();
    updateTemperatureChart();
  });

  locationBtn.addEventListener('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          // In a real app, we'd use these coordinates to fetch weather
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          weatherLocation.textContent = "Your Location";
          generateRandomWeather();
        },
        error => {
          alert("Unable to retrieve your location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  });

  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
      weatherLocation.textContent = city;
      generateRandomWeather();
      cityInput.value = '';
    }
  });

  saveLocationBtn.addEventListener('click', function() {
    const city = weatherLocation.textContent;
    if (city && city !== "Your Location") {
      alert(`Location "${city}" saved to favorites!`);
      // In a real app, we'd save to localStorage or a database
    } else {
      alert("No location to save. Please search for a city first.");
    }
  });

  compareBtn.addEventListener('click', function() {
    alert("Comparison feature coming soon!");
    // In a real app, this would open a comparison view
  });

  // Initialize the app
  initApp();

  // Simulate API call with random data every 30 seconds
  setInterval(generateRandomWeather, 30000);
});