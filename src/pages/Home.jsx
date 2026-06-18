import { useState, useEffect } from 'react';
import { FiSearch, FiDroplet, FiWind, FiClock } from 'react-icons/fi';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../auth/AuthContext';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export default function Home() {
  const { user } = useAuth();
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Load weather history from Firestore if logged in
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'history'),
      orderBy('searchedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(items);
    });

    return unsubscribe;
  }, [user]);

  async function searchWeather(e) {
    e.preventDefault();
    if (!city.trim()) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch(
        `${BASE_URL}?q=${encodeURIComponent(city.trim())}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setError(data.message || 'City not found');
        setWeather(null);
        setLoading(false);
        return;
      }

      const weatherData = {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        tempMin: Math.round(data.main.temp_min),
        tempMax: Math.round(data.main.temp_max),
      };

      setWeather(weatherData);

      // Save to Firestore if logged in
      if (user) {
        await addDoc(collection(db, 'users', user.uid, 'history'), {
          ...weatherData,
          searchedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      setError('Failed to fetch weather data. Check your API key.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Hero section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Weather <span style={{ color: 'var(--accent-purple)' }}>Forecast</span>
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Search for any city to get current weather conditions
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={searchWeather} className="flex gap-2">
        <div className="relative flex-1">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2"
            size={18}
            style={{ color: 'var(--text-secondary)' }}
          />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name (e.g., London, Tokyo, New York)"
            className="w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none border transition-all"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className=" cursor-pointer px-6 py-3 rounded-xl text-white font-medium text-sm transition-all disabled:opacity-50"
          style={{ background: 'var(--accent-purple)' }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Error message */}
      {error && (
        <div
          className="p-4 rounded-xl text-sm"
          style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
          }}
        >
          {error}
        </div>
      )}

      {/* Weather display */}
      {weather && (
        <div
          className="rounded-2xl p-6 md:p-8 space-y-6 border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* City + temp */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {weather.city}, {weather.country}
              </h2>
              <p className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>
                {weather.description}
              </p>
            </div>
            <div className="text-right">
              <span className="text-5xl font-bold" style={{ color: 'var(--accent-purple)' }}>
                {weather.temperature}°C
              </span>
            </div>
          </div>

          {/* Weather icon */}
          <div className="flex justify-center">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
              alt={weather.description}
              className="w-24 h-24"
            />
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <FiDroplet className="mx-auto mb-1" size={20} style={{ color: 'var(--accent-purple)' }} />
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Humidity</p>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{weather.humidity}%</p>
            </div>
            <div
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <FiWind className="mx-auto mb-1" size={20} style={{ color: 'var(--accent-purple)' }} />
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Wind Speed</p>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{weather.windSpeed} m/s</p>
            </div>
            <div
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Min Temp</p>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{weather.tempMin}°C</p>
            </div>
            <div
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Max Temp</p>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{weather.tempMax}°C</p>
            </div>
          </div>

          {/* Feels like */}
          <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Feels like <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{weather.feelsLike}°C</span>
          </p>
        </div>
      )}

      {/* History section - only shown if logged in and has history */}
      {user && history.length > 0 && (
        <div
          className="rounded-2xl p-6 border space-y-4"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2">
            <FiClock size={18} style={{ color: 'var(--accent-purple)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Recent Searches
            </h3>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl text-sm"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                    alt=""
                    className="w-8 h-8"
                  />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {item.city}, {item.country}
                    </p>
                    <p className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
                <span className="font-bold" style={{ color: 'var(--accent-purple)' }}>
                  {item.temperature}°C
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prompt to sign in for history */}
      {!user && (
        <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          <a href="/login" style={{ color: 'var(--accent-purple)' }} className="underline">
            Sign in
          </a>{' '}
          to save your weather search history
        </p>
      )}
    </div>
  );
}