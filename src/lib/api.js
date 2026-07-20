// src/lib/api.js
// ─────────────────────────────────────────────────────────────────────────────
// Centralised API client for the AgroNet Africa Render backend.
//
// ⚠️  This is a Vite (React) project — environment variables are prefixed with
//     VITE_  (not NEXT_PUBLIC_).
//     Set VITE_API_URL in .env.local to override the default Render URL.
//     Example: VITE_API_URL=https://agronet-backend.onrender.com
// ─────────────────────────────────────────────────────────────────────────────

/** Base URL for all backend requests.
 *  Reads VITE_API_URL at build time, falls back to the live Render service. */
export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'https://agronet-africa-backend.onrender.com';

// ── UUID validation ───────────────────────────────────────────────────────────
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Returns true only if `id` is a proper UUID string. */
export const isRealUUID = (id) => typeof id === 'string' && UUID_RE.test(id);

// ── User Profile ─────────────────────────────────────────────────────────────

/**
 * Fetch a single user profile from the backend.
 *
 * @param {string} userId - UUID of the user (must pass UUID format check)
 * @returns {Promise<{
 *   id: string,
 *   name: string,
 *   email: string,
 *   phone: string|null,
 *   role: string,
 *   location: string|null,
 *   is_verified: boolean,
 *   created_at: string
 * }>}
 * @throws {Error} with a descriptive message on any non-2xx response or network failure
 */
export async function fetchUserProfile(userId) {
  if (!isRealUUID(userId)) {
    throw new Error(`fetchUserProfile: "${userId}" is not a valid UUID — skipping API call.`);
  }

  const url = `${API_BASE}/api/users/${userId}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.message || `Backend responded with ${res.status} ${res.statusText}`
    );
  }

  const json = await res.json();
  // The backend wraps the record in { success: true, data: { ... } }
  return json.data;
}

/**
 * Formats a raw ISO date string (or any Date-parseable string) to a
 * human-friendly "Month YYYY" string, e.g. "July 2025".
 *
 * @param {string|null|undefined} isoString
 * @returns {string}
 */
export function formatJoinDate(isoString) {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

/**
 * Fetch paginated job listings from the backend.
 * Backend shape: { success: true, data: Job[], pagination: { ... } }
 *
 * @param {{ page?: number, limit?: number, status?: string, location?: string }} opts
 * @returns {Promise<{ jobs: Job[], pagination: object }>}
 * @throws {Error} on non-2xx or network failure
 */
export async function fetchJobs({ page = 1, limit = 100, status = 'active', location } = {}) {
  const params = new URLSearchParams({ page, limit, status });
  if (location) params.set('location', location);

  const res = await fetch(`${API_BASE}/api/jobs?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Backend responded with ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  // Backend returns: { success: true, data: [...], pagination: {...} }
  return { jobs: json.data ?? [], pagination: json.pagination ?? {} };
}

/**
 * Post a new job to the backend.
 * Backend shape: { success: true, data: Job }
 *
 * @param {object} jobPayload
 * @returns {Promise<Job>}
 */
export async function postJob(jobPayload) {
  const res = await fetch(`${API_BASE}/api/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobPayload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || `Backend responded with ${res.status}`);
  return json.data;
}

/**
 * Fetch featured/homepage jobs (limited set for homepage display).
 * Backend shape: { success: true, data: Job[], pagination: { ... } }
 *
 * @param {{ limit?: number }} opts
 * @returns {Promise<{ jobs: Job[], pagination: object }>}
 * @throws {Error} on non-2xx or network failure
 */
export async function fetchFeaturedJobs({ limit = 4 } = {}) {
  const params = new URLSearchParams({ status: 'active', limit, featured: 'true' });

  const res = await fetch(`${API_BASE}/api/jobs/featured?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    // If the featured endpoint doesn't exist, fall back to regular jobs
    if (res.status === 404) {
      return fetchJobs({ limit, status: 'active' });
    }
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Backend responded with ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return { jobs: json.data ?? [], pagination: json.pagination ?? {} };
}

// ── Platform Statistics ────────────────────────────────────────────────────────

/**
 * Fetch platform-wide statistics (user counts, job counts, etc.).
 * Backend shape: { success: true, data: PlatformStats }
 *
 * @returns {Promise<{
 *   totalUsers: number,
 *   activeJobs: number,
 *   countriesCovered: number,
 *   communitiesReached: number,
 *   successfulPlacements: number,
 *   fieldEvangelists: number
 * }>}
 * @throws {Error} on non-2xx or network failure
 */
export async function fetchPlatformStats() {
  const res = await fetch(`${API_BASE}/api/platform/stats`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Backend responded with ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  // Return the data with safe defaults for missing fields
  return {
    totalUsers: json.data?.totalUsers ?? 0,
    activeJobs: json.data?.activeJobs ?? 0,
    countriesCovered: json.data?.countriesCovered ?? 0,
    communitiesReached: json.data?.communitiesReached ?? 0,
    successfulPlacements: json.data?.successfulPlacements ?? 0,
    fieldEvangelists: json.data?.fieldEvangelists ?? 0,
  };
}

// ── Experts / Agrilencer ───────────────────────────────────────────────────────

/**
 * Fetch featured/homepage experts (limited set for homepage display).
 * Backend shape: { success: true, data: Expert[], pagination: { ... } }
 *
 * @param {{ limit?: number }} opts
 * @returns {Promise<{ experts: Expert[], pagination: object }>}
 * @throws {Error} on non-2xx or network failure
 */
export async function fetchFeaturedExperts({ limit = 4 } = {}) {
  const params = new URLSearchParams({ limit, featured: 'true' });

  const res = await fetch(`${API_BASE}/api/experts/featured?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    // If featured endpoint doesn't exist, try regular experts endpoint
    if (res.status === 404) {
      return fetchExperts({ limit });
    }
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Backend responded with ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return { experts: json.data ?? [], pagination: json.pagination ?? {} };
}

/**
 * Fetch all experts/specialists from the backend.
 * Backend shape: { success: true, data: Expert[], pagination: { ... } }
 *
 * @param {{ page?: number, limit?: number, specialty?: string }} opts
 * @returns {Promise<{ experts: Expert[], pagination: object }>}
 * @throws {Error} on non-2xx or network failure
 */
export async function fetchExperts({ page = 1, limit = 100, specialty } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (specialty) params.set('specialty', specialty);

  const res = await fetch(`${API_BASE}/api/experts?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Backend responded with ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return { experts: json.data ?? [], pagination: json.pagination ?? {} };
}

/**
 * Fetch expert specialties/categories from the backend.
 * Backend shape: { success: true, data: string[] }
 *
 * @returns {Promise<string[]>}
 * @throws {Error} on non-2xx or network failure
 */
export async function fetchExpertSpecialties() {
  const res = await fetch(`${API_BASE}/api/experts/specialties`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Backend responded with ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json.data ?? [];
}
