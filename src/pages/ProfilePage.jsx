import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, MapPin, Calendar, Award, Plus, X, Edit3,
  CheckCircle, Star, Briefcase, BookOpen, Shield,
  FileText, ExternalLink, Sparkles, GraduationCap,
  Save, Camera, Rocket, ArrowRight, Target, Zap,
  ChevronRight, Building2, DollarSign, Clock, Tag
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mapDreamToCareer } from '../data/careerMapper';

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
    }, { threshold: 0.1, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, isInView];
}

// ===== Certificate Card =====
function CertificateCard({ cert, index, onRemove }) {
  const [ref, isInView] = useInView();

  const statusColors = {
    Completed: 'bg-agro-100 text-agro-700 border-agro-200',
    'In Progress': 'bg-earth-100 text-earth-700 border-earth-200',
    Planned: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <div
      ref={ref}
      className={`group relative bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-agro-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-400 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Remove button */}
      <button
        onClick={() => onRemove(cert.id)}
        className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
        title="Remove certificate"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          cert.status === 'Completed' ? 'bg-agro-100' : cert.status === 'In Progress' ? 'bg-earth-100' : 'bg-gray-100'
        }`}>
          <Award className={`w-6 h-6 ${
            cert.status === 'Completed' ? 'text-agro-600' : cert.status === 'In Progress' ? 'text-earth-600' : 'text-gray-500'
          }`} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-gray-900 text-sm leading-tight mb-1">
            {cert.title}
          </h4>
          <p className="text-xs text-gray-500 mb-2">{cert.issuer}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${statusColors[cert.status]}`}>
              {cert.status === 'Completed' && <CheckCircle className="w-3 h-3 inline mr-1" />}
              {cert.status}
            </span>
            {cert.date && (
              <span className="text-xs text-gray-400">
                <Calendar className="w-3 h-3 inline mr-1" />
                {cert.date}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ===== Timeline Step Component =====
function TimelineStep({ step, index, totalSteps, isVisible }) {
  const phaseColors = {
    Foundation: { bg: 'bg-agro-100', border: 'border-agro-300', text: 'text-agro-700', dot: 'bg-agro-500', line: 'from-agro-400 to-agro-300', glow: 'shadow-agro-500/30' },
    Specialization: { bg: 'bg-earth-100', border: 'border-earth-300', text: 'text-earth-700', dot: 'bg-earth-500', line: 'from-earth-400 to-earth-300', glow: 'shadow-earth-500/30' },
    'Advanced Training': { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700', dot: 'bg-purple-500', line: 'from-purple-400 to-purple-300', glow: 'shadow-purple-500/30' },
    Leadership: { bg: 'bg-soil-100', border: 'border-soil-300', text: 'text-soil-700', dot: 'bg-soil-500', line: 'from-soil-400 to-soil-300', glow: 'shadow-soil-500/30' },
  };

  const colors = phaseColors[step.phase] || phaseColors.Foundation;
  const isLast = index === totalSteps - 1;

  return (
    <div
      className={`relative flex gap-5 sm:gap-8 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
      }`}
      style={{ transitionDelay: `${index * 250 + 400}ms` }}
    >
      {/* Timeline Line & Dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Dot */}
        <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full ${colors.dot} flex items-center justify-center shadow-lg ${colors.glow} z-10`}>
          <span className="text-white text-sm sm:text-base font-bold">{step.stepNumber}</span>
          {/* Pulse ring */}
          <div className={`absolute inset-0 rounded-full ${colors.dot} animate-ping opacity-20`} />
        </div>

        {/* Connecting line */}
        {!isLast && (
          <div className={`w-0.5 flex-1 min-h-[2rem] bg-gradient-to-b ${colors.line} opacity-40`} />
        )}
      </div>

      {/* Content Card */}
      <div className={`flex-1 pb-8 ${isLast ? '' : ''}`}>
        <div className={`relative p-5 sm:p-6 rounded-2xl border-2 ${colors.border} bg-white hover:shadow-xl transition-shadow duration-300`}>
          {/* Phase badge & Duration */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className={`px-3 py-1 ${colors.bg} ${colors.text} text-xs font-bold rounded-full uppercase tracking-wider`}>
              {step.phase}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {step.duration}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-base sm:text-lg font-display font-bold text-gray-900 mb-2">
            {step.title}
          </h4>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {step.description}
          </p>

          {/* Skills */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Skills to acquire
            </p>
            <div className="flex flex-wrap gap-2">
              {step.skills.map((skill) => (
                <span key={skill} className={`px-3 py-1.5 ${colors.bg} ${colors.text} text-xs font-medium rounded-lg border ${colors.border}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Badge (if applicable) */}
          {step.badge && (
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-agro-50 to-earth-50 rounded-xl border border-agro-200/60">
              <span className="text-2xl">{step.badge.icon}</span>
              <div>
                <p className="text-xs font-semibold text-agro-700 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Badge Earned
                </p>
                <p className="text-sm font-bold text-gray-900">{step.badge.name}</p>
                <p className="text-xs text-gray-500">{step.badge.issuer}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ===== Matching Job Card (for roadmap) =====
function MatchingJobCard({ job, index, isVisible }) {
  return (
    <div
      className={`group bg-white border-2 border-agro-200 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${1600 + index * 200}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-agro-100 rounded-xl flex items-center justify-center border border-agro-200">
            <Building2 className="w-5 h-5 text-agro-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">{job.company}</p>
            <h4 className="text-sm font-display font-bold text-gray-900 group-hover:text-agro-700 transition-colors">
              {job.title}
            </h4>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-agro-100 text-agro-700 text-xs font-semibold rounded-full">
          {job.type}
        </span>
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          {job.location}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <DollarSign className="w-3.5 h-3.5 text-gray-400" />
          {job.salary}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
            {tag}
          </span>
        ))}
      </div>

      <Link
        to="/jobs"
        className="w-full py-2.5 bg-gradient-to-r from-agro-600 to-agro-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-agro-500/20 hover:shadow-lg active:scale-[0.98] transition-all duration-300"
      >
        View on Job Board
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}


// ===== DREAM-TO-ROLE MAPPER COMPONENT =====
function DreamToRoleMapper() {
  const [dreamText, setDreamText] = useState('');
  const [result, setResult] = useState(null);
  const [isMapping, setIsMapping] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef(null);

  const exampleDreams = [
    'I want to manage a commercial hydroponic farm',
    'I dream of running a large-scale fish farming operation',
    'I want to build smart farming technology using drones and AI',
    'I want to lead greenhouse horticulture for flower exports',
    'I dream of restoring degraded soil across the Sahel',
    'I want to manage a modern poultry and dairy farm',
    'I want to design irrigation systems for smallholder farmers',
    'I dream of becoming a crop scientist working on food security',
  ];

  const handleMap = () => {
    if (!dreamText.trim() || dreamText.trim().length < 5) return;

    setIsMapping(true);
    setShowResult(false);
    setResult(null);

    // Simulate brief processing for polish
    setTimeout(() => {
      const mapped = mapDreamToCareer(dreamText);
      setResult(mapped);
      setIsMapping(false);

      // Small delay then reveal results with animation
      setTimeout(() => {
        setShowResult(true);
        // Scroll to results
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 1200);
  };

  const handleExampleClick = (example) => {
    setDreamText(example);
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="relative bg-gradient-to-br from-agro-600 via-agro-500 to-agro-700 rounded-3xl p-7 sm:p-8 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="absolute inset-0 bg-dots opacity-10" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold">Dream-to-Role Mapper</h2>
              <p className="text-sm text-white/70">AI-powered career path generator</p>
            </div>
          </div>
          <p className="text-sm text-white/80 leading-relaxed max-w-2xl">
            Describe your ultimate agricultural dream career below and we'll instantly generate a 
            personalized, step-by-step roadmap showing the exact skills, certifications, and job 
            opportunities that will get you there.
          </p>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        {/* Text Input */}
        <div>
          <label htmlFor="dream-career-input" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-agro-500" />
            Describe your dream agricultural career
          </label>
          <textarea
            id="dream-career-input"
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            rows={3}
            placeholder="e.g. I want to manage a commercial hydroponic farm that supplies fresh vegetables to urban markets..."
            className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 transition-all duration-200 outline-none resize-none text-sm leading-relaxed"
          />
        </div>

        {/* Example chips */}
        <div>
          <p className="text-xs font-medium text-gray-400 mb-2.5">ðŸ’¡ Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {exampleDreams.slice(0, 4).map((example, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(example)}
                className="px-3 py-1.5 text-xs font-medium bg-agro-50 text-agro-700 rounded-lg border border-agro-200 hover:bg-agro-100 hover:border-agro-300 transition-all duration-200 text-left"
              >
                "{example.substring(0, 45)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Map Button */}
        <button
          id="map-career-btn"
          onClick={handleMap}
          disabled={isMapping || dreamText.trim().length < 5}
          className="w-full py-4 bg-gradient-to-r from-agro-600 via-agro-500 to-agro-600 text-white font-bold text-base rounded-xl shadow-lg shadow-agro-500/25 hover:shadow-xl hover:shadow-agro-500/40 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          style={{ backgroundSize: '200% auto' }}
        >
          {isMapping ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Mapping your career path...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Map My Career
            </>
          )}
        </button>
      </div>

      {/* ===== ROADMAP RESULT ===== */}
      {result && (
        <div ref={resultRef} className="space-y-8">
          {/* Result Header */}
          <div
            className={`relative bg-white rounded-2xl border-2 border-agro-200 p-6 sm:p-8 overflow-hidden transition-all duration-700 ${
              showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Subtle background */}
            <div className="absolute inset-0 bg-gradient-to-br from-agro-50/50 to-earth-50/30" />
            <div className="absolute inset-0 bg-grid opacity-20" />

            <div className="relative">
              <div className="flex items-start gap-4 flex-wrap">
                <span className="text-4xl">{result.pathIcon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-agro-600 uppercase tracking-wider mb-1">
                    Your Career Path
                  </p>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-1">
                    {result.pathName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Target role: <span className="font-semibold text-agro-700">{result.targetRole}</span>
                  </p>
                </div>
              </div>

              {/* Confidence & Duration badges */}
              <div className="flex flex-wrap gap-3 mt-5">
                <div className="flex items-center gap-2 px-4 py-2 bg-agro-100 rounded-xl">
                  <Target className="w-4 h-4 text-agro-600" />
                  <span className="text-sm font-semibold text-agro-700">{result.confidence}% match</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-earth-100 rounded-xl">
                  <Clock className="w-4 h-4 text-earth-600" />
                  <span className="text-sm font-semibold text-earth-700">~{result.totalDuration} journey</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-xl">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">
                    {result.steps.filter(s => s.badge).length} badges to earn
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div
            className={`bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm transition-all duration-700 delay-200 ${
              showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <h3 className="text-lg font-display font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-agro-500" />
              Your Step-by-Step Roadmap
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              Follow this chronological path to reach your dream role
            </p>

            {/* Timeline Steps */}
            <div className="relative">
              {result.steps.map((step, index) => (
                <TimelineStep
                  key={step.id}
                  step={step}
                  index={index}
                  totalSteps={result.steps.length}
                  isVisible={showResult}
                />
              ))}
            </div>
          </div>

          {/* Matching Jobs */}
          <div
            className={`bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm transition-all duration-700 delay-500 ${
              showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <h3 className="text-lg font-display font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-earth-500" />
              Matching Job Openings
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              These roles align with your dream career path
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              {result.matchingJobs.map((job, index) => (
                <MatchingJobCard
                  key={job.id}
                  job={job}
                  index={index}
                  isVisible={showResult}
                />
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div
            className={`relative bg-gradient-to-r from-agro-600 to-agro-500 rounded-2xl p-6 sm:p-8 text-center overflow-hidden transition-all duration-700 delay-700 ${
              showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="relative">
              <h3 className="text-xl font-display font-bold text-white mb-2">
                Ready to start your journey? ðŸš€
              </h3>
              <p className="text-sm text-white/80 mb-5 max-w-xl mx-auto">
                Save this roadmap to your profile and begin with Step 1. Track your progress as you earn
                badges and unlock new opportunities.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button className="px-6 py-3 bg-white text-agro-700 font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 text-sm flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Roadmap
                </button>
                <Link
                  to="/jobs"
                  className="px-6 py-3 bg-white/20 text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 active:scale-[0.98] transition-all duration-300 text-sm flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Browse All Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== MAIN PROFILE PAGE =====
export default function ProfilePage() {
  // Editable profile state
  const [profile, setProfile] = useState({
    name: 'Kwame Asante',
    email: 'kwame.asante@gmail.com',
    location: 'Accra, Ghana',
    bio: 'Passionate agricultural scientist with 5+ years of experience in sustainable crop production across West Africa. Specialized in soil analysis, precision irrigation, and climate-adaptive farming techniques. Currently seeking opportunities to apply data-driven agronomy at scale.',
    skills: ['Crop Science', 'Irrigation', 'Soil Analysis', 'Precision Farming', 'Data Analytics'],
    joinedAt: 'June 2025',
    applicationsSubmitted: 5,
    profileViews: 142,
    shortlisted: 3,
  });

  const [certificates, setCertificates] = useState([
    {
      id: 'cert_001',
      title: 'Advanced Soil Pathology',
      issuer: 'AgroNet Africa Academy',
      status: 'Completed',
      date: 'July 2025',
    },
    {
      id: 'cert_002',
      title: 'Precision Aquaculture Fundamentals',
      issuer: 'African Aquaculture Institute',
      status: 'Completed',
      date: 'May 2025',
    },
    {
      id: 'cert_003',
      title: 'Greenhouse Agronomy & Climate Control',
      issuer: 'AgroNet Africa Academy',
      status: 'In Progress',
      date: 'Expected Sept 2025',
    },
    {
      id: 'cert_004',
      title: 'Integrated Pest Management (IPM)',
      issuer: 'Pan-African Agricultural Board',
      status: 'Completed',
      date: 'March 2025',
    },
    {
      id: 'cert_005',
      title: 'Agricultural Data Analytics with Python',
      issuer: 'AgriTech Learning Hub',
      status: 'Planned',
      date: null,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const [showCertForm, setShowCertForm] = useState(false);
  const [newCert, setNewCert] = useState({ title: '', issuer: '', status: 'Completed', date: '' });
  const [skillInput, setSkillInput] = useState('');

  // Handle profile save
  const handleSaveProfile = () => {
    setProfile({ ...editForm });
    setIsEditing(false);
  };

  // Handle add certificate
  const handleAddCertificate = (e) => {
    e.preventDefault();
    if (!newCert.title.trim() || !newCert.issuer.trim()) return;

    setCertificates([
      ...certificates,
      {
        id: `cert_${Date.now()}`,
        title: newCert.title.trim(),
        issuer: newCert.issuer.trim(),
        status: newCert.status,
        date: newCert.date.trim() || null,
      },
    ]);
    setNewCert({ title: '', issuer: '', status: 'Completed', date: '' });
    setShowCertForm(false);
  };

  // Handle remove certificate
  const handleRemoveCert = (id) => {
    setCertificates(certificates.filter((c) => c.id !== id));
  };

  // Handle add skill
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!editForm.skills.includes(skillInput.trim())) {
        setEditForm({ ...editForm, skills: [...editForm.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setEditForm({ ...editForm, skills: editForm.skills.filter((s) => s !== skill) });
  };

  const completedCerts = certificates.filter((c) => c.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Profile Header */}
      <section className="relative pt-24 pb-0 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-agro-600 via-agro-500 to-agro-700 h-64" />
        <div className="absolute inset-0 bg-dots opacity-10 h-64" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-agro-900/10 overflow-hidden mt-16">
            {/* Cover area */}
            <div className="relative h-20 bg-gradient-to-r from-agro-100 via-agro-50 to-earth-50">
              <div className="absolute inset-0 bg-grid opacity-30" />
            </div>

            {/* Avatar + Info */}
            <div className="px-6 sm:px-8 pb-8 -mt-12">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-agro-400 to-agro-600 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center">
                    <span className="text-3xl font-display font-bold text-white">
                      {profile.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-agro-500 rounded-lg flex items-center justify-center border-2 border-white">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Name & basic info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <h1 className="text-2xl font-display font-bold text-gray-900">
                        {profile.name}
                      </h1>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                        <span className="text-gray-300 mx-1">â€¢</span>
                        <Mail className="w-4 h-4" />
                        {profile.email}
                      </p>
                    </div>
                    <button
                      id="edit-profile-btn"
                      onClick={() => {
                        if (isEditing) {
                          handleSaveProfile();
                        } else {
                          setEditForm({ ...profile });
                          setIsEditing(true);
                        }
                      }}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-[0.98] ${
                        isEditing
                          ? 'bg-agro-600 text-white shadow-lg shadow-agro-500/25 hover:bg-agro-700'
                          : 'border-2 border-gray-200 text-gray-600 hover:border-agro-300 hover:text-agro-700 hover:bg-agro-50'
                      }`}
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4" />
                          Save Profile
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4" />
                          Edit Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[
                  { label: 'Applications', value: profile.applicationsSubmitted, icon: Briefcase, color: 'text-agro-600 bg-agro-50' },
                  { label: 'Profile Views', value: profile.profileViews, icon: User, color: 'text-earth-600 bg-earth-50' },
                  { label: 'Shortlisted', value: profile.shortlisted, icon: Star, color: 'text-soil-600 bg-soil-50' },
                  { label: 'Certificates', value: completedCerts, icon: Award, color: 'text-agro-600 bg-agro-50' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-lg font-display font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column â€” Bio, Skills, Certs, Career Mapper */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio Section */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-agro-500" />
                  About Me
                </h2>
                {isEditing ? (
                  <textarea
                    id="profile-bio"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 transition-all duration-200 outline-none resize-none"
                    placeholder="Write about yourself, your experience, and your career goals..."
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                )}
              </div>

              {/* Edit form â€” Name / Location / Email */}
              {isEditing && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-fade-in-up space-y-5">
                  <h2 className="text-lg font-display font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-agro-500" />
                    Edit Details
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="edit-name" className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                      <input
                        id="edit-name"
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                      <input
                        id="edit-email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="edit-location" className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                    <input
                      id="edit-location"
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Skills Section */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-earth-500" />
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(isEditing ? editForm.skills : profile.skills).map((skill) => (
                    <span
                      key={skill}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isEditing
                          ? 'bg-agro-100 text-agro-800 pr-2'
                          : 'bg-agro-50 text-agro-700 border border-agro-200'
                      }`}
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="p-0.5 ml-1 hover:bg-agro-200 rounded-full"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </span>
                  ))}
                  {isEditing && (
                    <input
                      id="add-skill-input"
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      placeholder="Add skill + Enter"
                      className="px-4 py-2 rounded-xl text-sm border-2 border-dashed border-gray-300 text-gray-600 placeholder-gray-400 focus:border-agro-400 focus:ring-2 focus:ring-agro-100 outline-none w-40"
                    />
                  )}
                </div>
              </div>

              {/* Certificates Section */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-display font-bold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-agro-500" />
                    Certificates & Courses
                  </h2>
                  <button
                    id="add-cert-btn"
                    onClick={() => setShowCertForm(!showCertForm)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      showCertForm
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-agro-100 text-agro-700 hover:bg-agro-200'
                    }`}
                  >
                    {showCertForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showCertForm ? 'Cancel' : 'Add Certificate'}
                  </button>
                </div>

                {/* Add Certificate Form */}
                {showCertForm && (
                  <form onSubmit={handleAddCertificate} className="mb-6 p-5 bg-agro-50/50 border border-agro-200 rounded-2xl space-y-4 animate-fade-in-up">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cert-title" className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Certificate Title *
                        </label>
                        <input
                          id="cert-title"
                          type="text"
                          value={newCert.title}
                          onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                          placeholder="e.g. Advanced Soil Pathology"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="cert-issuer" className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Issuing Organization *
                        </label>
                        <input
                          id="cert-issuer"
                          type="text"
                          value={newCert.issuer}
                          onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                          placeholder="e.g. AgroNet Africa Academy"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cert-status" className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                        <select
                          id="cert-status"
                          value={newCert.status}
                          onChange={(e) => setNewCert({ ...newCert, status: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-800 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all"
                        >
                          <option>Completed</option>
                          <option>In Progress</option>
                          <option>Planned</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="cert-date" className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                        <input
                          id="cert-date"
                          type="text"
                          value={newCert.date}
                          onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                          placeholder="e.g. July 2025"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      id="submit-cert-btn"
                      className="w-full py-3 bg-gradient-to-r from-agro-600 to-agro-500 text-white font-bold rounded-xl shadow-lg shadow-agro-500/20 hover:shadow-xl active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Award className="w-5 h-5" />
                      Add Certificate
                    </button>
                  </form>
                )}

                {/* Certificates list */}
                {certificates.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {certificates.map((cert, index) => (
                      <CertificateCard
                        key={cert.id}
                        cert={cert}
                        index={index}
                        onRemove={handleRemoveCert}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No certificates yet</p>
                    <p className="text-sm">Add your first certificate to showcase your skills</p>
                  </div>
                )}
              </div>

              {/* ===== DREAM-TO-ROLE MAPPER ===== */}
              <DreamToRoleMapper />
            </div>

            {/* Right Column â€” Sidebar */}
            <div className="space-y-6">
              {/* Member since */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Member Info
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-agro-50 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-agro-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Joined</p>
                      <p className="text-sm font-medium text-gray-800">{profile.joinedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-agro-50 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-agro-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Status</p>
                      <p className="text-sm font-medium text-agro-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Verified Job Seeker
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-earth-50 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-earth-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Role</p>
                      <p className="text-sm font-medium text-gray-800">Job Seeker</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Card */}
              <div className="bg-gradient-to-br from-agro-600 to-agro-700 rounded-2xl p-6 text-white shadow-lg shadow-agro-600/30">
                <h3 className="font-display font-bold mb-3">Profile Strength</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-agro-100">Completion</span>
                    <span className="font-bold">85%</span>
                  </div>
                  <div className="w-full h-2.5 bg-agro-800/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-earth-400 to-earth-300 rounded-full transition-all duration-1000"
                      style={{ width: '85%' }}
                    />
                  </div>
                  <p className="text-xs text-agro-200 mt-2">
                    Add more certificates to reach 100%!
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Browse Jobs', icon: Briefcase, to: '/jobs' },
                    { label: 'AI Career Mapper', icon: Sparkles, to: '#dream-mapper' },
                    { label: 'Micro-Learning', icon: GraduationCap, to: '/' },
                  ].map((action) => (
                    <a
                      key={action.label}
                      href={action.to}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-agro-50 hover:text-agro-700 transition-all duration-200 group"
                    >
                      <action.icon className="w-4 h-4 text-gray-400 group-hover:text-agro-500 transition-colors" />
                      {action.label}
                      <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
