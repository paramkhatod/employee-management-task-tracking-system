import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner size="large" message="Verifying session credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // If Admin attempts to visit Employee routes or vice-versa, redirect to appropriate home
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/employee/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
