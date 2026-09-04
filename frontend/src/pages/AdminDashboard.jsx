import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, CheckSquare, Clock, CheckCircle2, AlertTriangle, XCircle, TrendingUp, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getAdminDashboard();
      setMetrics(data);
    } catch (err) {
      setError('Failed to load dashboard metrics. Please check backend server.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching live metrics..." />;
  if (error) return <div style={{ color: '#ef4444', padding: '2rem' }}>{error}</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Admin Dashboard</h1>
        <p style={{ color: '#64748b' }}>Overview of organization employees, active tasks, and status metrics.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-val">{metrics?.totalEmployees || 0}</div>
            <div className="stat-label">Total Employees</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-val">{metrics?.activeEmployees || 0}</div>
            <div className="stat-label">Active Workforce</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <div className="stat-val">{metrics?.totalTasks || 0}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val">{metrics?.inProgressTasks || 0}</div>
            <div className="stat-label">In-Progress Tasks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val">{metrics?.completedTasks || 0}</div>
            <div className="stat-label">Completed Tasks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ffedd5', color: '#ea580c' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="stat-val">{metrics?.highPriorityTasks || 0}</div>
            <div className="stat-label">High / Urgent Priority</div>
          </div>
        </div>
      </div>

      {/* Task Status Progress Bar & Breakdown */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#0f172a' }}>
          Task Status Distribution
        </h3>

        <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f1f5f9', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: `${metrics?.totalTasks > 0 ? (metrics.completedTasks / metrics.totalTasks) * 100 : 0}%`,
              backgroundColor: '#22c55e',
            }}
            title={`Completed: ${metrics?.completedTasks}`}
          />
          <div
            style={{
              width: `${metrics?.totalTasks > 0 ? (metrics.inProgressTasks / metrics.totalTasks) * 100 : 0}%`,
              backgroundColor: '#0284c7',
            }}
            title={`In Progress: ${metrics?.inProgressTasks}`}
          />
          <div
            style={{
              width: `${metrics?.totalTasks > 0 ? (metrics.pendingTasks / metrics.totalTasks) * 100 : 0}%`,
              backgroundColor: '#94a3b8',
            }}
            title={`To Do: ${metrics?.pendingTasks}`}
          />
          <div
            style={{
              width: `${metrics?.totalTasks > 0 ? (metrics.cancelledTasks / metrics.totalTasks) * 100 : 0}%`,
              backgroundColor: '#ef4444',
            }}
            title={`Cancelled: ${metrics?.cancelledTasks}`}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Pending (To Do): <strong>{metrics?.pendingTasks || 0}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>In Progress: <strong>{metrics?.inProgressTasks || 0}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Completed: <strong>{metrics?.completedTasks || 0}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Cancelled: <strong>{metrics?.cancelledTasks || 0}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
