import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, ArrowRight, Users, Briefcase, MapPin, Star, ShieldCheck,
  Zap, Globe, Building2, UserSearch, CheckCircle, TrendingUp,
  ChevronDown, Sparkles, Clock, Award, Lock, BadgeCheck,
  Sprout, BarChart3, FileText, Unlock, PlusCircle, WifiOff, AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchPlatformStats, fetchFeaturedJobs, fetchFeaturedExperts } from '../lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// Intersection Observer Hook
// ─────────────────────────────────────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); observer.unobserve(entry.target); }
    }, { threshold: 0.12, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, isInView];
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated Counter
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, isInView]   = useInView();
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const inc = target / (duration / 16);
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Toast Notification (mini)
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 bg-forest-800 text-white rounded-2xl shadow-2xl shadow-forest-900/40 animate-fade-in-up">
      <div className="w-8 h-8 bg-mint-500 rounded-full flex items-center justify-center flex-shrink-0">
        <CheckCircle className="w-4 h-4 text-forest-900" />
      </div>
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Star Rating renderer
// ─────────────────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// A. HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900 to-agro-900" />
      <div className="absolute inset-0 bg-grid opacity-10" />
      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-agro-500/10 blob-shape blur-3xl animate-float" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-mint-500/8 blob-shape-2 blur-3xl animate-float-delayed" />
      <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-earth-500/10 blob-shape blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Copy */}
          <div className="space-y-8">
            {/* Eyebrow badge */}
            <div className="animate-fade-in-down inline-flex items-center gap-2.5 px-4 py-2 bg-forest-800/60 border border-forest-600/40 rounded-full backdrop-blur-sm">
              <Sprout className="w-4 h-4 text-mint-400" />
              <span className="text-sm font-semibold text-mint-300 tracking-wide">Africa's Agricultural Ecosystem</span>
            </div>

            {/* Headline */}
            <div className="animate-fade-in-up space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-[1.08] tracking-tight text-white">
                The Complete Digital
                <br />
                <span className="bg-gradient-to-r from-mint-400 via-agro-400 to-mint-300 bg-clip-text text-transparent">
                  Infrastructure
                </span>
                <br />
                for African Agricultural Talent.
              </h1>
              <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
                Whether you need full-time farm workers or immediate on-demand assistance from verified veterinary and agronomy specialists, AgroNet connects your agribusiness to the right expertise{' '}
                <span className="text-mint-300 font-semibold">in minutes</span>.
              </p>
            </div>

            {/* Dual CTA Block */}
            <div className="animate-fade-in-up stagger-2 flex flex-col sm:flex-row gap-4">
              {/* Primary — AgroNet Jobs */}
              <Link to="/jobs" className="btn-primary text-base !px-7 !py-4 !from-agro-600 !to-agro-500" id="hero-browse-jobs-btn">
                <Briefcase className="w-5 h-5" />
                Browse Farm Jobs
              </Link>
              {/* Secondary — Agrilencer */}
              <Link to="/expert" id="hero-expert-btn"
                className="relative inline-flex items-center gap-2.5 px-7 py-4 bg-transparent border-2 border-mint-400/60 text-mint-300 font-semibold rounded-xl text-base cursor-pointer hover:bg-mint-400/10 hover:border-mint-300 transition-all duration-200 group overflow-hidden"
              >
                {/* Glow ring */}
                <span className="absolute inset-0 rounded-xl bg-mint-400/5 group-hover:bg-mint-400/10 transition-colors" />
                <Zap className="w-5 h-5 flex-shrink-0 text-mint-400" />
                <span className="relative">Instant Field Expert Booking</span>
                <span className="badge-premium relative flex-shrink-0">✦ New</span>
              </Link>
            </div>

            {/* Social proof row */}
            <div className="animate-fade-in stagger-4 flex items-center gap-6 pt-2">
              <div className="flex -space-x-3">
                {['bg-agro-500', 'bg-earth-400', 'bg-mint-600', 'bg-sky-500'].map((bg, i) => (
                  <div key={i} className={`w-9 h-9 ${bg} rounded-full border-2 border-forest-800 flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                    {['AO', 'NE', 'KA', 'FD'][i]}
                  </div>
                ))}
                <div className="w-9 h-9 bg-forest-700 rounded-full border-2 border-forest-800 flex items-center justify-center text-mint-300 text-xs font-bold">+12K</div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Trusted by 12,000+ users across Africa</p>
              </div>
            </div>
          </div>

          {/* Right — Dashboard Preview Card */}
          <div className="relative animate-fade-in stagger-3">
            <div className="relative z-10 glass-card-dark p-6 space-y-5 border border-forest-700/40">
              {/* Card header */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-300">Platform Overview</p>
                <span className="flex items-center gap-1.5 text-xs text-mint-400 font-medium">
                  <span className="w-2 h-2 bg-mint-400 rounded-full animate-pulse" />
                  Live
                </span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3">
                {(() => {
                  // Use default empty values if stats not loaded
                  const stats = [
                    { value: 124, label: 'Live Jobs', suffix: '+', color: 'text-agro-400' },
                    { value: 12450, label: 'Users', suffix: '+', color: 'text-mint-400' },
                    { value: 3120, label: 'Placements', suffix: '+', color: 'text-sky-400' },
                  ];
                  return stats.map((s, i) => (
                    <div key={i} className="text-center p-3 bg-forest-800/40 rounded-xl border border-forest-700/30">
                      <p className={`text-xl font-display font-bold ${s.color}`}>
                        {s.value}{s.suffix}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  ));
                })()}
              </div>

              {/* Available expert mini-card */}
              <div className="p-4 bg-forest-800/50 rounded-xl border border-mint-500/20">
                <div className="flex items-center gap-1.5 mb-3">
                  <Zap className="w-3.5 h-3.5 text-mint-400" />
                  <span className="text-xs font-semibold text-mint-300 uppercase tracking-wide">Expert Available Now</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-agro-600 to-agro-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">CA</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">Dr. Chukwuemeka Alabi</p>
                    <p className="text-xs text-agro-400">Soil Agronomist · Ibadan</p>
                  </div>
                  <Link to="/expert" className="flex-shrink-0 text-xs font-bold px-3 py-1.5 bg-mint-500 text-forest-900 rounded-lg hover:bg-mint-400 transition-colors">
                    Book
                  </Link>
                </div>
              </div>

              {/* Recent job mini-item */}
              <div className="flex items-center gap-3 p-3 bg-agro-900/30 rounded-xl border border-agro-700/20">
                <div className="w-9 h-9 bg-agro-700/60 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-agro-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Farm Manager — Ibadan</p>
                  <p className="text-xs text-gray-500">₦350K–₦500K/mo · 2 days ago</p>
                </div>
                <span className="flex-shrink-0 text-xs px-2 py-0.5 bg-agro-700/60 text-agro-300 rounded-full font-medium">Urgent</span>
              </div>
            </div>

            {/* Decorative stack */}
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-forest-700/30 to-agro-800/20 rounded-2xl -z-10 rotate-2 border border-forest-600/20" />
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-gradient-to-br from-agro-900/30 to-forest-900/20 rounded-2xl -z-20 -rotate-1 border border-agro-800/20" />
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// B. FEATURE MATRIX — Two-Pillar Side-by-Side
// ─────────────────────────────────────────────────────────────────────────────
function FeatureMatrixSection() {
  const [ref, isInView] = useInView();

  const agroFeatures = [
    { icon: Briefcase,  text: 'Streamlined long-term hiring for commercial farms' },
    { icon: BadgeCheck, text: 'Verified farm managers, supervisors, and operators' },
    { icon: BarChart3,  text: 'AI-powered candidate matching with auto-filtering' },
    { icon: Globe,      text: 'Pan-African reach across 18+ countries' },
  ];

  const agrilencerFeatures = [
    { icon: Zap,        text: 'Instant geo-proximate access to certified consultants' },
    { icon: ShieldCheck,text: 'Secure project escrow — pay only on delivery' },
    { icon: Award,      text: 'Vetted Agronomists, Pathologists, and Veterinarians' },
    { icon: Clock,      text: 'Solve farm crises within hours, not weeks' },
  ];

  return (
    <section id="features" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest-50 border border-forest-200 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-forest-700" />
            <span className="text-sm font-semibold text-forest-700">One Unified Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-gray-900 mb-5">
            Two Powerful Pillars,{' '}
            <span className="bg-gradient-to-r from-forest-700 to-agro-600 bg-clip-text text-transparent">
              One Platform
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Agro Africa Net gives agribusinesses everything they need — from long-term workforce recruitment to immediate on-demand specialist consultation.
          </p>
        </div>

        {/* Pillar Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pillar 1 — AgroNet Jobs */}
          <div className={`pillar-card border-agro-200 bg-gradient-to-br from-agro-50 to-white hover:border-agro-400 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ transitionDelay: '100ms' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-agro-600 to-agro-800 rounded-2xl flex items-center justify-center shadow-lg shadow-agro-500/20 flex-shrink-0">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-agro-100 text-agro-700 text-xs font-bold rounded-full mb-2 border border-agro-200">
                  <Briefcase className="w-3 h-3" /> Pillar 1
                </div>
                <h3 className="text-xl font-display font-black text-gray-900">AgroNet Jobs Portal</h3>
                <p className="text-sm text-gray-500 mt-0.5">Long-term agricultural employment</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6 text-sm">
              Streamlining long-term hiring for commercial farms. Access verified farm managers, supervisors, operators, and general labor with automated filtering and AI-powered matching.
            </p>
            <ul className="space-y-3 mb-8">
              {agroFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-agro-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.icon className="w-3.5 h-3.5 text-agro-700" />
                  </div>
                  <span className="text-sm text-gray-700 leading-relaxed">{f.text}</span>
                </li>
              ))}
            </ul>
            <Link to="/jobs" className="btn-primary !px-6 !py-3 text-sm w-full justify-center" id="feature-browse-jobs">
              Browse Open Roles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 2 — Agrilencer Premium */}
          <div className={`pillar-card border-forest-300 bg-gradient-to-br from-forest-950 to-forest-900 hover:border-forest-400 hover:shadow-forest-900/30 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ transitionDelay: '250ms' }}>
            {/* Premium top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mint-400 via-agro-400 to-mint-500 rounded-t-2xl" />
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-mint-500 to-forest-600 rounded-2xl flex items-center justify-center shadow-lg shadow-mint-500/20 flex-shrink-0">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge-premium">✦ Premium Add-on</span>
                </div>
                <h3 className="text-xl font-display font-black text-white">Agrilencer On-Demand Experts</h3>
                <p className="text-sm text-gray-400 mt-0.5">Instant specialist consultations</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 text-sm">
              Instant, geo-proximate access to certified agricultural consultants. Solve sudden farm crises — crop diseases, livestock epidemics, soil degradation — through a secure, built-in project escrow framework.
            </p>
            <ul className="space-y-3 mb-8">
              {agrilencerFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-forest-800/60 border border-forest-700/40 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.icon className="w-3.5 h-3.5 text-mint-400" />
                  </div>
                  <span className="text-sm text-gray-300 leading-relaxed">{f.text}</span>
                </li>
              ))}
            </ul>
            <Link to="/expert" className="btn-glow !px-6 !py-3 text-sm w-full justify-center" id="feature-hire-expert">
              Hire an Expert Now <Zap className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// C. LIVE MARKETPLACE PREVIEW — Tabbed
// ─────────────────────────────────────────────────────────────────────────────
function LiveMarketplaceSection() {
  const [ref, isInView]   = useInView();
  const [activeTab, setActiveTab] = useState('jobs');
  const [toast, setToast] = useState(null);

  // ── Live featured jobs from backend ────────────────────────────────────────
  const [previewJobs, setPreviewJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError,   setJobsError]   = useState(false);

  // ── Live featured experts from backend ─────────────────────────────────────
  const [previewExperts, setPreviewExperts] = useState([]);
  const [expertsLoading, setExpertsLoading] = useState(true);
  const [expertsError,   setExpertsError]   = useState(false);

  useEffect(() => {
    // Fetch featured jobs
    fetchFeaturedJobs({ limit: 4 })
      .then((data) => {
        const jobs = (data && Array.isArray(data.jobs)) ? data.jobs : [];
        setPreviewJobs(jobs);
        setJobsError(false);
      })
      .catch((err) => {
        console.warn('[HomePage] Failed to fetch featured jobs:', err);
        setPreviewJobs([]);
        setJobsError(true);
      })
      .finally(() => setJobsLoading(false));

    // Fetch featured experts
    fetchFeaturedExperts({ limit: 4 })
      .then((data) => {
        const experts = (data && Array.isArray(data.experts)) ? data.experts : [];
        setPreviewExperts(experts);
        setExpertsError(false);
      })
      .catch((err) => {
        console.warn('[HomePage] Failed to fetch featured experts:', err);
        setPreviewExperts([]);
        setExpertsError(true);
      })
      .finally(() => setExpertsLoading(false));
  }, []);

  const handleBookNow = (expert) => {
    setToast(`✓ Added "${expert.name}" to your booking cart`);
  };

  return (
    <section id="marketplace" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-agro-50/60 via-white to-gray-50/40" />
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-agro-100 border border-agro-200 rounded-full mb-6">
            <BarChart3 className="w-4 h-4 text-agro-700" />
            <span className="text-sm font-semibold text-agro-700">Live Marketplace Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-gray-900 mb-5">
            Explore What's{' '}
            <span className="bg-gradient-to-r from-forest-700 to-agro-600 bg-clip-text text-transparent">
              Available Right Now
            </span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Toggle between long-term employment openings and on-demand specialist consultants — all on one unified platform.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className={`flex justify-center mb-10 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '150ms' }}>
          <div className="inline-flex items-center gap-1 p-1.5 bg-gray-100 rounded-2xl">
            <button
              id="tab-jobs"
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl transition-all duration-200 cursor-pointer ${activeTab === 'jobs' ? 'tab-active' : 'tab-inactive'}`}
            >
              <Briefcase className="w-4 h-4" />
              Farm Jobs
            </button>
            <button
              id="tab-experts"
              onClick={() => setActiveTab('experts')}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl transition-all duration-200 cursor-pointer ${activeTab === 'experts' ? 'tab-active' : 'tab-inactive'}`}
            >
              <Zap className="w-4 h-4" />
              Field Experts
              <span className="badge-premium">✦</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '250ms' }}>
          {activeTab === 'jobs' ? (
            <>
              {jobsLoading ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="glass-card p-5 h-48 bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : jobsError || previewJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No jobs available at the moment</h3>
                  <p className="text-sm text-gray-500 mb-6">Check back soon for new opportunities</p>
                  <Link to="/jobs" className="btn-primary text-sm !px-6">
                    Browse All Jobs
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-5">
                  {(previewJobs || []).map((job) => (
                    <div key={job.id} className="glass-card p-5 card-hover group flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-gradient-to-br from-agro-600 to-forest-700 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-gray-900 text-sm leading-tight">{job.title}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{job.company}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="flex items-center gap-1 text-gray-500"><MapPin className="w-3 h-3" />{job.location}</span>
                        <span className={`px-2 py-0.5 rounded-full font-medium ${job.type === 'Full-time' ? 'bg-agro-100 text-agro-700' : 'bg-sky-100 text-sky-700'}`}>{job.type}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {(job.tags || []).slice(0, 2).map(t => <span key={t} className="badge-green text-xs">{t}</span>)}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="font-display font-bold text-forest-700 text-sm">{job.salary}</span>
                        <Link to="/jobs" className="text-xs font-semibold text-agro-700 hover:text-forest-700 flex items-center gap-1 transition-colors">
                          View Role <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {expertsLoading ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="glass-card p-5 h-48 bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : expertsError || previewExperts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No experts available right now</h3>
                  <p className="text-sm text-gray-500 mb-6">Our specialists will be online soon</p>
                  <Link to="/expert" className="btn-glow text-sm !px-6">
                    <Zap className="w-4 h-4" /> View All Experts
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-5">
                  {(previewExperts || []).map((exp) => (
                    <div key={exp.id} className="glass-card p-5 card-hover group flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${exp.avatarColor || 'from-agro-500 to-agro-700'} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                          <span className="text-white font-bold font-display text-lg">{(exp.name || 'E').split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-display font-bold text-gray-900 text-sm leading-tight">{exp.name}</h4>
                              <p className="text-agro-700 font-semibold text-xs mt-0.5">{exp.specialty}</p>
                            </div>
                            <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${(exp.availability || 'Available') === 'Available' ? 'bg-mint-100 text-mint-700' : 'bg-amber-50 text-amber-700'}`}>
                              {exp.availability || 'Available'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{exp.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Stars rating={exp.rating || 4.5} />
                          <span className="text-xs font-bold text-gray-700">{exp.rating || '4.5'}</span>
                          <span className="text-xs text-gray-400">({exp.reviewCount || 0})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {exp.is_verified && <ShieldCheck className="w-4 h-4 text-agro-600" />}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">From</p>
                          <p className="font-display font-bold text-forest-700 text-sm">₦{(exp.hourly_rate || 0).toLocaleString('en-NG')}<span className="text-xs font-normal text-gray-400">/hr</span></p>
                        </div>
                        <button
                          onClick={() => handleBookNow(exp)}
                          className="btn-glow !px-4 !py-2 text-xs"
                        >
                          <Zap className="w-3.5 h-3.5" /> Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link
            to={activeTab === 'jobs' ? '/jobs' : '/expert'}
            className="btn-secondary text-sm !px-8"
            id="marketplace-view-all"
          >
            View All {activeTab === 'jobs' ? 'Job Listings' : 'Field Experts'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// D. ESCROW TRUST SECTION
// ─────────────────────────────────────────────────────────────────────────────
function EscrowTrustSection() {
  const [ref, isInView] = useInView();

  const steps = [
    { icon: UserSearch,  step: '01', title: 'Book an Expert',         desc: 'Browse verified specialists, choose a package, and describe your farm challenge.' },
    { icon: Lock,        step: '02', title: 'Funds Held in Escrow',   desc: 'Your payment is securely held by AgroNet. The expert is notified and accepts the contract.' },
    { icon: FileText,    step: '03', title: 'Milestone Delivered',    desc: 'The expert completes the site visit, report, or consultation as scoped.' },
    { icon: Unlock,      step: '04', title: 'Release & Rate',         desc: 'You confirm delivery and release the funds. Rate your experience to help the community.' },
  ];

  return (
    <section id="escrow" className="relative py-24 lg:py-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/60 via-white to-forest-50/40" />
      <div className="absolute inset-0 bg-dots opacity-15" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-200 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4 text-sky-700" />
            <span className="text-sm font-semibold text-sky-700">Zero-Risk Payments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-gray-900 mb-5">
            Hire with Absolute Confidence{' '}
            <span className="bg-gradient-to-r from-sky-600 to-agro-600 bg-clip-text text-transparent">
              via AgroNet Escrow
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            When booking an on-demand Agrilencer specialist, your funds are safely held by AgroNet. Payment is only released to the consultant once you certify that the milestone, site inspection, or clinical report has been successfully delivered.
          </p>
        </div>

        {/* 4-Step Flow */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-sky-200 via-agro-300 to-mint-400" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`relative flex flex-col items-center text-center transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Icon */}
                <div className="relative mb-5">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${
                    i === 0 ? 'bg-gradient-to-br from-agro-100 to-agro-200' :
                    i === 1 ? 'bg-gradient-to-br from-sky-100 to-sky-200' :
                    i === 2 ? 'bg-gradient-to-br from-amber-50 to-amber-100' :
                    'bg-gradient-to-br from-mint-100 to-mint-200'
                  }`}>
                    <step.icon className={`w-9 h-9 ${
                      i === 0 ? 'text-agro-700' : i === 1 ? 'text-sky-700' : i === 2 ? 'text-amber-700' : 'text-mint-700'
                    }`} />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-forest-800 text-mint-300 rounded-full flex items-center justify-center text-xs font-black">
                    {step.step}
                  </span>
                </div>
                <h4 className="font-display font-black text-gray-900 text-sm mb-2">{step.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={`mt-14 text-center transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
          <Link to="/expert" className="btn-glow text-base !px-10 !py-4" id="escrow-hire-btn">
            <ShieldCheck className="w-5 h-5" />
            Book a Specialist — Zero Risk
          </Link>
          <p className="text-xs text-gray-400 mt-3">Funds held in escrow · Released only on your confirmation</p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// E. IMPACT STATS SECTION (refined)
// ─────────────────────────────────────────────────────────────────────────────
function ImpactSection() {
  const [ref, isInView] = useInView();
  const [platformStats, setPlatformStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    fetchPlatformStats()
      .then((data) => {
        // Ensure data is an object with all expected properties
        const safeData = data || {};
        setPlatformStats({
          totalUsers: safeData.totalUsers ?? 0,
          activeJobs: safeData.activeJobs ?? 0,
          countriesCovered: safeData.countriesCovered ?? 0,
          communitiesReached: safeData.communitiesReached ?? 0,
          successfulPlacements: safeData.successfulPlacements ?? 0,
          fieldEvangelists: safeData.fieldEvangelists ?? 0,
        });
        setStatsError(false);
      })
      .catch((err) => {
        console.warn('[HomePage] Failed to fetch platform stats:', err);
        setStatsError(true);
        // Provide safe defaults
        setPlatformStats({
          totalUsers: 0,
          activeJobs: 0,
          countriesCovered: 0,
          communitiesReached: 0,
          successfulPlacements: 0,
          fieldEvangelists: 0,
        });
      })
      .finally(() => setStatsLoading(false));
  }, []);

  if (!platformStats) {
    return null;
  }

  const stats = [
    { value: platformStats.totalUsers,           label: 'Active Users',      suffix: '+', icon: Users },
    { value: platformStats.activeJobs,           label: 'Job Listings',      suffix: '+', icon: Briefcase },
    { value: platformStats.countriesCovered,     label: 'Countries',         suffix: '',  icon: MapPin },
    { value: platformStats.communitiesReached,   label: 'Communities',       suffix: '+', icon: Globe },
    { value: platformStats.successfulPlacements, label: 'Placements',        suffix: '+', icon: TrendingUp },
    { value: platformStats.fieldEvangelists,     label: 'Field Evangelists', suffix: '+', icon: Sparkles },
  ];

  return (
    <section id="impact" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900 to-agro-950" />
      <div className="absolute inset-0 bg-dots opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-mint-500/8 blob-shape blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-earth-500/8 blob-shape-2 blur-3xl" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest-800/60 border border-forest-700/40 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-mint-400" />
            <span className="text-sm font-semibold text-mint-300">Our Impact Across Africa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white mb-5">
            Numbers That{' '}
            <span className="bg-gradient-to-r from-mint-400 to-agro-400 bg-clip-text text-transparent">
              Tell Our Story
            </span>
          </h2>
          <p className="text-lg text-gray-300/80 leading-relaxed">
            From Lagos to Nairobi, Dakar to Accra — Agro Africa Net is transforming how the continent approaches agricultural employment and expert consultation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6">
          {(stats || []).map((stat, i) => (
            <div
              key={i}
              className={`group relative p-6 lg:p-8 glass-card-dark text-center hover:bg-forest-800/40 transition-all duration-500 hover:-translate-y-1 cursor-default ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <stat.icon className="w-8 h-8 text-mint-400/70 mx-auto mb-4 group-hover:text-mint-400 transition-colors" />
              <p className="text-3xl lg:text-4xl font-display font-black text-white mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2500} />
              </p>
              <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// F. FINAL CTA SECTION
// ─────────────────────────────────────────────────────────────────────────────
function CTASection() {
  const [ref, isInView] = useInView();

  return (
    <section id="cta" className="relative py-24 lg:py-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-dots opacity-25" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-forest-900 via-forest-800 to-agro-900" />
          <div className="absolute inset-0 bg-grid opacity-10" />
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-mint-400/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-agro-500/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

          <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <Leaf className="w-4 h-4 text-mint-300" />
              <span className="text-sm font-semibold text-mint-200">Join the Movement</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white mb-6 max-w-3xl mx-auto">
              Ready to Transform Agriculture in Africa?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you're an employer seeking talent, a professional chasing opportunities, or a champion of agricultural innovation — your journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" id="cta-create-account-btn"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-forest-800 font-black rounded-xl shadow-xl hover:shadow-2xl hover:bg-mint-50 active:scale-[0.98] transition-all duration-300 text-base"
              >
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/expert" id="cta-hire-expert-btn"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-mint-400/50 hover:bg-mint-400/10 hover:border-mint-300 active:scale-[0.98] transition-all duration-300 text-base"
              >
                <Zap className="w-5 h-5 text-mint-400" />
                Hire an Expert Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage({ currentUser, onLogout }) {
  return (
    <div className="min-h-screen bg-white custom-scrollbar">
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <HeroSection />
      <FeatureMatrixSection />
      <LiveMarketplaceSection />
      <EscrowTrustSection />
      <ImpactSection />
      <CTASection />
      <Footer />
    </div>
  );
}
