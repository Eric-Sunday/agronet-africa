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
