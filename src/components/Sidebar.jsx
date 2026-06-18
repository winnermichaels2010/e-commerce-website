import { NavLink } from 'react-router-dom';
import { FiHome, FiGrid, FiX } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-white'
        : ''
    }`;

  const linkStyle = ({ isActive }) => ({
    backgroundColor: isActive ? 'var(--accent-purple)' : 'transparent',
    color: isActive ? '#ffffff' : 'var(--text-secondary)',
  });

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64
          transform transition-transform duration-300 ease-in-out
          lg:transform-none lg:border-r
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-2">
          <NavLink
            to="/"
            end
            className={linkClass}
            style={linkStyle}
            onClick={onClose}
          >
            <FiHome size={18} />
            Home
          </NavLink>

          {user && (
            <NavLink
              to="/dashboard"
              className={linkClass}
              style={linkStyle}
              onClick={onClose}
            >
              <FiGrid size={18} />
              Dashboard
            </NavLink>
          )}

          {!user && (
            <>
              <NavLink
                to="/login"
                className={linkClass}
                style={linkStyle}
                onClick={onClose}
              >
                Sign In
              </NavLink>
              <NavLink
                to="/register"
                className={linkClass}
                style={linkStyle}
                onClick={onClose}
              >
                Create Account
              </NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}