import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield, Briefcase } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>
          Workspace Overview
        </h2>
      </div>

      <div className="navbar-user">
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>
            {user?.fullName || user?.email}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
            {isAdmin ? (
              <span style={{ color: '#4f46e5', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Shield size={12} /> Administrator
              </span>
            ) : (
              <span style={{ color: '#0284c7', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Briefcase size={12} /> Employee
              </span>
            )}
          </div>
        </div>

        <div className="user-avatar">{getInitials(user?.fullName || user?.email)}</div>

        <button
          onClick={logout}
          className="btn btn-outline"
          style={{ padding: '0.5rem 0.75rem', marginLeft: '0.5rem' }}
          title="Logout"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
