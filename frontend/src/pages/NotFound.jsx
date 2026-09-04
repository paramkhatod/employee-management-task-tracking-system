import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { isAdmin } = useAuth();

  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: '#4f46e5', marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        The requested resource does not exist or has been moved.
      </p>
      <Link to={isAdmin ? '/admin/dashboard' : '/employee/dashboard'} className="btn btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
