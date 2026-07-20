/**
 * AgroNet Africa — Essential Configuration Data
 * 
 * This file contains configuration and service definitions.
 * All user data, jobs, and experts are now fetched from the live Render backend.
 */

// ===== BOOKING PACKAGES (Agrilencer Service Tiers) =====
export const BOOKING_PACKAGES = [
  {
    id: 'quick-consult',
    label: 'Quick Consultation',
    description: 'Phone/video call for initial assessment',
    rateKey: 'hourly_rate',
    multiplier: 1,
    duration: '1 hour',
    included: [
      'Initial problem assessment',
      'Preliminary recommendations',
      'Follow-up resources',
    ],
  },
  {
    id: 'site-visit',
    label: 'Site Visit & Report',
    description: 'In-person farm visit with written diagnostics',
    rateKey: 'project_rate',
    multiplier: 1,
    duration: '1 day',
    included: [
      'Full farm walkthrough',
      'Soil/water/crop samples',
      '5-10 page diagnostic report',
      'Treatment plan with cost estimates',
    ],
  },
  {
    id: 'intensive-support',
    label: 'Intensive Support (1-3 months)',
    description: 'Ongoing consultation and implementation support',
    rateKey: 'project_rate',
    multiplier: 3,
    duration: '3 months',
    included: [
      'Bi-weekly farm visits',
      'Treatment plan implementation',
      'Weekly email support',
      'Real-time problem-solving',
    ],
  },
];

// ===== CONTRACT STATE MACHINE =====
export const CONTRACT_STATES = [
  { id: 'pending',   label: 'Pending Acceptance', color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200',  step: 0 },
  { id: 'escrow',    label: 'Funds in Escrow',    color: 'text-sky-700',    bg: 'bg-sky-50',    border: 'border-sky-200',    step: 1 },
  { id: 'milestone', label: 'Milestone Completed', color: 'text-agro-700',  bg: 'bg-agro-50',   border: 'border-agro-200',   step: 2 },
  { id: 'released',  label: 'Released / Paid',    color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', step: 3 },
];
    isPremium: true,
    avatarColor: 'from-earth-600 to-earth-800',
  },
  {
    id: 'he_003',
    name: 'Dr. Amaka Okonkwo',
    initials: 'AO',
    specialty: 'Crop Pathologist',
    location: 'Owerri, Imo',
    rating: 4.9,
    reviewCount: 103,
    hourlyRate: 50000,
    availability: 'Available',
    isVerified: true,
    isPremium: true,
    avatarColor: 'from-agro-500 to-earth-700',
  },
  {
    id: 'he_004',
    name: 'Mrs. Titi Afolabi-Coker',
    initials: 'TC',
    specialty: 'Farm Business Consultant',
    location: 'Lagos, Lagos',
    rating: 4.8,
    reviewCount: 71,
    hourlyRate: 55000,
    availability: 'Available',
    isVerified: true,
    isPremium: true,
    avatarColor: 'from-earth-500 to-earth-700',
  },
];

// ===== SEED ESCROW CONTRACTS =====
export const SEED_CONTRACTS = [
  {
    id: 'con_001',
    expertId: 'exp_001',
    expertName: 'Dr. Chukwuemeka Alabi',
    expertInitials: 'CA',
    expertAvatarColor: 'from-agro-600 to-agro-800',
    specialty: 'Soil Agronomist',
    package: 'Full Project Analysis',
    description: 'Our 80-hectare maize farm in Oyo State is showing severe soil acidification after 3 seasons. We need a full soil health audit with fertiliser recommendations and a 2-season recovery plan.',
    amount: 350000,
    stateIndex: 1,
    createdAt: '2026-06-20',
    milestoneLabel: 'Soil Sample Analysis & Report Delivery',
  },
  {
    id: 'con_002',
    expertId: 'exp_002',
    expertName: 'Dr. Ngozi Eze',
    expertInitials: 'NE',
    expertAvatarColor: 'from-earth-600 to-earth-800',
    specialty: 'Veterinary Doctor',
    package: 'Farm Site Visit',
    description: 'We have 5,000 broilers showing signs of Newcastle Disease. Need urgent on-site veterinary assessment and immediate vaccination protocol.',
    amount: 180000,
    stateIndex: 2,
    createdAt: '2026-06-18',
    milestoneLabel: 'Vaccination Programme & Biosecurity Report',
  },
];
