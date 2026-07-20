// src/App.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Root router — wraps the app in AuthProvider so every component can read
// the current user and role without prop-drilling.
// ─────────────────────────────────────────────────────────────────────────────
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleRoute from './components/RoleRoute';
import HomePage from './pages/HomePage';
import JobBoardPage from './pages/JobBoardPage';
import ProfilePage from './pages/ProfilePage';
import KilomboPage from './pages/KilomboPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExpertDirectoryPage from './pages/expert/ExpertDirectoryPage';
import EscrowDashboardPage from './pages/expert/EscrowDashboardPage';
import { useState } from 'react';

// ── Inner app (has access to AuthContext) ─────────────────────────────────────
function AppRoutes() {
  const { currentUser, login, logout } = useAuth();

  // ── GAP badge state (The Kilombo → Profile) ────────────────────────────────
  const [gapBadgeUnlocked, setGapBadgeUnlocked] = useState(false);
  const handleUnlockGAPBadge = () => setGapBadgeUnlocked(true);

  // ── Agrilencer: Escrow Contracts state ────────────────────────────────────
  const [contracts, setContracts] = useState([]);
  const handleAddContract = (newContract) =>
    setContracts((prev) => [newContract, ...prev]);

  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route path="/"        element={<HomePage        currentUser={currentUser} onLogout={logout} />} />
      <Route path="/login"   element={<LoginPage       />} />
      <Route path="/register" element={<RegisterPage   />} />
      <Route path="/jobs"    element={<JobBoardPage    currentUser={currentUser} onLogout={logout} />} />
      <Route path="/kilombo" element={
        <KilomboPage
          onUnlockGAPBadge={handleUnlockGAPBadge}
          gapBadgeUnlocked={gapBadgeUnlocked}
          currentUser={currentUser}
          onLogout={logout}
        />
      } />

      {/* ── Authenticated-only Routes ── */}
      <Route path="/profile" element={
        currentUser
          ? <ProfilePage gapBadgeUnlocked={gapBadgeUnlocked} currentUser={currentUser} onLogout={logout} />
          : <Navigate to="/login" replace />
      } />

      {/* ── Employer-only Routes ── */}
      {/* /jobs/new: employer-only job creation — job_seekers redirected to /profile?error=access_denied */}
      <Route path="/jobs/new" element={
        <RoleRoute allowedRoles={['employer']}>
          {/* Inline employer job-posting view — renders the JobBoard with form open */}
          <JobBoardPage currentUser={currentUser} onLogout={logout} forceShowForm />
        </RoleRoute>
      } />

      {/* ── Agrilencer Premium Routes ── */}
      <Route path="/expert" element={
        <ExpertDirectoryPage
          currentUser={currentUser}
          onLogout={logout}
          onAddContract={handleAddContract}
        />
      } />
      <Route path="/expert/escrow-dashboard" element={
        <EscrowDashboardPage
          currentUser={currentUser}
          onLogout={logout}
          contracts={contracts}
          setContracts={setContracts}
        />
      } />

      {/* ── Catch-all ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ── Root export — AuthProvider wraps everything ───────────────────────────────
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
