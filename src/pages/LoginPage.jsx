import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff, ArrowRight, LogIn, Sparkles, CheckCircle } from 'lucide-react';

// Demo credentials pre-filled for easy testing
const DEMO_ACCOUNTS = [
  { label: 'Job Seeker', email: 'kwame.asante@gmail.com', password: 'demo1234', role: 'Job_Seeker', color: 'bg-earth-100 text-earth-700 border-earth-200' },
  { label: 'Employer', email: 'adaeze@greenfields.ng', password: 'demo1234', role: 'Agribusiness_Employer', color: 'bg-agro-100 text-agro-700 border-agro-200' },
  { label: 'Field Evangelist', email: 'amina.wanjiku@outlook.com', password: 'demo1234', role: 'Field_Evangelist', color: 'bg-soil-100 text-soil-700 border-soil-200' },
];

// Mock user lookup (password is always demo1234 for all demo accounts)
const MOCK_AUTH = {
  'kwame.asante@gmail.com':       { name: 'Kwame Asante',     role: 'Job_Seeker',            id: 'usr_002' },
  'adaeze@greenfields.ng':        { name: 'Adaeze Okafor',    role: 'Agribusiness_Employer', id: 'usr_001' },
  'amina.wanjiku@outlook.com':    { name: 'Amina Wanjiku',    role: 'Field_Evangelist',      id: 'usr_003' },
  'seun@harvestprime.com':        { name: 'Oluwaseun Adebayo',role: 'Agribusiness_Employer', id: 'usr_004' },
  'fatou.d@yahoo.com':            { name: 'Fatou Diallo',     role: 'Job_Seeker',            id: 'usr_005' },
  'emensah@agroevangelists.org':  { name: 'Emmanuel Mensah', role: 'Field_Evangelist',      id: 'usr_006' },
};

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const user = MOCK_AUTH[email.toLowerCase().trim()];
      if (user && password === 'demo1234') {
        setSuccess(true);
        setTimeout(() => {
          onLogin({ ...user, email });
          navigate('/profile');
        }, 900);
      } else {
        setLoading(false);
        setError('Invalid email or password. Use a demo account below, or try password: demo1234');
      }
    }, 800);
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
            {/* Demo account chips */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-earth-500" /> Quick Demo Login
              </p>
              <div className="flex flex-wrap gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.role}
                    onClick={() => fillDemo(acc)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 ${acc.color}`}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
              <div className="relative text-center"><span className="px-3 bg-white text-xs text-gray-400">or enter manually</span></div>
            </div>

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
                <p className="text-xs text-gray-400 mt-1.5">Demo password: <span className="font-mono font-bold text-agro-600">demo1234</span></p>
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
          © 2025 AgroNet Africa · Demo Platform
        </p>
      </div>
    </div>
  );
}
