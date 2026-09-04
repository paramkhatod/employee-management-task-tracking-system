import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pageInfo, setPageInfo] = useState({ pageNo: 0, pageSize: 10, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyTasks(0);
  }, []);

  const fetchMyTasks = async (page = 0) => {
    try {
      setLoading(true);
      const data = await taskService.getMyTasks({ page, size: 10 });
      setTasks(data.content);
      setPageInfo({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (err) {
      setError('Failed to fetch assigned tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setUpdatingId(taskId);
      await taskService.updateTaskStatus(taskId, newStatus);
      fetchMyTasks(pageInfo.pageNo);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>My Assigned Tasks</h1>
        <p style={{ color: '#64748b' }}>View your tasks and update progress status as you complete work.</p>
      </div>

      {error && (
        <div style={{ color: '#ef4444', background: '#fee2e2', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <LoadingSpinner message="Loading assigned tasks..." />
        ) : tasks.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            No tasks assigned to you currently.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Priority</th>
                <th>Current Status</th>
                <th>Due Date</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td style={{ fontWeight: 600, maxWidth: '320px' }}>
                    <div>{task.title}</div>
                    {task.description && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                        {task.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td>
                    <StatusBadge status={task.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                      <Calendar size={14} color="#64748b" />
                      <span>{task.dueDate}</span>
                    </div>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '0.35rem 0.5rem', width: 'auto', minWidth: '130px' }}
                      value={task.status}
                      disabled={updatingId === task.id || task.status === 'COMPLETED'}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Pagination
          pageNo={pageInfo.pageNo}
          pageSize={pageInfo.pageSize}
          totalPages={pageInfo.totalPages}
          totalElements={pageInfo.totalElements}
          onPageChange={fetchMyTasks}
        />
      </div>
    </div>
  );
};

export default EmployeeTasks;
