import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JobBoardPage from './pages/JobBoardPage';
import ProfilePage from './pages/ProfilePage';
import KilomboPage from './pages/KilomboPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExpertDirectoryPage from './pages/expert/ExpertDirectoryPage';
import EscrowDashboardPage from './pages/expert/EscrowDashboardPage';
import { getPersistedUser, clearSession } from './lib/api';

export default function App() {
  // ── Auth state — rehydrated from localStorage on first load ─────────────────
  const [currentUser, setCurrentUser] = useState(() => getPersistedUser());

  const handleLogin = (user) => setCurrentUser(user);

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
  };

  // ── GAP badge state (The Kilombo → Profile) ──────────────────────────────────
  const [gapBadgeUnlocked, setGapBadgeUnlocked] = useState(false);
  const handleUnlockGAPBadge = () => setGapBadgeUnlocked(true);

  // ── Agrilencer: Escrow Contracts state ────────────────────────────────────────
  const [contracts, setContracts] = useState([]);
  const handleAddContract = (newContract) =>
    setContracts((prev) => [newContract, ...prev]);

  return (
    <Router>
      <Routes>
        <Route path="/"         element={<HomePage currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/login"    element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
        <Route path="/jobs"     element={<JobBoardPage currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/profile"  element={
          currentUser
            ? <ProfilePage gapBadgeUnlocked={gapBadgeUnlocked} currentUser={currentUser} onLogout={handleLogout} />
            : <Navigate to="/login" replace />
        } />
        <Route path="/kilombo"  element={
          <KilomboPage
            onUnlockGAPBadge={handleUnlockGAPBadge}
            gapBadgeUnlocked={gapBadgeUnlocked}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        } />
        {/* ── Agrilencer Premium Routes ── */}
        <Route path="/expert" element={
          <ExpertDirectoryPage
            currentUser={currentUser}
            onLogout={handleLogout}
            onAddContract={handleAddContract}
          />
        } />
        <Route path="/expert/escrow-dashboard" element={
          <EscrowDashboardPage
            currentUser={currentUser}
            onLogout={handleLogout}
            contracts={contracts}
            setContracts={setContracts}
          />
        } />
      </Routes>
    </Router>
  );
}
