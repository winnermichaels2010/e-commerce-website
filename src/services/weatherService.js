/**
 * Weather Service using Open-Meteo API
 * Documentation: https://open-meteo.com/en/docs
 */

// Geocoding API to convert city name to coordinates
async function geocodeCity(cityName) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        cityName
      )}&count=1&language=en&format=json`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('City not found');
    }

    const result = data.results[0];
    return {
      latitude: result.latitude,
      longitude: result.longitude,
      city: result.name,
      country: result.country,
      admin1: result.admin1 || '',
    };
  } catch (error) {
    throw new Error(`Failed to geocode city: ${error.message}`);
  }
}

// Get weather data from Open-Meteo API
async function getWeatherByCoordinates(latitude, longitude) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&timezone=auto`
    );
    const data = await response.json();

    if (!data.current) {
      throw new Error('Failed to fetch weather data');
    }

    const current = data.current;

    // Convert WMO weather codes to descriptions
    const weatherDescription = getWeatherDescription(current.weather_code);

    return {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      description: weatherDescription,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      weatherCode: current.weather_code,
      timezone: data.timezone,
    };
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
}

// Convert WMO weather codes to descriptions and emojis
function getWeatherDescription(code) {
  const weatherCodes = {
    0: { text: 'Clear sky', emoji: '☀️' },
    1: { text: 'Mainly clear', emoji: '🌤️' },
    2: { text: 'Partly cloudy', emoji: '⛅' },
    3: { text: 'Overcast', emoji: '☁️' },
    45: { text: 'Foggy', emoji: '🌫️' },
    48: { text: 'Depositing rime fog', emoji: '🌫️' },
    51: { text: 'Light drizzle', emoji: '🌦️' },
    53: { text: 'Moderate drizzle', emoji: '🌧️' },
    55: { text: 'Dense drizzle', emoji: '🌧️' },
    61: { text: 'Slight rain', emoji: '🌧️' },
    63: { text: 'Moderate rain', emoji: '🌧️' },
    65: { text: 'Heavy rain', emoji: '⛈️' },
    71: { text: 'Slight snow', emoji: '❄️' },
    73: { text: 'Moderate snow', emoji: '❄️' },
    75: { text: 'Heavy snow', emoji: '❄️' },
    77: { text: 'Snow grains', emoji: '❄️' },
    80: { text: 'Slight rain showers', emoji: '🌧️' },
    81: { text: 'Moderate rain showers', emoji: '⛈️' },
    82: { text: 'Violent rain showers', emoji: '⛈️' },
    85: { text: 'Slight snow showers', emoji: '❄️' },
    86: { text: 'Heavy snow showers', emoji: '❄️' },
    95: { text: 'Thunderstorm', emoji: '⛈️' },
    96: { text: 'Thunderstorm with slight hail', emoji: '⛈️' },
    99: { text: 'Thunderstorm with heavy hail', emoji: '⛈️' },
  };

  return weatherCodes[code]?.text || 'Unknown';
}

// Get weather emoji based on weather code
function getWeatherEmoji(code) {
  const weatherCodes = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌦️',
    53: '🌧️',
    55: '🌧️',
    61: '🌧️',
    63: '🌧️',
    65: '⛈️',
    71: '❄️',
    73: '❄️',
    75: '❄️',
    77: '❄️',
    80: '🌧️',
    81: '⛈️',
    82: '⛈️',
    85: '❄️',
    86: '❄️',
    95: '⛈️',
    96: '⛈️',
    99: '⛈️',
  };

  return weatherCodes[code] || '🌡️';
}

// Main function to get weather by city name
async function getWeatherByCity(cityName) {
  try {
    // First geocode the city to get coordinates
    const geoData = await geocodeCity(cityName);

    // Then fetch weather for those coordinates
    const weatherData = await getWeatherByCoordinates(
      geoData.latitude,
      geoData.longitude
    );

    // Combine location and weather data
    return {
      city: geoData.city,
      country: geoData.country,
      admin1: geoData.admin1,
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      ...weatherData,
      emoji: getWeatherEmoji(weatherData.weatherCode),
    };
  } catch (error) {
    throw error;
  }
}

export {
  getWeatherByCity,
  getWeatherByCoordinates,
  geocodeCity,
  getWeatherDescription,
  getWeatherEmoji,
};
