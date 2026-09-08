import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { aiService } from '../services/aiService';
import { reportService } from '../services/reportService';
import { auditLogService } from '../services/auditLogService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, CheckSquare, Clock, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, FileText, History, X } from 'lucide-react';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // AI Insights state
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Audit Logs state
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    fetchDashboardMetrics();
    fetchAiInsights();
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

  const fetchAiInsights = async () => {
    try {
      setAiLoading(true);
      const data = await aiService.getWorkloadSummary();
      setAiInsights(data);
    } catch (err) {
      console.warn('AI workload insights call failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      await reportService.downloadAllTasksPdf();
    } catch (err) {
      alert('Failed to download PDF task report.');
    }
  };

  const handleOpenAuditLogs = async () => {
    setShowAuditLogs(true);
    try {
      setLogsLoading(true);
      const data = await auditLogService.getAuditLogs(0, 20);
      setAuditLogs(data.content || []);
    } catch (err) {
      console.warn('Failed to load audit logs');
    } finally {
      setLogsLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching live metrics..." />;
  if (error) return <div style={{ color: '#ef4444', padding: '2rem' }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Admin Dashboard</h1>
          <p style={{ color: '#64748b' }}>Overview of organization employees, active tasks, and status metrics.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleOpenAuditLogs}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <History size={16} />
            <span>Activity Audit Logs</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#4f46e5' }}
          >
            <FileText size={16} />
            <span>Export PDF Report</span>
          </button>
        </div>
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

      {/* 🤖 Gemini AI Workload & Team Performance Insights */}
      <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #c7d2fe', marginBottom: '2rem', boxShadow: '0 2px 4px 0 rgba(79, 70, 229, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="#4f46e5" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3730a3' }}>
              🤖 Gemini AI Workforce & Workload Insights
            </h3>
          </div>
          {aiInsights?.teamHealthScore && (
            <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', fontSize: '0.8rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '12px' }}>
              Team Health Score: {aiInsights.teamHealthScore}/100
            </span>
          )}
        </div>

        {aiLoading ? (
          <div style={{ color: '#6366f1', fontSize: '0.875rem' }}>Analyzing workforce workload with Gemini...</div>
        ) : (
          <div>
            <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '0.75rem', lineHeight: '1.5' }}>
              {aiInsights?.workloadAnalysis || 'Your team workload is evenly distributed across active tasks.'}
            </p>
            {aiInsights?.recommendedActions && aiInsights.recommendedActions.length > 0 && (
              <div style={{ backgroundColor: 'white', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e0e7ff' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4f46e5', marginBottom: '0.25rem' }}>
                  Recommended Actions:
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#475569' }}>
                  {aiInsights.recommendedActions.map((action, idx) => (
                    <li key={idx} style={{ marginBottom: '0.2rem' }}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
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

      {/* Audit Logs Modal */}
      {showAuditLogs && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={20} color="#4f46e5" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>System Activity Audit Logs</h3>
              </div>
              <button onClick={() => setShowAuditLogs(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {logsLoading ? (
              <LoadingSpinner message="Fetching activity logs..." />
            ) : (
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table className="table" style={{ fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Action</th>
                      <th>User</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8' }}>
                          No audit logs recorded yet.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td style={{ whiteSpace: 'nowrap', color: '#64748b' }}>
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: '#4f46e5' }}>{log.action}</span>
                          </td>
                          <td style={{ color: '#0f172a' }}>{log.performedBy}</td>
                          <td style={{ color: '#334155' }}>{log.details}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
