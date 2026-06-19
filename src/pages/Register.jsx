import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('An account with this email already exists');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/weak-password':
          setError('Password is too weak');
          break;
        default:
          setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex-1 flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))',
      }}
    >
      <div
        className="rounded-2xl shadow-2xl p-8 w-full max-w-md border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Sign up to get started
          </p>
        </div>

        {error && (
          <div
            className="px-4 py-3 rounded-lg mb-6 text-sm"
            style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Email Address
            </label>
            <div className="relative">
              <FiMail
                className="absolute left-3 top-1/2 -translate-y-1/2"
                size={16}
                style={{ color: 'var(--text-secondary)' }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none border transition-all"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div className="relative">
              <FiLock
                className="absolute left-3 top-1/2 -translate-y-1/2"
                size={16}
                style={{ color: 'var(--text-secondary)' }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none border transition-all"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Confirm Password
            </label>
            <div className="relative">
              <FiLock
                className="absolute left-3 top-1/2 -translate-y-1/2"
                size={16}
                style={{ color: 'var(--text-secondary)' }}
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none border transition-all"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                placeholder="Repeat your password"
              />
            </div>
          </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3 px-4 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))' }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-purple)' }} className="font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
