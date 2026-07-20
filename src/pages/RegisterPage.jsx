import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf, Eye, EyeOff, UserPlus, CheckCircle, Building2,
  Search, Megaphone, ArrowRight, Check
} from 'lucide-react';

const ROLES = [
  {
    id: 'Job_Seeker',
    title: 'Job Seeker',
    icon: Search,
    emoji: '🌱',
    desc: 'Find agricultural jobs across Africa and build your career',
    color: 'border-earth-300 bg-earth-50',
    activeColor: 'border-earth-500 bg-earth-100 ring-2 ring-earth-300',
    dotColor: 'bg-earth-500',
    textColor: 'text-earth-700',
  },
  {
    id: 'Agribusiness_Employer',
    title: 'Agribusiness Employer',
    icon: Building2,
    emoji: '🏢',
    desc: 'Post jobs and connect with skilled agricultural professionals',
    color: 'border-agro-300 bg-agro-50',
    activeColor: 'border-agro-500 bg-agro-100 ring-2 ring-agro-300',
    dotColor: 'bg-agro-500',
    textColor: 'text-agro-700',
  },
  {
    id: 'Field_Evangelist',
    title: 'Field Evangelist',
    icon: Megaphone,
    emoji: '📢',
    desc: 'Champion agricultural innovation and grow the AgroNet community',
    color: 'border-soil-300 bg-soil-50',
    activeColor: 'border-soil-500 bg-soil-100 ring-2 ring-soil-300',
    dotColor: 'bg-soil-500',
    textColor: 'text-soil-700',
  },
];

const BENEFITS = [
  'Access Africa\'s largest agri-jobs platform',
  'AI-powered Dream-to-Role Career Mapper',
  'Community forum — The Kilombo',
  'Micro-learning certifications & badges',
  'Connect with 12,450+ farmers & employers',
];

export default function RegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [step, setStep]           = useState(1); // 1 = role, 2 = details
  const [selectedRole, setRole]   = useState('');
  const [form, setForm]           = useState({ name: '', email: '', location: '', password: '', confirm: '' });
  const [showPass, setShowPass]   = useState(false);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name = 'Full name is required';
    if (!form.email.includes('@')) e.email = 'Valid email is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: `usr_${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        location: form.location.trim(),
        role: selectedRole,
      };
      setSuccess(true);
      setTimeout(() => {
        onLogin(newUser);
        navigate('/profile');
      }, 1000);
    }, 900);
  };

  const field = (id, label, type, placeholder, value, key, extra = {}) => (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <input
        id={id} type={type} value={value} placeholder={placeholder}
        onChange={(e) => { setForm({ ...form, [key]: e.target.value }); if (errors[key]) setErrors({ ...errors, [key]: '' }); }}
        className={`w-full px-4 py-3 rounded-xl border-2 text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all text-sm ${errors[key] ? 'border-red-300 bg-red-50/50' : 'border-gray-200 focus:border-agro-400'}`}
        {...extra}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-agro-950 via-agro-800 to-agro-600 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-dots opacity-10" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/4" />

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-display font-bold text-white">AgroNet <span className="text-agro-300">Africa</span></p>
              <p className="text-xs text-agro-200">Join 12,450+ agricultural professionals</p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-agro-950/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-agro-600 to-agro-500 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  {step === 1 ? 'Choose your role' : 'Create your account'}
                </h1>
                <p className="text-sm text-agro-100 mt-1">
                  {step === 1 ? 'Select how you\'ll use Agro Africa Net' : 'Fill in your details to get started'}
                </p>
              </div>
              {/* Step indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 1 ? 'bg-white text-agro-700' : 'bg-white/20 text-white'}`}>1</div>
                <div className={`w-6 h-0.5 rounded transition-all ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 2 ? 'bg-white text-agro-700' : 'bg-white/20 text-white'}`}>2</div>
              </div>
            </div>
          </div>

          <div className="px-8 py-7">
            {/* ── STEP 1: Role Selection ── */}
            {step === 1 && (
              <div className="space-y-5">
                {/* Benefits banner */}
                <div className="p-4 bg-agro-50 rounded-2xl border border-agro-200">
                  <p className="text-xs font-semibold text-agro-700 mb-2">✨ What you get — free forever:</p>
                  <ul className="space-y-1">
                    {BENEFITS.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs text-agro-600">
                        <Check className="w-3 h-3 flex-shrink-0" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Role cards */}
                <div className="space-y-3">
                  {ROLES.map((role) => {
                    const Icon = role.icon;
                    const isActive = selectedRole === role.id;
                    return (
                      <button
                        key={role.id}
                        id={`role-${role.id}`}
                        onClick={() => setRole(role.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${isActive ? role.activeColor : role.color + ' hover:brightness-95'}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl ${isActive ? 'bg-white shadow-md' : 'bg-white/70'}`}>
                          {role.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-display font-bold text-sm ${role.textColor}`}>{role.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{role.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isActive ? role.dotColor + ' border-transparent' : 'border-gray-300'}`}>
                          {isActive && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  id="next-step-btn"
                  onClick={() => selectedRole && setStep(2)}
                  disabled={!selectedRole}
                  className="w-full py-3.5 bg-gradient-to-r from-agro-600 to-agro-500 text-white font-bold rounded-xl shadow-lg shadow-agro-500/25 hover:shadow-xl active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ── STEP 2: Account Details ── */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
                {/* Selected role pill */}
                <div className="flex items-center justify-between p-3 bg-agro-50 rounded-xl border border-agro-200">
                  <p className="text-sm font-semibold text-agro-700">
                    {ROLES.find(r => r.id === selectedRole)?.emoji}{' '}
                    {ROLES.find(r => r.id === selectedRole)?.title}
                  </p>
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-agro-500 hover:text-agro-700 font-medium underline">
                    Change
                  </button>
                </div>

                {field('reg-name', 'Full Name', 'text', 'e.g. Kwame Asante', form.name, 'name')}

                {field('reg-email', 'Email Address', 'email', 'your@email.com', form.email, 'email')}

                {field('reg-location', 'Location', 'text', 'e.g. Accra, Ghana', form.location, 'location')}

                <div>
                  <label htmlFor="reg-password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      id="reg-password" type={showPass ? 'text' : 'password'} value={form.password} placeholder="Min. 6 characters"
                      onChange={(e) => { setForm({ ...form, password: e.target.value }); if (errors.password) setErrors({ ...errors, password: '' }); }}
                      className={`w-full px-4 py-3 pr-12 rounded-xl border-2 text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all text-sm ${errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200 focus:border-agro-400'}`}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                {field('reg-confirm', 'Confirm Password', 'password', 'Repeat your password', form.confirm, 'confirm')}

                <button
                  id="register-submit-btn"
                  type="submit"
                  disabled={loading || success}
                  className="w-full py-3.5 bg-gradient-to-r from-agro-600 to-agro-500 text-white font-bold rounded-xl shadow-lg shadow-agro-500/25 hover:shadow-xl active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {success ? (
                    <><CheckCircle className="w-5 h-5" /> Account Created!</>
                  ) : loading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                  ) : (
                    <><UserPlus className="w-5 h-5" /> Create Free Account</>
                  )}
                </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-agro-600 hover:text-agro-500 transition-colors">
                Sign in →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-agro-300 mt-6">© 2025 Agro Africa Net · Demo Platform</p>
      </div>
    </div>
  );
}
