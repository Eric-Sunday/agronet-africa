import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    Platform: [
      { label: 'Browse Jobs',          to: '/jobs'    },
      { label: 'Post a Job',            to: '/jobs'    },
      { label: 'Hire an Expert ✦',      to: '/expert'  },
      { label: 'My Escrow Contracts',   to: '/expert/escrow-dashboard' },
    ],
    Community: [
      { label: 'Field Evangelists', to: '/' },
      { label: 'Forum', to: '/' },
      { label: 'Success Stories', to: '/' },
      { label: 'Events', to: '/' },
    ],
    Company: [
      { label: 'About Us', to: '/' },
      { label: 'Careers', to: '/jobs' },
      { label: 'Press', to: '/' },
      { label: 'Contact', to: '/' },
    ],
    Legal: [
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Service', to: '/' },
      { label: 'Cookie Policy', to: '/' },
    ],
  };

  return (
    <footer className="relative bg-agro-950 text-white overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-agro-500 to-agro-700 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-display font-bold">
                AgroNet<span className="text-agro-400 ml-1">Africa</span>
              </span>
            </Link>
            <p className="text-sm text-agro-300/70 leading-relaxed">
              Building the future of agricultural employment across the African continent.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-agro-200 mb-4 uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-agro-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-agro-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-agro-500">
            © {new Date().getFullYear()} AgroNet Africa. All rights reserved.
          </p>
          <p className="text-xs text-agro-600">
            🌱 Growing Africa's agricultural future, one connection at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}
