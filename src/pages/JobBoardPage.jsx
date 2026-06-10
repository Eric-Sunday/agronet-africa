import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, DollarSign, Clock, Tag, Filter,
  Plus, X, ChevronRight, Briefcase, Building2,
  CheckCircle, Sparkles, ArrowRight, ChevronDown,
  Leaf, AlertCircle
} from 'lucide-react';
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
    }, { threshold: 0.1, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, isInView];
}

// ===== Niche Skills Suggestions =====
const NICHE_SKILLS = [
  'Soil Pathology', 'Precision Aquaculture', 'Greenhouse Agronomy',
  'Hydroponics', 'Drip Irrigation Design', 'Crop Genomics',
  'Organic Certification', 'Livestock Nutrition', 'Apiculture',
  'Post-Harvest Technology', 'Agricultural Drones', 'Vermiculture',
  'Mycology', 'Agroforestry', 'Seed Technology',
  'Integrated Pest Management', 'Fertigation Systems', 'Climate-Smart Agriculture',
  'Tissue Culture', 'Biocontrol', 'Precision Farming',
  'Agricultural Data Analytics', 'Vertical Farming', 'Dairy Technology',
];

// ===== Job Card Component =====
function JobCard({ job, index }) {
  const [ref, isInView] = useInView();

  // Generate a consistent color based on job id
  const colors = [
    { bg: 'bg-agro-50', border: 'border-agro-200', accent: 'text-agro-600', tag: 'bg-agro-100 text-agro-700' },
    { bg: 'bg-earth-50', border: 'border-earth-200', accent: 'text-earth-600', tag: 'bg-earth-100 text-earth-700' },
    { bg: 'bg-soil-50', border: 'border-soil-200', accent: 'text-soil-600', tag: 'bg-soil-100 text-soil-700' },
  ];
  const color = colors[index % 3];

  return (
    <div
      ref={ref}
      className={`group relative bg-white border-2 ${color.border} rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${(index % 6) * 80}ms` }}
    >
      {/* Top row â€” Company & Type */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${color.bg} rounded-xl flex items-center justify-center border ${color.border}`}>
            <Building2 className={`w-6 h-6 ${color.accent}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{job.company}</p>
            <h3 className="text-lg font-display font-bold text-gray-900 group-hover:text-agro-700 transition-colors">
              {job.title}
            </h3>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${color.tag}`}>
          {job.type}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4 text-gray-400" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <DollarSign className="w-4 h-4 text-gray-400" />
          {job.salary}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          Posted {job.postedAt}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>

      {/* Apply Button */}
      <button
        id={`apply-btn-${job.id}`}
        className="w-full py-3 bg-gradient-to-r from-agro-600 to-agro-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-agro-500/20 hover:shadow-xl hover:shadow-agro-500/30 active:scale-[0.98] transition-all duration-300"
      >
        Apply Now
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ===== Post Job Form Component =====
function PostJobForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full-time',
    skills: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const suggestionsRef = useRef(null);

  // Close suggestions on click outside
  useEffect(() => {
    const handler = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredSuggestions = NICHE_SKILLS.filter(
    (s) => s.toLowerCase().includes(skillInput.toLowerCase()) && !form.skills.includes(s)
  );

  const addSkill = (skill) => {
    if (skill && !form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
      setSkillInput('');
      setShowSuggestions(false);
      // Clear skill error if present
      if (errors.skills) {
        setErrors({ ...errors, skills: '' });
      }
    }
  };

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (skillInput.trim()) {
        addSkill(skillInput.trim());
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Job title is required';
    if (!form.company.trim()) newErrors.company = 'Company name is required';
    if (!form.location.trim()) newErrors.location = 'Farm location is required';
    if (!form.salary.trim()) newErrors.salary = 'Monthly salary is required';
    if (form.skills.length === 0) newErrors.skills = 'Add at least one required skill';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      // Simulate a brief save delay
      setTimeout(() => {
        const newJob = {
          id: `job_${Date.now()}`,
          title: form.title.trim(),
          company: form.company.trim(),
          location: form.location.trim(),
          salary: form.salary.trim(),
          type: form.type,
          tags: form.skills,
          postedBy: 'usr_001',
          postedAt: new Date().toISOString().split('T')[0],
        };

        onSubmit(newJob);
        setIsSubmitting(false);
        setSubmitted(true);

        // Reset after showing success
        setTimeout(() => {
          setSubmitted(false);
          setForm({ title: '', company: '', location: '', salary: '', type: 'Full-time', skills: [] });
          onCancel();
        }, 2000);
      }, 800);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl border-2 border-agro-200 p-8 md:p-12 text-center animate-scale-in">
        <div className="w-20 h-20 bg-agro-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-agro-600" />
        </div>
        <h3 className="text-2xl font-display font-bold text-agro-900 mb-2">
          Job Posted Successfully!
        </h3>
        <p className="text-gray-600">
          Your listing is now live on the AgroNet Africa job board.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border-2 border-agro-200 overflow-hidden shadow-xl shadow-agro-100/50"
      id="post-job-form"
    >
      {/* Form Header */}
      <div className="relative bg-gradient-to-r from-agro-600 via-agro-500 to-agro-600 px-8 py-6 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center justify-between">
          <div>
            <h3 className="text-xl font-display font-bold">Post a New Job</h3>
            <p className="text-sm text-white/80 mt-1">Find the right talent for your agribusiness</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Form Body */}
      <div className="p-8 space-y-6">
        {/* Job Title */}
        <div>
          <label htmlFor="job-title" className="block text-sm font-semibold text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            id="job-title"
            type="text"
            value={form.title}
            onChange={(e) => { setForm({ ...form, title: e.target.value }); if (errors.title) setErrors({ ...errors, title: '' }); }}
            placeholder="e.g. Senior Agronomist, Aquaculture Specialist"
            className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.title ? 'border-red-300 bg-red-50/50' : 'border-gray-200'} text-gray-800 placeholder-gray-400 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 transition-all duration-200 outline-none`}
          />
          {errors.title && (
            <p className="flex items-center gap-1 mt-2 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />{errors.title}
            </p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label htmlFor="company-name" className="block text-sm font-semibold text-gray-700 mb-2">
            Company / Farm Name *
          </label>
          <input
            id="company-name"
            type="text"
            value={form.company}
            onChange={(e) => { setForm({ ...form, company: e.target.value }); if (errors.company) setErrors({ ...errors, company: '' }); }}
            placeholder="e.g. GreenFields Agro Ltd."
            className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.company ? 'border-red-300 bg-red-50/50' : 'border-gray-200'} text-gray-800 placeholder-gray-400 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 transition-all duration-200 outline-none`}
          />
          {errors.company && (
            <p className="flex items-center gap-1 mt-2 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />{errors.company}
            </p>
          )}
        </div>

        {/* Location & Salary â€” side by side */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="farm-location" className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Farm Location *
            </label>
            <input
              id="farm-location"
              type="text"
              value={form.location}
              onChange={(e) => { setForm({ ...form, location: e.target.value }); if (errors.location) setErrors({ ...errors, location: '' }); }}
              placeholder="e.g. Ibadan, Nigeria"
              className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.location ? 'border-red-300 bg-red-50/50' : 'border-gray-200'} text-gray-800 placeholder-gray-400 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 transition-all duration-200 outline-none`}
            />
            {errors.location && (
              <p className="flex items-center gap-1 mt-2 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />{errors.location}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="monthly-salary" className="block text-sm font-semibold text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Monthly Salary *
            </label>
            <input
              id="monthly-salary"
              type="text"
              value={form.salary}
              onChange={(e) => { setForm({ ...form, salary: e.target.value }); if (errors.salary) setErrors({ ...errors, salary: '' }); }}
              placeholder="e.g. â‚¦350,000 - â‚¦500,000/month"
              className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.salary ? 'border-red-300 bg-red-50/50' : 'border-gray-200'} text-gray-800 placeholder-gray-400 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 transition-all duration-200 outline-none`}
            />
            {errors.salary && (
              <p className="flex items-center gap-1 mt-2 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />{errors.salary}
              </p>
            )}
          </div>
        </div>

        {/* Job Type */}
        <div>
          <label htmlFor="job-type" className="block text-sm font-semibold text-gray-700 mb-2">
            Job Type
          </label>
          <div className="flex flex-wrap gap-3">
            {['Full-time', 'Part-time', 'Contract', 'Internship', 'Seasonal'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm({ ...form, type })}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                  form.type === type
                    ? 'border-agro-500 bg-agro-50 text-agro-700 shadow-sm'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Niche Required Skills */}
        <div>
          <label htmlFor="skill-input" className="block text-sm font-semibold text-gray-700 mb-2">
            <Sparkles className="w-4 h-4 inline mr-1 text-earth-500" />
            Niche Required Skills *
          </label>
          <p className="text-xs text-gray-400 mb-3">
            Type to search or pick from suggestions. Press Enter to add a custom skill.
          </p>

          {/* Selected Skills */}
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-agro-100 text-agro-800 text-sm font-medium rounded-lg group"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="p-0.5 hover:bg-agro-200 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Input with suggestions */}
          <div className="relative" ref={suggestionsRef}>
            <input
              id="skill-input"
              type="text"
              value={skillInput}
              onChange={(e) => { setSkillInput(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleSkillKeyDown}
              placeholder="e.g. Soil Pathology, Precision Aquaculture..."
              className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.skills ? 'border-red-300 bg-red-50/50' : 'border-gray-200'} text-gray-800 placeholder-gray-400 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 transition-all duration-200 outline-none`}
            />
            {errors.skills && (
              <p className="flex items-center gap-1 mt-2 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />{errors.skills}
              </p>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-20 top-full mt-2 w-full max-h-48 overflow-y-auto bg-white border-2 border-agro-200 rounded-xl shadow-xl shadow-agro-100/50 custom-scrollbar">
                {filteredSuggestions.slice(0, 8).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-agro-50 hover:text-agro-800 flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-agro-400" />
                    {skill}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 px-6 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] py-3.5 px-6 bg-gradient-to-r from-agro-600 to-agro-500 text-white font-bold rounded-xl shadow-lg shadow-agro-500/25 hover:shadow-xl hover:shadow-agro-500/40 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            id="submit-job-btn"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Briefcase className="w-5 h-5" />
                Post Job to Board
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}


// ===== MAIN JOB BOARD PAGE =====
export default function JobBoardPage({ jobs, onAddJob, currentUser, onLogout }) {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchType = filterType === 'All' || job.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      {/* Page Header */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-agro-50 via-white to-earth-50/40" />
        <div className="absolute inset-0 bg-dots opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-agro-100 rounded-full mb-5">
              <Briefcase className="w-4 h-4 text-agro-600" />
              <span className="text-sm font-medium text-agro-700">Job Board</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-agro-950 mb-4">
              Agricultural{' '}
              <span className="text-gradient-green">Opportunities</span>
            </h1>
            <p className="text-lg text-gray-600">
              Discover agricultural roles across Africa, or post a job to find the perfect talent for your farm.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters + Post Button */}
      <section className="relative -mt-2 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-xl w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="job-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs, companies, skills..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-agro-400 focus:ring-4 focus:ring-agro-100 transition-all duration-200 outline-none shadow-sm"
              />
            </div>

            {/* Post Job Button */}
            <button
              id="open-post-form-btn"
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 px-6 py-3.5 font-bold rounded-xl shadow-lg transition-all duration-300 active:scale-[0.98] ${
                showForm
                  ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 shadow-gray-200/50'
                  : 'bg-gradient-to-r from-agro-600 to-agro-500 text-white shadow-agro-500/25 hover:shadow-xl hover:shadow-agro-500/40'
              }`}
            >
              {showForm ? (
                <>
                  <X className="w-5 h-5" />
                  Close Form
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Post a Job
                </>
              )}
            </button>
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <Filter className="w-4 h-4 text-gray-400 mr-1" />
            {['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Seasonal'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 ${
                  filterType === type
                    ? 'border-agro-500 bg-agro-50 text-agro-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Post Job Form (collapsible) */}
      {showForm && (
        <section className="pb-10 animate-fade-in-up">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <PostJobForm
              onSubmit={(newJob) => onAddJob(newJob)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </section>
      )}

      {/* Job Listings */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results count */}
          <p className="text-sm text-gray-500 mb-6">
            Showing <span className="font-semibold text-agro-700">{filteredJobs.length}</span>{' '}
            {filteredJobs.length === 1 ? 'position' : 'positions'}
            {searchTerm && (
              <span> for "<span className="font-medium text-gray-700">{searchTerm}</span>"</span>
            )}
          </p>

          {filteredJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-700 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filters, or post a new position.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setFilterType('All'); }}
                className="btn-secondary text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
