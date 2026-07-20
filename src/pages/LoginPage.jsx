import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff, ArrowRight, LogIn, CheckCircle } from 'lucide-react';
import { API_BASE } from '../lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// LoginPage — authenticates against the live Render backend.
// POST /api/auth/login  →  { success, data: { id, name, email, role, ... } }
//
// NOTE: The backend does not yet have a /api/auth/login endpoint — when it does,
// swap the TODO block below.  Until then we do a GET /api/users/:email lookup
// using the registered email as a fallback (demo-safe).
// ─────────────────────────────────────────────────────────────────────────────

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      // ── Try the backend auth endpoint first ────────────────────────────────
      const res  = await fetch(`${API_BASE}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Invalid credentials.');
      
      // Securely store the returned token and user details into local storage
      localStorage.setItem('token', json.token || json.data?.token || 'mock_token_for_now');
      localStorage.setItem('user', JSON.stringify(json.data));

      setSuccess(true);
      setTimeout(() => {
        onLogin(json.data);
        navigate('/profile');
      }, 900);

    } catch (err) {
      setLoading(false);
      setError(err.message || 'Sign-in failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-agro-950 via-agro-800 to-agro-600 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-dots opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-display font-bold text-white">AgroNet <span className="text-agro-300">Africa</span></p>
              <p className="text-xs text-agro-200">Agricultural Careers Platform</p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-agro-950/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-agro-600 to-agro-500 px-8 py-6">
            <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <LogIn className="w-5 h-5" /> Welcome back
            </h1>
            <p className="text-sm text-agro-100 mt-1">Sign in to your AgroNet Africa account</p>
          </div>

          <div className="px-8 py-7 space-y-5">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
              <div>
                <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading || success}
                className="w-full py-3.5 bg-gradient-to-r from-agro-600 to-agro-500 text-white font-bold rounded-xl shadow-lg shadow-agro-500/25 hover:shadow-xl hover:shadow-agro-500/40 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {success ? (
                  <><CheckCircle className="w-5 h-5" /> Signed in!</>
                ) : loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : (
                  <><LogIn className="w-5 h-5" /> Sign In</>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-agro-600 hover:text-agro-500 transition-colors">
                Create one free →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-agro-300 mt-6">
          © 2025 AgroNet Africa · Agricultural Careers Platform
        </p>
      </div>
    </div>
  );
}
