import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FiTrash2, FiThermometer, FiDroplet, FiWind, FiClock, FiMapPin } from 'react-icons/fi';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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
        searchedAt: doc.data().searchedAt?.toDate?.() || null,
      }));
      setHistory(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  async function handleDelete(docId) {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'history', docId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: 'var(--accent-purple)' }}
        ></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Weather Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }} className="mt-1">
            Your weather search history
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--accent-pink)',
            border: '1px solid var(--accent-pink)',
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="p-5 rounded-xl border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Searches</p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--accent-purple)' }}>
            {history.length}
          </p>
        </div>
        <div
          className="p-5 rounded-xl border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Cities Explored</p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--accent-pink)' }}>
            {new Set(history.map((h) => h.city)).size}
          </p>
        </div>
        <div
          className="p-5 rounded-xl border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Account</p>
          <p className="text-sm font-medium mt-1 truncate" style={{ color: 'var(--text-primary)' }}>
            {user?.email}
          </p>
        </div>
      </div>

      {/* History list */}
      {history.length === 0 ? (
        <div
          className="p-12 rounded-xl border text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <FiMapPin size={48} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No search history yet
          </h3>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            Start searching for cities on the{' '}
            <a href="/" style={{ color: 'var(--accent-purple)' }} className="font-medium hover:underline">
              Home page
            </a>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <FiClock size={20} style={{ color: 'var(--accent-purple)' }} />
            Search History
          </h2>

          {history.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border flex items-center justify-between gap-4 transition-all hover:shadow-md"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Weather icon */}
                <img
                  src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                  alt=""
                  className="w-12 h-12 shrink-0"
                />

                {/* City info */}
                <div className="min-w-0">
                  <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {item.city}, {item.country}
                  </p>
                  <p className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                    {item.description}
                  </p>
                </div>

                {/* Weather details */}
                <div className="hidden md:flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <FiThermometer size={14} style={{ color: 'var(--accent-purple)' }} />
                    {item.temperature}°C
                  </span>
                  <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <FiDroplet size={14} style={{ color: 'var(--accent-purple)' }} />
                    {item.humidity}%
                  </span>
                  <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <FiWind size={14} style={{ color: 'var(--accent-purple)' }} />
                    {item.windSpeed} m/s
                  </span>
                </div>

                {/* Temperature (mobile) */}
                <div className="md:hidden text-right">
                  <p className="font-bold text-lg" style={{ color: 'var(--accent-purple)' }}>
                    {item.temperature}°C
                  </p>
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-lg transition-colors shrink-0"
                style={{ color: 'var(--text-secondary)' }}
                title="Delete entry"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}