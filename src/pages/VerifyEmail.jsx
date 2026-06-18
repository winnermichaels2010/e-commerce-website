import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { FiMail, FiRefreshCw } from 'react-icons/fi';

export default function VerifyEmail() {
  const { user, sendVerification, logout } = useAuth();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  // If not logged in at all, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If already verified, redirect to dashboard
  if (user.emailVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  // Auto-check verification status every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          navigate('/dashboard', { replace: true });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  async function handleResend() {
    setResending(true);
    setMessage('');
    try {
      await sendVerification();
      setMessage('Verification email sent! Check your inbox.');
    } catch (err) {
      setMessage('Failed to send. Please try again later.');
    } finally {
      setResending(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))',
      }}
    >
      <div
        className="rounded-2xl shadow-2xl p-8 w-full max-w-md border text-center space-y-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <FiMail size={32} style={{ color: 'var(--accent-purple)' }} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Verify Your Email
          </h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            We've sent a verification email to{' '}
            <span className="font-semibold" style={{ color: 'var(--accent-purple)' }}>
              {user.email}
            </span>
          </p>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            Click the link in the email to verify your account. This page will automatically
            redirect you once verified.
          </p>
        </div>

        {message && (
          <div
            className="px-4 py-3 rounded-lg text-sm"
            style={{
              backgroundColor: message.includes('Failed')
                ? '#fef2f2'
                : '#f0fdf4',
              color: message.includes('Failed') ? '#dc2626' : '#16a34a',
              border: `1px solid ${
                message.includes('Failed') ? '#fecaca' : '#bbf7d0'
              }`,
            }}
          >
            {message}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full py-3 px-4 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'var(--accent-purple)' }}
          >
            <FiRefreshCw size={16} className={resending ? 'animate-spin' : ''} />
            {resending ? 'Sending...' : 'Resend Verification Email'}
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 font-semibold rounded-lg transition-all duration-300"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--accent-pink)',
              border: '1px solid var(--accent-pink)',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}