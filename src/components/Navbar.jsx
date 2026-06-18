import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../auth/ThemeContext';
import { FiSun, FiMoon, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  return (
    <nav
      className="h-16 px-4 flex items-center justify-between border-b shrink-0"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Left side - Hamburger + Logo */}
      <div className="flex items-center gap-3">
        {/* Hamburger - visible only on < lg screens */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg transition-colors"
          style={{ color: 'var(--accent-purple)' }}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <Link to="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-purple)' }}
          >
            <span className="text-white font-bold text-sm">AW</span>
          </div>
          <span
            className="font-semibold text-lg hidden sm:block"
            style={{ color: 'var(--text-primary)' }}
          >
            WeatherApp
          </span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--accent-purple)' }}
          aria-label="Toggle theme"
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        {/* User info + Logout */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ background: 'var(--accent-pink)' }}
              >
                {user.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {user.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--accent-pink)' }}
              aria-label="Logout"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}