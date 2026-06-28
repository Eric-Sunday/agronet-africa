/**
 * AgroNet Africa — Unified Mock Data
 * Re-exports core data + adds Agrilencer escrow contract seeds
 */

// Re-export everything from the main database
export {
  USER_ROLES,
  ROLE_INFO,
  MOCK_USERS,
  MOCK_JOBS,
  PLATFORM_STATS,
  MOCK_EXPERTS,
  EXPERT_SPECIALTIES,
  BOOKING_PACKAGES,
} from './mockDatabase';

// ===== CONTRACT STATE MACHINE =====
export const CONTRACT_STATES = [
  { id: 'pending',   label: 'Pending Acceptance', color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200',  step: 0 },
  { id: 'escrow',    label: 'Funds in Escrow',    color: 'text-sky-700',    bg: 'bg-sky-50',    border: 'border-sky-200',    step: 1 },
  { id: 'milestone', label: 'Milestone Completed', color: 'text-agro-700',  bg: 'bg-agro-50',   border: 'border-agro-200',   step: 2 },
  { id: 'released',  label: 'Released / Paid',    color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', step: 3 },
];

// ===== HOMEPAGE PREVIEW DATA =====

export const HOME_JOBS = [
  {
    id: 'hj_001',
    title: 'Farm Manager',
    company: 'GreenFields Agro Ltd.',
    location: 'Ibadan, Oyo State',
    type: 'Full-time',
    salary: '\u20a6350,000 – \u20a6500,000/mo',
    tags: ['Management', 'Crop Science'],
    postedAgo: '2 days ago',
    urgent: true,
  },
  {
    id: 'hj_002',
    title: 'Senior Agronomist',
    company: 'HarvestPrime Farms',
    location: 'Kano, Kano State',
    type: 'Full-time',
    salary: '\u20a6450,000 – \u20a6650,000/mo',
    tags: ['Agronomy', 'Research'],
    postedAgo: '5 days ago',
    urgent: false,
  },
  {
    id: 'hj_003',
    title: 'Irrigation Technician',
    company: 'SaharaGreen Farms',
    location: 'Kaduna, Kaduna State',
    type: 'Contract',
    salary: '\u20a6200,000 – \u20a6300,000/mo',
    tags: ['Engineering', 'Water Mgmt'],
    postedAgo: '1 week ago',
    urgent: false,
  },
  {
    id: 'hj_004',
    title: 'Poultry Operations Supervisor',
    company: 'NorthStar Poultry Ltd.',
    location: 'Enugu, Enugu State',
    type: 'Full-time',
    salary: '\u20a6280,000 – \u20a6420,000/mo',
    tags: ['Livestock', 'Operations'],
    postedAgo: '3 days ago',
    urgent: true,
  },
];

export const HOME_EXPERTS = [
  {
    id: 'he_001',
    name: 'Dr. Chukwuemeka Alabi',
    initials: 'CA',
    specialty: 'Soil Agronomist',
    location: 'Ibadan, Oyo',
    rating: 4.9,
    reviewCount: 87,
    hourlyRate: 45000,
    availability: 'Available',
    isVerified: true,
    isPremium: true,
    avatarColor: 'from-agro-600 to-agro-800',
  },
  {
    id: 'he_002',
    name: 'Dr. Ngozi Eze',
    initials: 'NE',
    specialty: 'Veterinary Doctor',
    location: 'Enugu, Enugu',
    rating: 4.8,
    reviewCount: 62,
    hourlyRate: 40000,
    availability: 'Available',
    isVerified: true,
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
