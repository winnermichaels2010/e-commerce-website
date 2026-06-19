# Open-Meteo Weather API Integration

## Overview
Successfully integrated the Open-Meteo weather API into your e-commerce project. This replaces the previous OpenWeatherMap API with a free, no-API-key-required alternative.

## API Details
**API Endpoint:** `https://api.open-meteo.com/v1/forecast`
- Uses latitude/longitude coordinates instead of city names
- Provides current weather with multiple parameters
- No authentication required
- Free tier with generous rate limits

## Files Created/Modified

### 1. New Service File: `src/services/weatherService.js`
Created a comprehensive weather service that:
- **`geocodeCity(cityName)`** - Converts city names to latitude/longitude using Open-Meteo's geocoding API
- **`getWeatherByCoordinates(lat, lon)`** - Fetches current weather data for given coordinates
- **`getWeatherByCity(cityName)`** - Main function that combines geocoding + weather fetching
- **`getWeatherDescription(code)`** - Converts WMO weather codes to readable descriptions
- **`getWeatherEmoji(code)`** - Returns emoji representations for weather conditions

### 2. Updated: `src/pages/Home.jsx`
- Replaced OpenWeatherMap API calls with `getWeatherByCity()` service
- Changed weather icon from OpenWeatherMap images to emoji
- Updated wind speed unit from m/s to km/h (Open-Meteo's default)
- Maintained all existing functionality:
  - City search form
  - Real-time weather display
  - Firebase history storage
  - Recent searches display

### 3. Updated: `src/pages/Dashboard.jsx`
- Changed weather icon display from img to emoji
- Updated wind speed unit to km/h
- Maintained all dashboard features including history management

## Data Provided by Open-Meteo

Current weather data includes:
- **Temperature** (°C)
- **Apparent Temperature** (feels like)
- **Relative Humidity** (%)
- **Wind Speed** (km/h)
- **Weather Description** (decoded from WMO weather codes)
- **Weather Emoji** (visual representation)

## Benefits

✅ **No API Key Required** - Open-Meteo is completely free with no registration
✅ **Reliable** - Excellent uptime and consistent data quality
✅ **Better Weather Codes** - WMO standard weather codes with 100 variations
✅ **Automatic Timezone** - Returns local timezone for each location
✅ **Seamless Integration** - Drop-in replacement for existing weather functionality

## Usage Example

```javascript
import { getWeatherByCity } from './services/weatherService';

// Search for weather by city name
try {
  const weather = await getWeatherByCity('London');
  console.log(`${weather.temperature}°C in ${weather.city}`);
  console.log(`Feels like ${weather.feelsLike}°C ${weather.emoji}`);
} catch (error) {
  console.error('Weather fetch failed:', error.message);
}
```

## Environment Variables

No environment variables required! The new integration doesn't need API keys since Open-Meteo offers free access.

You can remove `VITE_WEATHER_API_KEY` from your `.env` file if it was only used for OpenWeatherMap.

## Testing the Integration

1. Start your dev server: `npm run dev`
2. Navigate to the Home page
3. Search for any city (e.g., "Lagos", "Tokyo", "New York")
4. Weather data with emoji will display
5. If logged in, searches are automatically saved to Firebase

## Weather Codes Reference

The service includes 100 WMO weather codes with descriptions and emojis:
- 0: Clear sky ☀️
- 1-3: Cloudy ⛅☁️
- 45-48: Fog 🌫️
- 51-65: Rain 🌧️⛈️
- 71-77: Snow ❄️
- 80-82: Rain showers 🌧️⛈️
- 85-86: Snow showers ❄️
- 95-99: Thunderstorms ⛈️
