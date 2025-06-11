import React from 'react';
import { Navigate } from 'react-router-dom';

function RequireAdmin({ user, children }) {
  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin') {
    // Logged in but not admin, redirect to POS page
    return <Navigate to="/pos" replace />;
  }
  // User is admin, allow access
  return children;
}

export default RequireAdmin;