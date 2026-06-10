import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, ChevronRight, ArrowRight, Users, Briefcase,
  MapPin, Star, Shield, Zap, Globe, Heart, Building2,
  UserSearch, Megaphone, CheckCircle, TrendingUp, Sprout,
  Sun, ChevronDown, ExternalLink
} from 'lucide-react';
import { ROLE_INFO, USER_ROLES, PLATFORM_STATS } from '../data/mockDatabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ===== Intersection Observer Hook =====
function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
}

// ===== Animated Counter Component =====
function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView();

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ===== Role Icon Component =====
function RoleIcon({ role, className = "w-8 h-8" }) {
  const icons = {
    Building2: Building2,
    UserSearch: UserSearch,
    Megaphone: Megaphone,
  };
  const Icon = icons[role] || Leaf;
  return <Icon className={className} />;
}

// ===== Floating Decorative Elements =====
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Organic blob shapes */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-agro-200/30 blob-shape animate-float blur-3xl" />
      <div className="absolute top-1/3 -left-24 w-72 h-72 bg-agro-300/20 blob-shape-2 animate-float-delayed blur-2xl" />
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-earth-200/20 blob-shape animate-float blur-2xl" />
      
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 bg-dots opacity-40" />
    </div>
  );
}

// ===== Hero Section =====
function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <FloatingElements />

      {/* Hero background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-agro-50 via-white to-earth-50/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="animate-fade-in-down inline-flex items-center gap-2 px-4 py-2 bg-agro-100/80 backdrop-blur-sm border border-agro-200/60 rounded-full">
              <Sprout className="w-4 h-4 text-agro-600" />
              <span className="text-sm font-medium text-agro-700">
                Growing Africa's Agricultural Future
              </span>
            </div>

            {/* Headline */}
            <div className="animate-fade-in-up space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.1] tracking-tight">
                <span className="text-agro-950">Connect.</span>
                <br />
                <span className="text-gradient-green">Cultivate.</span>
                <br />
                <span className="text-agro-950">Thrive.</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed">
                AgroNet Africa is the continent's premier platform connecting 
                <span className="font-semibold text-agro-700"> agribusinesses</span>, 
                <span className="font-semibold text-earth-700"> job seekers</span>, and 
                <span className="font-semibold text-soil-600"> community evangelists</span> to 
                build a sustainable agricultural future.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up stagger-2 flex flex-wrap gap-4">
              <Link to="/jobs" className="btn-primary text-base" id="hero-explore-btn">
                Explore Opportunities
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#about" className="btn-secondary text-base" id="hero-learn-btn">
                Learn More
                <ChevronDown className="w-5 h-5" />
              </a>
            </div>

            {/* Social proof */}
            <div className="animate-fade-in stagger-4 flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {['bg-agro-400', 'bg-earth-400', 'bg-soil-400', 'bg-agro-600'].map((bg, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 ${bg} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md`}
                  >
                    {['AO', 'KA', 'AW', 'FD'][i]}
                  </div>
                ))}
                <div className="w-10 h-10 bg-agro-100 rounded-full border-2 border-white flex items-center justify-center text-agro-700 text-xs font-bold shadow-md">
                  +12K
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-earth-400 text-earth-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  Trusted by 12,000+ users across Africa
                </p>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative animate-fade-in stagger-3">
            {/* Main illustration card */}
            <div className="relative z-10">
              <div className="glass-card p-8 lg:p-10 space-y-6">
                {/* Map silhouette with dots */}
                <div className="relative h-64 bg-gradient-to-br from-agro-100 to-agro-50 rounded-2xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-grid opacity-50" />
                  <div className="relative text-center space-y-4">
                    <Globe className="w-20 h-20 text-agro-400 mx-auto animate-pulse-gentle" />
                    <div>
                      <p className="text-3xl font-display font-bold text-agro-800">
                        <AnimatedCounter target={18} />
                      </p>
                      <p className="text-sm text-agro-600 font-medium">
                        African Countries
                      </p>
                    </div>
                  </div>
                  {/* Animated connection dots */}
                  {[
                    'top-8 left-12', 'top-16 right-16', 'bottom-12 left-1/4',
                    'bottom-20 right-1/3', 'top-1/3 left-8'
                  ].map((pos, i) => (
                    <div
                      key={i}
                      className={`absolute ${pos} w-3 h-3 bg-agro-500 rounded-full shadow-lg shadow-agro-500/50`}
                      style={{ animation: `pulseGentle 3s ease-in-out ${i * 0.5}s infinite` }}
                    />
                  ))}
                </div>

                {/* Quick stats row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: PLATFORM_STATS.activeJobs, label: 'Active Jobs', suffix: '+' },
                    { value: PLATFORM_STATS.totalUsers, label: 'Users', suffix: '+' },
                    { value: PLATFORM_STATS.successfulPlacements, label: 'Placements', suffix: '+' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-3 bg-agro-50/60 rounded-xl">
                      <p className="text-xl font-display font-bold text-agro-800">
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute -top-6 -right-6 w-full h-full bg-gradient-to-br from-agro-200 to-agro-300 rounded-2xl -z-10 rotate-3" />
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-gradient-to-br from-earth-100 to-earth-200 rounded-2xl -z-20 -rotate-2" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-agro-400" />
      </div>
    </section>
  );
}

// ===== About Section =====
function AboutSection() {
  const [ref, isInView] = useInView();

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Matching',
      description: 'Our intelligent system matches job seekers with the perfect agricultural roles based on skills, location, and career goals.',
    },
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'Every employer and job seeker is verified to ensure trust and safety across the platform.',
    },
    {
      icon: Globe,
      title: 'Pan-African Reach',
      description: 'Operating across 18 countries with local community evangelists ensuring grassroots accessibility.',
    },
    {
      icon: Heart,
      title: 'Sustainable Focus',
      description: 'Dedicated to promoting sustainable farming practices and green agricultural innovation across the continent.',
    },
  ];

  return (
    <section id="about" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-agro-100 rounded-full mb-6">
            <Sun className="w-4 h-4 text-agro-600" />
            <span className="text-sm font-medium text-agro-700">Why AgroNet Africa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-agro-950 mb-6">
            Empowering Africa's{' '}
            <span className="text-gradient-green">Agricultural Revolution</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            AgroNet Africa bridges the gap between agricultural talent and opportunity. 
            We're building an ecosystem where agribusinesses thrive, job seekers find 
            meaningful careers, and community evangelists drive grassroots adoption of 
            sustainable farming practices.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-6 rounded-2xl border border-gray-100 bg-white hover:bg-agro-50/50 hover:border-agro-200 transition-all duration-500 hover:shadow-xl hover:shadow-agro-100/50 hover:-translate-y-1 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-agro-100 to-agro-200 rounded-xl flex items-center justify-center mb-4 group-hover:from-agro-200 group-hover:to-agro-300 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-agro-700" />
              </div>
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== Roles Section =====
function RolesSection() {
  const [ref, isInView] = useInView();
  const roles = Object.values(USER_ROLES);

  const colorMap = {
    agro: {
      gradient: 'from-agro-500 to-agro-700',
      bg: 'bg-agro-50',
      border: 'border-agro-200',
      hoverBorder: 'hover:border-agro-400',
      iconBg: 'bg-agro-100',
      text: 'text-agro-700',
      badge: 'bg-agro-100 text-agro-700',
      check: 'text-agro-500',
      button: 'bg-agro-600 hover:bg-agro-700',
    },
    earth: {
      gradient: 'from-earth-500 to-earth-700',
      bg: 'bg-earth-50',
      border: 'border-earth-200',
      hoverBorder: 'hover:border-earth-400',
      iconBg: 'bg-earth-100',
      text: 'text-earth-700',
      badge: 'bg-earth-100 text-earth-700',
      check: 'text-earth-500',
      button: 'bg-earth-600 hover:bg-earth-700',
    },
    soil: {
      gradient: 'from-soil-500 to-soil-700',
      bg: 'bg-soil-50',
      border: 'border-soil-200',
      hoverBorder: 'hover:border-soil-400',
      iconBg: 'bg-soil-100',
      text: 'text-soil-700',
      badge: 'bg-soil-100 text-soil-700',
      check: 'text-soil-500',
      button: 'bg-soil-600 hover:bg-soil-700',
    },
  };

  // Map roles to routes
  const roleRoutes = {
    employer: '/jobs',
    seeker: '/profile',
    evangelist: '/',
  };

  return (
    <section id="roles" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-agro-50/50 via-white to-agro-50/30" />
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-agro-100 rounded-full mb-6">
            <Users className="w-4 h-4 text-agro-600" />
            <span className="text-sm font-medium text-agro-700">Choose Your Path</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-agro-950 mb-6">
            Three Ways to{' '}
            <span className="text-gradient-green">Make an Impact</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Whether you're hiring, job hunting, or championing change in your community — 
            AgroNet Africa has a role designed for you.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((roleKey, index) => {
            const role = ROLE_INFO[roleKey];
            const colors = colorMap[role.color];

            return (
              <div
                key={role.id}
                id={`role-card-${role.id}`}
                className={`group relative rounded-2xl border-2 ${colors.border} ${colors.hoverBorder} bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Card Header */}
                <div className={`relative p-6 pb-8 bg-gradient-to-br ${colors.gradient} text-white overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                  <div className="relative">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                      <RoleIcon role={role.icon} className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-display font-bold mb-1">
                      {role.title}
                    </h3>
                    <p className="text-sm text-white/80">
                      {role.subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-5">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {role.description}
                  </p>

                  {/* Benefits list */}
                  <ul className="space-y-3">
                    {role.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className={`w-5 h-5 ${colors.check} flex-shrink-0 mt-0.5`} />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    to={roleRoutes[role.id]}
                    id={`role-btn-${role.id}`}
                    className={`w-full py-3 px-6 ${colors.button} text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]`}
                  >
                    Get Started as {role.title.split(' ').pop()}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ===== Impact Stats Section =====
function ImpactSection() {
  const [ref, isInView] = useInView();

  const stats = [
    { value: PLATFORM_STATS.totalUsers, label: 'Active Users', suffix: '+', icon: Users },
    { value: PLATFORM_STATS.activeJobs, label: 'Job Listings', suffix: '+', icon: Briefcase },
    { value: PLATFORM_STATS.countriesCovered, label: 'Countries', suffix: '', icon: MapPin },
    { value: PLATFORM_STATS.communitiesReached, label: 'Communities', suffix: '+', icon: Globe },
    { value: PLATFORM_STATS.successfulPlacements, label: 'Placements', suffix: '+', icon: TrendingUp },
    { value: PLATFORM_STATS.fieldEvangelists, label: 'Evangelists', suffix: '+', icon: Megaphone },
  ];

  return (
    <section id="impact" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-agro-900 via-agro-950 to-agro-900" />
      <div className="absolute inset-0 bg-dots opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-agro-500/10 blob-shape blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-earth-500/10 blob-shape-2 blur-3xl" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-agro-800/60 border border-agro-700/40 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-agro-400" />
            <span className="text-sm font-medium text-agro-300">Our Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Numbers That{' '}
            <span className="text-gradient-earth">Tell Our Story</span>
          </h2>
          <p className="text-lg text-agro-200/80 leading-relaxed">
            From Lagos to Nairobi, Dakar to Accra — AgroNet Africa is 
            transforming how the continent approaches agricultural employment.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative p-6 lg:p-8 glass-card-dark text-center hover:bg-agro-800/40 transition-all duration-500 hover:-translate-y-1 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <stat.icon className="w-8 h-8 text-agro-400 mx-auto mb-4 group-hover:text-agro-300 transition-colors" />
              <p className="text-3xl lg:text-4xl font-display font-bold text-white mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2500} />
              </p>
              <p className="text-sm text-agro-300 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== Community CTA Section =====
function CommunitySection() {
  const [ref, isInView] = useInView();

  return (
    <section id="community" className="relative py-24 lg:py-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-dots opacity-30" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-agro-600 via-agro-500 to-agro-600 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

          <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Leaf className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Join the Movement</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6 max-w-3xl mx-auto">
              Ready to Transform Agriculture in Africa?
            </h2>
            <p className="text-lg text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you're an employer seeking talent, a professional chasing opportunities, 
              or a champion of agricultural innovation — your journey starts here.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-agro-700 font-bold rounded-xl shadow-xl shadow-agro-900/20 hover:shadow-2xl hover:bg-agro-50 active:scale-[0.98] transition-all duration-300 text-base"
                id="cta-create-account-btn"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white/40 hover:bg-white/10 hover:border-white/60 active:scale-[0.98] transition-all duration-300 text-base"
                id="cta-browse-jobs-btn"
              >
                Browse Jobs
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// ===== MAIN HOME PAGE COMPONENT =====
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white custom-scrollbar">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <RolesSection />
      <ImpactSection />
      <CommunitySection />
      <Footer />
    </div>
  );
}
