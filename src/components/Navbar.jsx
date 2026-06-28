import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Leaf, ArrowRight, Home, Briefcase, UserCircle, Radio, LogOut, LogIn,
  ShieldCheck, Zap
} from 'lucide-react';

export default function Navbar({ currentUser, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Job Board', to: '/jobs', icon: Briefcase },
    { label: 'The Kilombo', to: '/kilombo', icon: Radio },
    { label: 'Profile', to: '/profile', icon: UserCircle },
    { label: 'Hire an Expert', to: '/expert', icon: Zap, premium: true },
    { label: 'My Escrow', to: '/expert/escrow-dashboard', icon: ShieldCheck },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    onLogout?.();
    navigate('/');
  };

  // Role label shortener
  const roleLabel = (role) => {
    if (!role) return '';
    return role.replace('_', ' ').replace('Agribusiness ', 'Employer ');
  };

  // Get initials for avatar
  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-agro-900/5 py-3'
          : 'bg-white/70 backdrop-blur-lg py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-agro-500 to-agro-700 rounded-xl flex items-center justify-center shadow-lg shadow-agro-500/30 group-hover:shadow-agro-500/50 transition-shadow duration-300">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-earth-400 rounded-full animate-pulse-gentle" />
            </div>
            <div>
              <span className="text-xl font-display font-bold text-agro-900">AgroNet</span>
              <span className="text-xl font-display font-bold text-agro-500 ml-1">Africa</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                id={`nav-link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive(link.to)
                    ? 'bg-agro-100 text-agro-800 shadow-sm'
                    : 'text-gray-600 hover:text-agro-700 hover:bg-agro-50'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
                {link.premium && (
                  <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold bg-earth-100 text-earth-700 border border-earth-200 rounded-full leading-none">
                    PRO
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              // â”€â”€ Logged-in state â”€â”€
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-agro-50 transition-colors group">
                  <div className="w-9 h-9 bg-gradient-to-br from-agro-500 to-agro-700 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">{initials}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{currentUser.name.split(' ')[0]}</p>
                    <p className="text-xs text-agro-600 leading-tight">{roleLabel(currentUser.role)}</p>
                  </div>
                </Link>
                <button
                  id="nav-logout-btn"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            ) : (
              // â”€â”€ Logged-out state â”€â”€
              <>
                <Link to="/login" className="btn-ghost text-sm" id="nav-login-btn">
                  <LogIn className="w-4 h-4" /> Log In
                </Link>
                <Link to="/register" className="btn-primary text-sm !px-6 !py-2.5" id="nav-signup-btn">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-agro-50 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
            isOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="glass-card p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-agro-100 text-agro-800'
                    : 'text-gray-700 hover:text-agro-700 hover:bg-agro-50'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
                {link.premium && (
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-earth-100 text-earth-700 border border-earth-200 rounded-full">
                    PRO
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-agro-50 rounded-xl">
                    <div className="w-9 h-9 bg-gradient-to-br from-agro-500 to-agro-700 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-agro-600">{roleLabel(currentUser.role)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full btn-ghost text-sm justify-center flex">
                    <LogIn className="w-4 h-4" /> Log In
                  </Link>
                  <Link to="/register" className="w-full btn-primary text-sm justify-center flex">
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

