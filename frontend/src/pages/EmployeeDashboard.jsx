import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckSquare, Clock, CheckCircle2, Calendar } from 'lucide-react';

const EmployeeDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployeeMetrics();
  }, []);

  const fetchEmployeeMetrics = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getEmployeeDashboard();
      setMetrics(data);
    } catch (err) {
      setError('Failed to fetch employee dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading employee dashboard..." />;
  if (error) return <div style={{ color: '#ef4444', padding: '2rem' }}>{error}</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Employee Dashboard</h1>
        <p style={{ color: '#64748b' }}>Overview of your assigned workload and upcoming task deadlines.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <div className="stat-val">{metrics?.totalAssignedTasks || 0}</div>
            <div className="stat-label">Total Assigned Tasks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val">{metrics?.pendingTasks || 0}</div>
            <div className="stat-label">Pending (To Do)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val">{metrics?.inProgressTasks || 0}</div>
            <div className="stat-label">In-Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val">{metrics?.completedTasks || 0}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines Table */}
      <div className="table-container" style={{ marginTop: '2rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Upcoming Deadlines</h3>
        </div>

        {!metrics?.upcomingDeadlines || metrics.upcomingDeadlines.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            🎉 You have no upcoming task deadlines!
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {metrics.upcomingDeadlines.map((task) => (
                <tr key={task.id}>
                  <td style={{ fontWeight: 600 }}>{task.title}</td>
                  <td><PriorityBadge priority={task.priority} /></td>
                  <td><StatusBadge status={task.status} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontWeight: 500 }}>
                      <Calendar size={14} />
                      <span>{task.dueDate}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
