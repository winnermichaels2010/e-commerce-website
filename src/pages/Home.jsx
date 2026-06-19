import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiDroplet, FiWind, FiClock, FiThermometer } from 'react-icons/fi';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../auth/AuthContext';
import { getWeatherByCity } from '../services/weatherService';

// Extended list of cities for random selection
const allCities = [
  'New York', 'London', 'Tokyo', 'Sydney', 'Paris', 'Cape Town',
  'Dubai', 'Singapore', 'Hong Kong', 'Bangkok', 'Barcelona', 'Amsterdam',
  'Toronto', 'Mexico City', 'São Paulo', 'Mumbai', 'Delhi', 'Istanbul',
  'Moscow', 'Beijing', 'Shanghai', 'Seoul', 'Los Angeles', 'Chicago',
  'Berlin', 'Rome', 'Madrid', 'Vienna', 'Prague', 'Stockholm'
];

// Function to get random cities
function getRandomCities(count = 6) {
  const shuffled = [...allCities].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [popularWeather, setPopularWeather] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [randomCities] = useState(() => getRandomCities());

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

  useEffect(() => {
    async function loadPopularWeather() {
      try {
        const popularResults = await Promise.all(
          randomCities.map(async (cityName) => {
            const weatherData = await getWeatherByCity(cityName);
            return weatherData;
          })
        );
        setPopularWeather(popularResults);
      } catch (err) {
        console.error('Failed to load popular weather:', err);
      }
    }

    loadPopularWeather();
  }, [randomCities]);

  async function searchWeather(e) {
    e.preventDefault();
    if (!city.trim()) return;

    if (!user) {
      navigate('/login');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const weatherData = await getWeatherByCity(city.trim());

      setWeather(weatherData);

      // Save to Firestore if logged in
      if (user) {
        await addDoc(collection(db, 'users', user.uid, 'history'), {
          ...weatherData,
          searchedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Sticky Search Bar at Top */}
      <div className={`${showSearch ? 'block' : 'hidden'} sticky top-0 z-50 bg-gradient-to-b from-opacity-100 to-opacity-0 pb-4`} style={{ background: 'var(--bg-primary)' }}>
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

        {/* Error message below search */}
        {error && (
          <div
            className="p-4 rounded-xl text-sm mt-3"
            style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Hero section */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Weather <span style={{ color: 'var(--accent-purple)' }}>Forecast</span>
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Search for any city to get current weather conditions
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--accent-purple)' }}>
            Today’s weather highlights
          </p>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Random cities on refresh
          </h2>
          {popularWeather.length === 0 && !error && (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Loading fresh weather data for random cities...
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {popularWeather.map((place) => (
          <div
            key={`${place.city}-${place.country}`}
            className="rounded-2xl p-5 border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                  {place.city}, {place.country}
                </h3>
                <p className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>
                  {place.description}
                </p>
              </div>
              <span className="text-4xl">{place.emoji}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Temp</p>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{place.temperature}°C</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Humidity</p>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{place.humidity}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>

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

          {/* Weather emoji icon */}
          <div className="flex justify-center text-6xl">
            {weather.emoji}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{weather.windSpeed} km/h</p>
            </div>
            <div
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <FiThermometer className="mx-auto mb-1" size={20} style={{ color: 'var(--accent-purple)' }} />
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Feels Like</p>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{weather.feelsLike}°C</p>
            </div>
          </div>
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
                  <span className="text-2xl">{item.emoji}</span>
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

      {/* Floating search icon button */}
      <button
        type="button"
        onClick={() => setShowSearch((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-2xl shadow-violet-500/20 transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-violet-300"
        style={{ animation: 'vibrate 1s infinite' }}
        aria-label={showSearch ? 'Hide search' : 'Open search'}
      >
        <FiSearch size={24} />
      </button>
      </div>
    </div>
  );
}