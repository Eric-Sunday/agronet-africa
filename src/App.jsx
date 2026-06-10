import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MOCK_JOBS } from './data/mockDatabase';
import HomePage from './pages/HomePage';
import JobBoardPage from './pages/JobBoardPage';
import ProfilePage from './pages/ProfilePage';
import KilomboPage from './pages/KilomboPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  // â”€â”€ Auth state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin  = (user) => setCurrentUser(user);
  const handleLogout = ()     => setCurrentUser(null);

  // â”€â”€ Jobs state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [jobs, setJobs] = useState([...MOCK_JOBS]);
  const handleAddJob = (newJob) => setJobs((prev) => [newJob, ...prev]);

  // â”€â”€ GAP badge state (The Kilombo â†’ Profile) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [gapBadgeUnlocked, setGapBadgeUnlocked] = useState(false);
  const handleUnlockGAPBadge = () => setGapBadgeUnlocked(true);

  return (
    <Router>
      <Routes>
        <Route path="/"         element={<HomePage currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/login"    element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
        <Route path="/jobs"     element={<JobBoardPage jobs={jobs} onAddJob={handleAddJob} currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/profile"  element={<ProfilePage gapBadgeUnlocked={gapBadgeUnlocked} currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/kilombo"  element={
          <KilomboPage
            onUnlockGAPBadge={handleUnlockGAPBadge}
            gapBadgeUnlocked={gapBadgeUnlocked}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        } />
      </Routes>
    </Router>
  );
}
