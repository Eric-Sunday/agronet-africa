import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, SlidersHorizontal, MapPin, Star, ShieldCheck, Zap,
  CheckCircle, Clock, Users, Award, CalendarCheck, Filter, X,
  Leaf, ChevronRight
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BookingModal from './BookingModal';
import { MOCK_EXPERTS, EXPERT_SPECIALTIES } from '../../data/mockData';

// ─────────────────────────────────────────────────────────────────────────────
// ExpertDirectoryPage — /expert
// Hire an Expert: sidebar filters + expert grid + booking modal
// ─────────────────────────────────────────────────────────────────────────────
export default function ExpertDirectoryPage({ currentUser, onLogout, onAddContract }) {
  const navigate = useNavigate();

  // ── Filter State ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedSpec, setSelectedSpec]     = useState('All Specialties');
  const [selectedAvail, setSelectedAvail]   = useState('All');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ── Booking Modal State ───────────────────────────────────────────────────
  const [bookingExpert, setBookingExpert]   = useState(null);

  // ── Filtered Experts ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return MOCK_EXPERTS.filter((exp) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        exp.name.toLowerCase().includes(q) ||
        exp.specialty.toLowerCase().includes(q) ||
        exp.location.toLowerCase().includes(q) ||
        exp.bio.toLowerCase().includes(q);
      const matchSpec  = selectedSpec  === 'All Specialties' || exp.specialty === selectedSpec;
      const matchAvail = selectedAvail === 'All' || exp.availability === selectedAvail;
      return matchSearch && matchSpec && matchAvail;
    });
  }, [searchQuery, selectedSpec, selectedAvail]);

  // ── Booking handler ───────────────────────────────────────────────────────
  const handleInitiateEscrow = ({ expert, pkg, description, amount }) => {
    const contract = {
      id: `con_${Date.now()}`,
      expertId: expert.id,
      expertName: expert.name,
      expertInitials: expert.initials,
      expertAvatarColor: expert.avatarColor,
      specialty: expert.specialty,
      package: pkg.label,
      description,
      amount,
      stateIndex: 0,
      createdAt: new Date().toISOString().split('T')[0],
      milestoneLabel: `${pkg.label} — Delivery & Confirmation`,
    };
    onAddContract(contract);
    navigate('/expert/escrow-dashboard');
  };

  const formatNaira = (n) => '₦' + n.toLocaleString('en-NG');

  const renderStars = (rating) => {
    const full  = Math.floor(rating);
    const frac  = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < full ? 'text-amber-400 fill-amber-400'
              : (frac && i === full) ? 'text-amber-400 fill-amber-200'
              : 'text-gray-300 fill-gray-100'
            }`}
          />
        ))}
      </div>
    );
  };

  // ── Sidebar Component ─────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-display font-bold text-gray-900 text-sm mb-1">Filter Experts</h3>
        <p className="text-xs text-gray-500">Refine your search</p>
      </div>

      {/* Specialty Filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Specialty
        </label>
        <div className="space-y-1">
          {['All Specialties', ...EXPERT_SPECIALTIES].map((spec) => (
            <button
              key={spec}
              id={`filter-spec-${spec.replace(/\s/g, '-').toLowerCase()}`}
              onClick={() => setSelectedSpec(spec)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                selectedSpec === spec
                  ? 'bg-agro-100 text-agro-800 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Availability
        </label>
        <div className="space-y-1">
          {['All', 'Available', 'Busy'].map((avail) => (
            <button
              key={avail}
              id={`filter-avail-${avail.toLowerCase()}`}
              onClick={() => setSelectedAvail(avail)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-150 cursor-pointer ${
                selectedAvail === avail
                  ? 'bg-agro-100 text-agro-800 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                avail === 'Available' ? 'bg-emerald-500'
                : avail === 'Busy' ? 'bg-amber-400'
                : 'bg-gray-300'
              }`} />
              {avail}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedSpec !== 'All Specialties' || selectedAvail !== 'All' || searchQuery) && (
        <button
          id="clear-filters-btn"
          onClick={() => { setSelectedSpec('All Specialties'); setSelectedAvail('All'); setSearchQuery(''); }}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/60 biophilic-overlay">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      {/* ── Page Hero ── */}
      <section className="pt-28 pb-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium breadcrumb badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-earth">
              <Zap className="w-3 h-3" />
              Agrilencer Premium
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm text-gray-500">Expert Directory</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                Hire a Field Expert
              </h1>
              <p className="mt-2 text-gray-600 max-w-xl">
                Book on-demand consultations with verified Nigerian agricultural specialists.
                All contracts are protected by AgroNet Escrow.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-agro-700">8+</p>
                <p className="text-xs text-gray-500">Verified Experts</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-agro-700">₦0</p>
                <p className="text-xs text-gray-500">Platform Fee</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-agro-700">100%</p>
                <p className="text-xs text-gray-500">Escrow Protected</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="expert-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, specialty, or location…"
              className="input-field !pl-12 !pr-4"
            />
          </div>
        </div>
      </section>

      {/* ── Body: Sidebar + Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-5 md:hidden">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filtered.length}</span> expert{filtered.length !== 1 ? 's' : ''} found
          </p>
          <button
            id="mobile-filter-toggle"
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-agro-700 border border-agro-300 rounded-xl hover:bg-agro-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
            <div className="w-72 bg-white shadow-2xl p-6 overflow-y-auto custom-scrollbar animate-slide-in-right">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-gray-900">Filters</h3>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <SidebarContent />
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="glass-card p-5 sticky top-24">
              <SidebarContent />
            </div>
          </aside>

          {/* ── Expert Grid ── */}
          <main className="flex-1 min-w-0">
            {/* Result count (desktop) */}
            <div className="hidden md:flex items-center justify-between mb-5">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filtered.length}</span> expert{filtered.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filtered.length === 0 ? (
              /* Empty state */
              <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-display font-semibold text-gray-700 text-lg">No Experts Found</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xs">
                  Try adjusting your filters or clearing your search to see all available specialists.
                </p>
                <button
                  onClick={() => { setSelectedSpec('All Specialties'); setSelectedAvail('All'); setSearchQuery(''); }}
                  className="btn-secondary mt-4 !px-6 !py-2.5 text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filtered.map((expert) => (
                  <ExpertCard
                    key={expert.id}
                    expert={expert}
                    onBook={() => setBookingExpert(expert)}
                    formatNaira={formatNaira}
                    renderStars={renderStars}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Booking Modal ── */}
      {bookingExpert && (
        <BookingModal
          expert={bookingExpert}
          onClose={() => setBookingExpert(null)}
          onInitiateEscrow={handleInitiateEscrow}
        />
      )}

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ExpertCard — individual specialist card
// ─────────────────────────────────────────────────────────────────────────────
function ExpertCard({ expert, onBook, formatNaira, renderStars }) {
  const isAvailable = expert.availability === 'Available';

  return (
    <div className="glass-card p-5 card-hover group flex flex-col h-full">
      {/* Card top: Avatar + meta */}
      <div className="flex gap-4 mb-4">
        {/* Avatar */}
        <div className={`w-16 h-16 bg-gradient-to-br ${expert.avatarColor} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
          <span className="text-white font-bold font-display text-xl">{expert.initials}</span>
        </div>

        {/* Name + Meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-gray-900 text-sm leading-tight">{expert.name}</h3>
              <p className="text-agro-700 font-semibold text-xs mt-0.5">{expert.specialty}</p>
            </div>
            {/* Availability dot */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
              isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              {expert.availability}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {expert.location}
          </p>
        </div>
      </div>

      {/* Title line */}
      <p className="text-xs text-gray-500 italic mb-3">{expert.title}</p>

      {/* Bio */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-3">{expert.bio}</p>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {expert.isVerified && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-agro-50 border border-agro-200 text-agro-700 text-xs font-semibold rounded-full">
            <ShieldCheck className="w-3 h-3" />
            Verified
          </span>
        )}
        {expert.isPremium && (
          <span className="badge-earth">
            <Zap className="w-3 h-3" />
            Premium
          </span>
        )}
        {expert.badges.includes('Top Rated') && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full">
            <Award className="w-3 h-3" />
            Top Rated
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
        <div className="flex items-center gap-1.5">
          {renderStars(expert.rating)}
          <span className="text-xs font-bold text-gray-700">{expert.rating}</span>
          <span className="text-xs text-gray-400">({expert.reviewCount})</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <CalendarCheck className="w-3.5 h-3.5 text-agro-500" />
          <span>{expert.completedProjects} projects</span>
        </div>
      </div>

      {/* Rate + CTA */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">Starting from</p>
          <p className="font-display font-bold text-agro-700 text-base">{formatNaira(expert.hourlyRate)}<span className="text-xs font-normal text-gray-500">/hr</span></p>
        </div>
        <button
          id={`book-btn-${expert.id}`}
          onClick={onBook}
          className="btn-primary !px-5 !py-2.5 text-sm"
        >
          Book Consultation
        </button>
      </div>
    </div>
  );
}
