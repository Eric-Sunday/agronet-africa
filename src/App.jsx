import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MOCK_JOBS } from './data/mockDatabase';
import HomePage from './pages/HomePage';
import JobBoardPage from './pages/JobBoardPage';
import ProfilePage from './pages/ProfilePage';
import KilomboPage from './pages/KilomboPage';

export default function App() {
  // Shared jobs state — initialized from mock database
  const [jobs, setJobs] = useState([...MOCK_JOBS]);

  // Shared GAP badge state — unlocked from The Kilombo Micro-Learning
  // and displayed on the Job Seeker Profile page
  const [gapBadgeUnlocked, setGapBadgeUnlocked] = useState(false);

  const handleAddJob = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  const handleUnlockGAPBadge = () => {
    setGapBadgeUnlocked(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobBoardPage jobs={jobs} onAddJob={handleAddJob} />} />
        <Route path="/profile" element={<ProfilePage gapBadgeUnlocked={gapBadgeUnlocked} />} />
        <Route path="/kilombo" element={
          <KilomboPage
            onUnlockGAPBadge={handleUnlockGAPBadge}
            gapBadgeUnlocked={gapBadgeUnlocked}
          />
        } />
      </Routes>
    </Router>
  );
}
