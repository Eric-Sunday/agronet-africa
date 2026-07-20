// src/pages/RegisterPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Two-step registration with distinct forms per role:
//   Step 1 → Role selection (job_seeker | employer)
//   Step 2 → Role-specific fields
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf, Eye, EyeOff, UserPlus, CheckCircle, Building2,
  Search, ArrowRight, Check, Globe, Tag, X, Briefcase
} from 'lucide-react';
import { registerUser } from '../lib/api';
import { useAuth } from '../context/AuthContext';

// ── Role definitions ──────────────────────────────────────────────────────────
const ROLES = [
  {
    id: 'job_seeker',
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
    id: 'employer',
    title: 'Agribusiness Employer',
    icon: Building2,
    emoji: '🏢',
    desc: 'Post jobs and connect with skilled agricultural professionals',
    color: 'border-agro-300 bg-agro-50',
    activeColor: 'border-agro-500 bg-agro-100 ring-2 ring-agro-300',
    dotColor: 'bg-agro-500',
    textColor: 'text-agro-700',
  },
];

const BENEFITS = [
  "Access Africa's largest agri-jobs platform",
  'AI-powered Dream-to-Role Career Mapper',
  'Community forum — The Kilombo',
  'Micro-learning certifications & badges',
  'Connect with 12,450+ farmers & employers',
];

const SPECIALTIES = [
  'Agronomy', 'Aquaculture', 'Horticulture', 'Animal Husbandry',
  'Soil Science', 'Precision Agriculture', 'Agroforestry',
  'Post-Harvest Technology', 'Agricultural Engineering',
  'Irrigation & Water Management', 'Organic Farming',
  'Agricultural Economics', 'Crop Protection', 'Seed Technology',
  'Livestock Nutrition', 'Dairy Technology', 'Apiculture',
  'Vermiculture & Composting', 'Climate-Smart Agriculture', 'Other',
];

const INDUSTRIES = [
  'Crop Production', 'Livestock & Dairy', 'Aquaculture & Fisheries',
  'Agro-processing & Food Manufacturing', 'Agricultural Inputs',
  'Agricultural Finance & Insurance', 'AgriTech & Precision Farming',
  'Agricultural Research & Education', 'Export & Trade',
  'Irrigation & Water Management', 'Forestry', 'Other',
];

const SKILL_SUGGESTIONS = [
  'Soil Pathology', 'Precision Aquaculture', 'Greenhouse Agronomy',
  'Hydroponics', 'Drip Irrigation Design', 'Crop Genomics',
  'Organic Certification', 'Livestock Nutrition', 'Apiculture',
  'Post-Harvest Technology', 'Agricultural Drones', 'Vermiculture',
  'Mycology', 'Agroforestry', 'Seed Technology',
  'Integrated Pest Management', 'Fertigation Systems', 'Climate-Smart Agriculture',
];

// ── Reusable field helper ─────────────────────────────────────────────────────
function Field({ id, label, type = 'text', placeholder, value, onChange, error, required = true, optional = false, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {optional && <span className="ml-1 text-xs font-normal text-gray-400">(optional)</span>}
        {required && !optional && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl border-2 text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all text-sm ${
          error ? 'border-red-300 bg-red-50/50' : 'border-gray-200 focus:border-agro-400'
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── Skill tag input ───────────────────────────────────────────────────────────
function SkillTagInput({ skills, onChange, error }) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = SKILL_SUGGESTIONS.filter(
    s => s.toLowerCase().includes(input.toLowerCase()) && !skills.includes(s)
  );

  const add = (skill) => {
    const s = skill.trim();
    if (s && !skills.includes(s)) {
      onChange([...skills, s]);
      setInput('');
      setShowSuggestions(false);
    }
  };

  const remove = (skill) => onChange(skills.filter(s => s !== skill));

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        Skills <span className="text-red-400">*</span>
      </label>
      <p className="text-xs text-gray-400 mb-2">Type and press Enter, or pick from suggestions.</p>

      {/* Selected skill tags */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.map(s => (
            <span key={s} className="inline-flex items-center gap-1 px-3 py-1 bg-agro-100 text-agro-800 text-xs font-medium rounded-lg">
              {s}
              <button type="button" onClick={() => remove(s)} className="p-0.5 hover:bg-agro-200 rounded-full">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          id="skill-tag-input"
          type="text"
          value={input}
          placeholder="e.g. Soil Pathology, Hydroponics..."
          onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(input); } }}
          className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all ${
            error ? 'border-red-300 bg-red-50/50' : 'border-gray-200 focus:border-agro-400'
          }`}
        />

        {showSuggestions && filtered.length > 0 && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
            {filtered.slice(0, 6).map(s => (
              <button
                key={s}
                type="button"
                onMouseDown={() => add(s)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-agro-50 hover:text-agro-700 transition-colors"
              >
                <Tag className="w-3 h-3 inline mr-2 text-agro-400" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate    = useNavigate();
  const { login }   = useAuth();
  const [step, setStep]                 = useState(1);
  const [selectedRole, setRole]         = useState('');
  const [showPass, setShowPass]         = useState(false);
  const [errors, setErrors]             = useState({});
  const [serverError, setServerError]   = useState('');
  const [loading, setLoading]           = useState(false);
  const [success, setSuccess]           = useState(false);

  // ── Shared fields ────────────────────────────────────────────────────────
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');

  // ── Job Seeker fields ─────────────────────────────────────────────────────
  const [jsName, setJsName]               = useState('');
  const [jsLocation, setJsLocation]       = useState('');
  const [jsSpecialty, setJsSpecialty]     = useState('');
  const [jsSkills, setJsSkills]           = useState([]);

  // ── Employer fields ───────────────────────────────────────────────────────
  const [empCompany, setEmpCompany]       = useState('');
  const [empTaxId, setEmpTaxId]           = useState('');
  const [empLocation, setEmpLocation]     = useState('');
  const [empIndustry, setEmpIndustry]     = useState('');
  const [empWebsite, setEmpWebsite]       = useState('');

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!email.includes('@'))         e.email    = 'Valid email is required';
    if (password.length < 6)          e.password = 'Password must be at least 6 characters';
    if (password !== confirm)         e.confirm  = 'Passwords do not match';

    if (selectedRole === 'job_seeker') {
      if (!jsName.trim())             e.jsName      = 'Full name is required';
      if (!jsLocation.trim())         e.jsLocation  = 'Location is required';
      if (!jsSpecialty)               e.jsSpecialty = 'Please select your primary specialty';
      if (jsSkills.length === 0)      e.jsSkills    = 'Add at least one skill';
    }

    if (selectedRole === 'employer') {
      if (!empCompany.trim())         e.empCompany  = 'Company name is required';
      if (!empLocation.trim())        e.empLocation = 'Company location is required';
      if (!empIndustry)               e.empIndustry = 'Please select your industry sector';
    }

    return e;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const payload =
        selectedRole === 'job_seeker'
          ? {
              role:      'job_seeker',
              name:      jsName.trim(),
              email:     email.toLowerCase().trim(),
              password,
              location:  jsLocation.trim(),
              specialty: jsSpecialty,
              skills:    jsSkills,
            }
          : {
              role:         'employer',
              company_name: empCompany.trim(),
              email:        email.toLowerCase().trim(),
              password,
              location:     empLocation.trim(),
              tax_id:       empTaxId.trim() || null,
              industry:     empIndustry,
              website:      empWebsite.trim() || null,
            };

      const { token, user } = await registerUser(payload);
      setSuccess(true);
      setTimeout(() => {
        login(user, token);
        navigate('/profile');
      }, 1000);
    } catch (err) {
      setLoading(false);
      setServerError(err.message || 'Registration failed. Please try again.');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
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
                  {step === 1 ? "Select how you'll use AgroNet Africa" : 'Fill in your details to get started'}
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
                    {BENEFITS.map(b => (
                      <li key={b} className="flex items-center gap-2 text-xs text-agro-600">
                        <Check className="w-3 h-3 flex-shrink-0" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Role cards */}
                <div className="space-y-3">
                  {ROLES.map(role => {
                    const Icon = role.icon;
                    const isActive = selectedRole === role.id;
                    return (
                      <button
                        key={role.id}
                        id={`role-${role.id}`}
                        type="button"
                        onClick={() => setRole(role.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                          isActive ? role.activeColor : role.color + ' hover:brightness-95'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl ${isActive ? 'bg-white shadow-md' : 'bg-white/70'}`}>
                          {role.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-display font-bold text-sm ${role.textColor}`}>{role.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{role.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          isActive ? role.dotColor + ' border-transparent' : 'border-gray-300'
                        }`}>
                          {isActive && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  id="next-step-btn"
                  type="button"
                  onClick={() => selectedRole && setStep(2)}
                  disabled={!selectedRole}
                  className="w-full py-3.5 bg-gradient-to-r from-agro-600 to-agro-500 text-white font-bold rounded-xl shadow-lg shadow-agro-500/25 hover:shadow-xl active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ── STEP 2: Role-Specific Form ── */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
                {/* Role pill */}
                <div className="flex items-center justify-between p-3 bg-agro-50 rounded-xl border border-agro-200">
                  <p className="text-sm font-semibold text-agro-700 flex items-center gap-2">
                    {selectedRole === 'job_seeker' ? (
                      <><Search className="w-4 h-4" /> Job Seeker</>
                    ) : (
                      <><Building2 className="w-4 h-4" /> Agribusiness Employer</>
                    )}
                  </p>
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-agro-500 hover:text-agro-700 font-medium underline">
                    Change
                  </button>
                </div>

                {/* ── JOB SEEKER FIELDS ── */}
                {selectedRole === 'job_seeker' && (
                  <>
                    <Field
                      id="js-full-name"
                      label="Full Name"
                      placeholder="e.g. Kwame Asante"
                      value={jsName}
                      onChange={e => { setJsName(e.target.value); if (errors.jsName) setErrors(p => ({ ...p, jsName: '' })); }}
                      error={errors.jsName}
                    />
                    <Field
                      id="js-location"
                      label="Location"
                      placeholder="e.g. Accra, Ghana"
                      value={jsLocation}
                      onChange={e => { setJsLocation(e.target.value); if (errors.jsLocation) setErrors(p => ({ ...p, jsLocation: '' })); }}
                      error={errors.jsLocation}
                    />

                    {/* Primary Agricultural Specialty */}
                    <div>
                      <label htmlFor="js-specialty" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Primary Agricultural Specialty <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="js-specialty"
                        value={jsSpecialty}
                        onChange={e => { setJsSpecialty(e.target.value); if (errors.jsSpecialty) setErrors(p => ({ ...p, jsSpecialty: '' })); }}
                        className={`w-full px-4 py-3 rounded-xl border-2 text-gray-800 focus:ring-4 focus:ring-agro-100 outline-none transition-all text-sm bg-white ${
                          errors.jsSpecialty ? 'border-red-300 bg-red-50/50' : 'border-gray-200 focus:border-agro-400'
                        }`}
                      >
                        <option value="">Select your specialty...</option>
                        {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.jsSpecialty && <p className="text-xs text-red-500 mt-1">{errors.jsSpecialty}</p>}
                    </div>

                    {/* Skills */}
                    <SkillTagInput
                      skills={jsSkills}
                      onChange={skills => { setJsSkills(skills); if (errors.jsSkills) setErrors(p => ({ ...p, jsSkills: '' })); }}
                      error={errors.jsSkills}
                    />
                  </>
                )}

                {/* ── EMPLOYER FIELDS ── */}
                {selectedRole === 'employer' && (
                  <>
                    <Field
                      id="emp-company"
                      label="Company Name"
                      placeholder="e.g. GreenFields Agro Ltd."
                      value={empCompany}
                      onChange={e => { setEmpCompany(e.target.value); if (errors.empCompany) setErrors(p => ({ ...p, empCompany: '' })); }}
                      error={errors.empCompany}
                    />
                    <Field
                      id="emp-tax-id"
                      label="Registration / Tax ID"
                      placeholder="e.g. RC-0012345"
                      value={empTaxId}
                      onChange={e => setEmpTaxId(e.target.value)}
                      error={errors.empTaxId}
                      optional
                    />
                    <Field
                      id="emp-location"
                      label="Company Location"
                      placeholder="e.g. Lagos, Nigeria"
                      value={empLocation}
                      onChange={e => { setEmpLocation(e.target.value); if (errors.empLocation) setErrors(p => ({ ...p, empLocation: '' })); }}
                      error={errors.empLocation}
                    />

                    {/* Industry Sector */}
                    <div>
                      <label htmlFor="emp-industry" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Industry Sector <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="emp-industry"
                        value={empIndustry}
                        onChange={e => { setEmpIndustry(e.target.value); if (errors.empIndustry) setErrors(p => ({ ...p, empIndustry: '' })); }}
                        className={`w-full px-4 py-3 rounded-xl border-2 text-gray-800 focus:ring-4 focus:ring-agro-100 outline-none transition-all text-sm bg-white ${
                          errors.empIndustry ? 'border-red-300 bg-red-50/50' : 'border-gray-200 focus:border-agro-400'
                        }`}
                      >
                        <option value="">Select industry sector...</option>
                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                      {errors.empIndustry && <p className="text-xs text-red-500 mt-1">{errors.empIndustry}</p>}
                    </div>

                    <div>
                      <label htmlFor="emp-website" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Website <span className="ml-1 text-xs font-normal text-gray-400">(optional)</span>
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="emp-website"
                          type="url"
                          value={empWebsite}
                          placeholder="https://yourcompany.com"
                          onChange={e => setEmpWebsite(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ── SHARED FIELDS ── */}
                <div className="border-t border-gray-100 pt-4 space-y-4">
                  <Field
                    id="reg-email"
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); }}
                    error={errors.email}
                  />

                  <div>
                    <label htmlFor="reg-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="reg-password"
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        placeholder="Min. 6 characters"
                        onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: '' })); }}
                        className={`w-full px-4 py-3 pr-12 rounded-xl border-2 text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all text-sm ${
                          errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200 focus:border-agro-400'
                        }`}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                  </div>

                  <Field
                    id="reg-confirm"
                    label="Confirm Password"
                    type="password"
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); if (errors.confirm) setErrors(p => ({ ...p, confirm: '' })); }}
                    error={errors.confirm}
                  />
                </div>

                {/* Server error */}
                {serverError && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {serverError}
                  </div>
                )}

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

        <p className="text-center text-xs text-agro-300 mt-6">© 2025 AgroNet Africa · Agricultural Careers Platform</p>
      </div>
    </div>
  );
}
