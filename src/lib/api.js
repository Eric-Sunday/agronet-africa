// src/lib/api.js
// ─────────────────────────────────────────────────────────────────────────────
// Centralised API client for the AgroNet Africa Render backend.
//
// ⚠️  This is a Vite (React) project — environment variables are prefixed with
//     VITE_  (not NEXT_PUBLIC_).
//     Set VITE_API_URL in .env.local to override the default Render URL.
// ─────────────────────────────────────────────────────────────────────────────

/** Base URL for all backend requests. */
export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'https://agronet-africa-backend.onrender.com';

// ── UUID validation ───────────────────────────────────────────────────────────
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Returns true only if `id` is a proper UUID string. */
export const isRealUUID = (id) => typeof id === 'string' && UUID_RE.test(id);

// ── Token helpers ─────────────────────────────────────────────────────────────

/** Persist auth session to localStorage */
export function saveSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

/** Clear auth session from localStorage */
export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/** Retrieve persisted user object (or null if missing/corrupt) */
export function getPersistedUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Core Fetch Wrapper ───────────────────────────────────────────────────────
/**
 * All backend requests go through here.
 * Automatically attaches the stored JWT token as a Bearer header.
 * On 401 responses it clears the session (token invalid / expired).
 *
 * @throws {Error} with `.status` property on non-2xx
 */
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (networkErr) {
    const err = new Error('Unable to connect to the server. Please check your internet connection and try again.');
    err.status = 0;
    throw err;
  }

  // If the server returns 401, the session is invalid — clear it immediately
  if (res.status === 401) {
    clearSession();
  }

  return res;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Returns { token, user }
 */
export async function loginUser({ email, password }) {
  const res = await apiFetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(
      new Error(json.message || 'Invalid credentials. Please try again.'),
      { status: res.status }
    );
  }

  saveSession(json.token, json.user);
  return { token: json.token, user: json.user };
}

/**
 * POST /api/users (registration)
 * Returns { token, user }
 */
export async function registerUser({ name, email, password, location, role }) {
  const res = await apiFetch(`${API_BASE}/api/users`, {
    method: 'POST',
    body: JSON.stringify({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      location: location.trim(),
      role: role || 'farmer',
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(
      new Error(json.message || 'Registration failed. Please try again.'),
      { status: res.status }
    );
  }

  saveSession(json.token, json.user);
  return { token: json.token, user: json.user };
}

// ── User Profile ─────────────────────────────────────────────────────────────

/**
 * GET /api/users/profile  (JWT-authenticated)
 * Returns the live user object from the database.
 */
export async function fetchUserProfile() {
  const res = await apiFetch(`${API_BASE}/api/users/profile`, {
    method: 'GET',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(
      new Error(body.message || `Failed to load profile (${res.status}).`),
      { status: res.status }
    );
  }

  const json = await res.json();
  // Backend returns { success: true, user: { ... } }
  return json.user;
}

/**
 * Formats a raw ISO date string to a human-friendly "Month YYYY" string.
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
 * GET /api/jobs
 * @returns {Promise<{ jobs: Job[], pagination: object }>}
 */
export async function fetchJobs({ page = 1, limit = 100, status = 'active', location } = {}) {
  const params = new URLSearchParams({ page, limit, status });
  if (location) params.set('location', location);

  const res = await apiFetch(`${API_BASE}/api/jobs?${params.toString()}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Failed to fetch jobs (${res.status}).`);
  }

  const json = await res.json();
  return { jobs: json.data ?? [], pagination: json.pagination ?? {} };
}

/**
 * POST /api/jobs
 */
export async function postJob(jobPayload) {
  const res = await apiFetch(`${API_BASE}/api/jobs`, {
    method: 'POST',
    body: JSON.stringify(jobPayload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || `Failed to post job (${res.status}).`);
  return json.data;
}

/**
 * GET /api/jobs/featured  (falls back to regular jobs if 404)
 */
export async function fetchFeaturedJobs({ limit = 4 } = {}) {
  const params = new URLSearchParams({ status: 'active', limit, featured: 'true' });

  const res = await apiFetch(`${API_BASE}/api/jobs/featured?${params.toString()}`, {
    method: 'GET',
  });

  if (!res.ok) {
    if (res.status === 404) return fetchJobs({ limit, status: 'active' });
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Failed to fetch featured jobs (${res.status}).`);
  }

  const json = await res.json();
  return { jobs: json.data ?? [], pagination: json.pagination ?? {} };
}

// ── Platform Statistics ────────────────────────────────────────────────────────

export async function fetchPlatformStats() {
  const res = await apiFetch(`${API_BASE}/api/platform/stats`, {
    method: 'GET',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Failed to fetch stats (${res.status}).`);
  }

  const json = await res.json();
  return {
    totalUsers:           json.data?.totalUsers           ?? 0,
    activeJobs:           json.data?.activeJobs           ?? 0,
    countriesCovered:     json.data?.countriesCovered     ?? 0,
    communitiesReached:   json.data?.communitiesReached   ?? 0,
    successfulPlacements: json.data?.successfulPlacements ?? 0,
    fieldEvangelists:     json.data?.fieldEvangelists     ?? 0,
  };
}

// ── Experts / Agrilencer ───────────────────────────────────────────────────────

export async function fetchFeaturedExperts({ limit = 4 } = {}) {
  const params = new URLSearchParams({ limit, featured: 'true' });

  const res = await apiFetch(`${API_BASE}/api/experts/featured?${params.toString()}`, {
    method: 'GET',
  });

  if (!res.ok) {
    if (res.status === 404) return fetchExperts({ limit });
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Failed to fetch featured experts (${res.status}).`);
  }

  const json = await res.json();
  return { experts: json.data ?? [], pagination: json.pagination ?? {} };
}

export async function fetchExperts({ page = 1, limit = 100, specialty } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (specialty) params.set('specialty', specialty);

  const res = await apiFetch(`${API_BASE}/api/experts?${params.toString()}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Failed to fetch experts (${res.status}).`);
  }

  const json = await res.json();
  return { experts: json.data ?? [], pagination: json.pagination ?? {} };
}

export async function fetchExpertSpecialties() {
  const res = await apiFetch(`${API_BASE}/api/experts/specialties`, {
    method: 'GET',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Failed to fetch specialties (${res.status}).`);
  }

  const json = await res.json();
  return json.data ?? [];
}
