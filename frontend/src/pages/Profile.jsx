import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { employeeService } from '../services/employeeService';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Mail, Phone, Building, Shield, Calendar, Briefcase } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getCurrentEmployee();
      setProfile(data);
    } catch (err) {
      // Fallback if employee profile entity not yet linked
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading user profile..." />;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>User Profile</h1>
        <p style={{ color: '#64748b' }}>Account details and organizational designation.</p>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 700 }}>
            {(profile?.fullName || user?.fullName || 'U')[0]}
          </div>

          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>{profile?.fullName || user?.fullName}</h2>
            <div style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <Shield size={14} color="#4f46e5" />
              <span>Role: <strong>{user?.role}</strong></span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
              Email Address
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
              <Mail size={16} color="#64748b" />
              <span>{profile?.email || user?.email}</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
              Phone Number
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
              <Phone size={16} color="#64748b" />
              <span>{profile?.phone || 'Not provided'}</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
              Department
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
              <Building size={16} color="#64748b" />
              <span>{profile?.department || 'System Administration'}</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
              Designation
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
              <Briefcase size={16} color="#64748b" />
              <span>{profile?.designation || 'Administrator'}</span>
            </div>
          </div>

          {profile?.joiningDate && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                Joining Date
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                <Calendar size={16} color="#64748b" />
                <span>{profile.joiningDate}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
