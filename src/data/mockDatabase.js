/**
 * AgroNet Africa — Mock Database
 * 
 * Tracks 3 user roles:
 *  1. Agribusiness_Employer  — Companies posting agricultural jobs
 *  2. Job_Seeker             — Individuals searching for agricultural work
 *  3. Field_Evangelist       — Community advocates promoting AgroNet on the ground
 */

// ===== USER ROLES =====
export const USER_ROLES = {
  AGRIBUSINESS_EMPLOYER: 'Agribusiness_Employer',
  JOB_SEEKER: 'Job_Seeker',
  FIELD_EVANGELIST: 'Field_Evangelist',
};

// ===== ROLE DESCRIPTIONS =====
export const ROLE_INFO = {
  [USER_ROLES.AGRIBUSINESS_EMPLOYER]: {
    id: 'employer',
    title: 'Agribusiness Employer',
    subtitle: 'Grow your team with Africa\'s top agricultural talent',
    description:
      'Post jobs, find skilled workers, and manage your agricultural workforce. Connect with pre-vetted job seekers who are passionate about sustainable farming and agribusiness.',
    icon: 'Building2',
    color: 'agro',
    benefits: [
      'Post unlimited job listings',
      'Access verified candidate profiles',
      'AI-powered candidate matching',
      'Direct messaging with applicants',
      'Analytics & hiring dashboard',
    ],
  },
  [USER_ROLES.JOB_SEEKER]: {
    id: 'seeker',
    title: 'Job Seeker',
    subtitle: 'Find your dream career in agriculture',
    description:
      'Browse thousands of agricultural opportunities across Africa. Build your profile, showcase your skills, and get matched with employers who value your expertise.',
    icon: 'UserSearch',
    color: 'earth',
    benefits: [
      'Browse curated job listings',
      'AI Career Mapper tool',
      'Skill-based profile builder',
      'Micro-learning certifications',
      'Community forum access',
    ],
  },
  [USER_ROLES.FIELD_EVANGELIST]: {
    id: 'evangelist',
    title: 'Field Evangelist',
    subtitle: 'Champion agricultural innovation in your community',
    description:
      'Become a community ambassador for AgroNet Africa. Spread the word about sustainable farming practices, onboard new users, and earn rewards for growing the network.',
    icon: 'Megaphone',
    color: 'soil',
    benefits: [
      'Earn referral commissions',
      'Community leadership tools',
      'Training & certification',
      'Offline-first mobile tools',
      'Impact tracking dashboard',
    ],
  },
};

// ===== MOCK USERS =====
export const MOCK_USERS = [
  {
    id: 'usr_001',
    name: 'Adaeze Okafor',
    email: 'adaeze@greenfields.ng',
    role: USER_ROLES.AGRIBUSINESS_EMPLOYER,
    company: 'GreenFields Agro Ltd.',
    location: 'Lagos, Nigeria',
    avatar: null,
    joinedAt: '2025-03-15',
    isVerified: true,
    jobsPosted: 12,
  },
  {
    id: 'usr_002',
    name: 'Kwame Asante',
    email: 'kwame.asante@gmail.com',
    role: USER_ROLES.JOB_SEEKER,
    skills: ['Crop Science', 'Irrigation', 'Soil Analysis'],
    location: 'Accra, Ghana',
    avatar: null,
    joinedAt: '2025-06-22',
    isVerified: true,
    applicationsSubmitted: 5,
  },
  {
    id: 'usr_003',
    name: 'Amina Wanjiku',
    email: 'amina.wanjiku@outlook.com',
    role: USER_ROLES.FIELD_EVANGELIST,
    region: 'Central Kenya',
    location: 'Nairobi, Kenya',
    avatar: null,
    joinedAt: '2025-01-10',
    isVerified: true,
    usersReferred: 47,
    communitiesReached: 8,
  },
  {
    id: 'usr_004',
    name: 'Oluwaseun Adebayo',
    email: 'seun@harvestprime.com',
    role: USER_ROLES.AGRIBUSINESS_EMPLOYER,
    company: 'HarvestPrime Farms',
    location: 'Ibadan, Nigeria',
    avatar: null,
    joinedAt: '2025-04-01',
    isVerified: true,
    jobsPosted: 8,
  },
  {
    id: 'usr_005',
    name: 'Fatou Diallo',
    email: 'fatou.d@yahoo.com',
    role: USER_ROLES.JOB_SEEKER,
    skills: ['Animal Husbandry', 'Veterinary Care', 'Farm Management'],
    location: 'Dakar, Senegal',
    avatar: null,
    joinedAt: '2025-07-18',
    isVerified: false,
    applicationsSubmitted: 3,
  },
  {
    id: 'usr_006',
    name: 'Emmanuel Mensah',
    email: 'emensah@agroevangelists.org',
    role: USER_ROLES.FIELD_EVANGELIST,
    region: 'Northern Ghana',
    location: 'Tamale, Ghana',
    avatar: null,
    joinedAt: '2025-02-28',
    isVerified: true,
    usersReferred: 112,
    communitiesReached: 15,
  },
];

// ===== MOCK JOB LISTINGS =====
export const MOCK_JOBS = [
  {
    id: 'job_001',
    title: 'Senior Agronomist',
    company: 'GreenFields Agro Ltd.',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    salary: '₦450,000 - ₦650,000/month',
    postedBy: 'usr_001',
    postedAt: '2025-08-01',
    tags: ['Agronomy', 'Crop Science', 'Research'],
  },
  {
    id: 'job_002',
    title: 'Farm Operations Manager',
    company: 'HarvestPrime Farms',
    location: 'Ibadan, Nigeria',
    type: 'Full-time',
    salary: '₦350,000 - ₦500,000/month',
    postedBy: 'usr_004',
    postedAt: '2025-08-10',
    tags: ['Management', 'Operations', 'Livestock'],
  },
  {
    id: 'job_003',
    title: 'Irrigation Technician',
    company: 'GreenFields Agro Ltd.',
    location: 'Kano, Nigeria',
    type: 'Contract',
    salary: '₦200,000 - ₦300,000/month',
    postedBy: 'usr_001',
    postedAt: '2025-08-15',
    tags: ['Irrigation', 'Engineering', 'Water Management'],
  },
];

// ===== PLATFORM STATISTICS =====
export const PLATFORM_STATS = {
  totalUsers: 12450,
  activeJobs: 834,
  countriesCovered: 18,
  communitiesReached: 256,
  successfulPlacements: 3120,
  fieldEvangelists: 198,
};
