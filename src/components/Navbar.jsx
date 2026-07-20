import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Leaf, ArrowRight, Briefcase, Zap, ShieldCheck,
  LogOut, LogIn, PlusCircle, UserCircle
} from 'lucide-react';

export default function Navbar({ currentUser, onLogout }) {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // ── Center nav links ───────────────────────────────────────────────────────
  const centerLinks = [
    { label: 'Find Long-term Jobs',   to: '/jobs',    icon: Briefcase },
    { label: 'Hire an Expert',        to: '/expert',  icon: Zap,        premium: true },
    { label: 'Post a Requirement',    to: '/jobs',    icon: PlusCircle  },
  ];

  // ── Auth / user links (mobile only) ───────────────────────────────────────
  const mobileExtras = [
    { label: 'My Escrow Contracts',  to: '/expert/escrow-dashboard', icon: ShieldCheck },
    { label: 'My Profile',           to: '/profile',                 icon: UserCircle  },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    onLogout?.();
    navigate('/');
  };

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  const roleLabel = (role) => role ? role.replace('_', ' ') : '';

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-900/5 py-3'
          : 'bg-white/80 backdrop-blur-lg py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0" id="nav-logo">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-forest-700 to-agro-600 rounded-xl flex items-center justify-center shadow-lg shadow-agro-500/30 group-hover:shadow-agro-500/50 transition-shadow duration-300">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-mint-400 rounded-full animate-pulse-gentle" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-display font-bold text-forest-900">Agro Africa</span>
              <span className="text-xl font-display font-bold text-agro-500 ml-1">Net</span>
            </div>
          </Link>

          {/* ── Center Nav Links (Desktop) ── */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {centerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                id={`nav-link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap ${
                  isActive(link.to)
                    ? 'bg-agro-100 text-forest-800 font-semibold'
                    : 'text-gray-600 hover:text-forest-800 hover:bg-gray-100'
                }`}
              >
                <link.icon className="w-4 h-4 flex-shrink-0" />
                {link.label}
                {link.premium && (
                  <span className="badge-premium flex-shrink-0">✦ New</span>
                )}
              </Link>
            ))}
          </div>

          {/* ── Right: Auth Buttons (Desktop) ── */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors group">
                  <div className="w-9 h-9 bg-gradient-to-br from-forest-600 to-agro-700 rounded-lg flex items-center justify-center shadow-sm">
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
              <>
                <Link
                  to="/login"
                  className="btn-ghost text-sm !px-5 !py-2.5"
                  id="nav-signin-btn"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-glow text-sm !px-6 !py-2.5"
                  id="nav-register-btn"
                >
                  Register <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Menu Toggle ── */}
          <button
            id="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
            isOpen ? 'max-h-[700px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="glass-card p-4 space-y-1">
            {/* Center links */}
            {centerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-agro-100 text-forest-800'
                    : 'text-gray-700 hover:text-forest-800 hover:bg-gray-100'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
                {link.premium && <span className="ml-auto badge-premium">✦ New</span>}
              </Link>
            ))}

            {/* Extras */}
            <div className="pt-2 border-t border-gray-100 space-y-1">
              {mobileExtras.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-forest-800 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-agro-50 rounded-xl">
                    <div className="w-9 h-9 bg-gradient-to-br from-forest-600 to-agro-700 rounded-lg flex items-center justify-center">
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
                    <LogIn className="w-4 h-4" /> Sign In
                  </Link>
                  <Link to="/register" className="w-full btn-glow text-sm justify-center flex">
                    Register <ArrowRight className="w-4 h-4 ml-1" />
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
