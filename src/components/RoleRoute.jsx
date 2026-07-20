// src/components/RoleRoute.jsx
// ─────────────────────────────────────────────────────────────────────────────
// A frontend route guard component that enforces role-based access.
//
// Usage:
//   <RoleRoute allowedRoles={['employer']}>
//     <JobPostPage />
//   </RoleRoute>
//
// Behaviour:
//   - Not logged in → redirect to /login
//   - Logged in but wrong role → redirect to /profile?error=access_denied
//   - Correct role → render children
// ─────────────────────────────────────────────────────────────────────────────
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ allowedRoles, children }) {
  const { currentUser, userRole } = useAuth();
  const location = useLocation();

  // 1. Not authenticated at all — send to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Authenticated but role not in the allowed list — send to profile with error
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/profile?error=access_denied" replace />;
  }

  // 3. Authorised — render the protected content
  return children;
}
