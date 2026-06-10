import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Leaf, ArrowRight, Home, Briefcase, UserCircle
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
    { label: 'Profile', to: '/profile', icon: UserCircle },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

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
              <span className="text-xl font-display font-bold text-agro-900">
                AgroNet
              </span>
              <span className="text-xl font-display font-bold text-agro-500 ml-1">
                Africa
              </span>
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
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/profile" className="btn-ghost text-sm" id="nav-login-btn">
              Log In
            </Link>
            <Link to="/jobs" className="btn-primary text-sm !px-6 !py-2.5" id="nav-signup-btn">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
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
            isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
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
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
              <Link to="/profile" className="w-full btn-ghost text-sm justify-center block text-center">
                Log In
              </Link>
              <Link to="/jobs" className="w-full btn-primary text-sm justify-center flex">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
