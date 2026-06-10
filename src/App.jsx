import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MOCK_JOBS } from './data/mockDatabase';
import HomePage from './pages/HomePage';
import JobBoardPage from './pages/JobBoardPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  // Shared jobs state — initialized from mock database
  // When an employer posts a new job via the form, it gets added here
  const [jobs, setJobs] = useState([...MOCK_JOBS]);

  const handleAddJob = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobBoardPage jobs={jobs} onAddJob={handleAddJob} />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}
