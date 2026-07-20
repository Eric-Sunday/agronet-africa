// src/context/AuthContext.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Global authentication context for AgroNet Africa.
// Provides: currentUser, login(), logout(), isJobSeeker, isEmployer
// ─────────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useCallback } from 'react';
import { saveSession, clearSession, getPersistedUser } from '../lib/api';

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getPersistedUser());

  /** Call this after a successful login OR registration to persist the session. */
  const login = useCallback((user, token) => {
    if (token) saveSession(token, user);
    setCurrentUser(user);
  }, []);

  /** Wipe the session and return user to null. */
  const logout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
  }, []);

  // ── Derived role flags ─────────────────────────────────────────────────────
  const isJobSeeker = currentUser?.role === 'job_seeker';
  const isEmployer  = currentUser?.role === 'employer';
  const userRole    = currentUser?.role ?? null;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isJobSeeker, isEmployer, userRole }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
