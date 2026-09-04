import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskFormModal from './TaskFormModal';
import { Search, Plus, Edit, Trash2, Calendar, User } from 'lucide-react';

const TasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [pageInfo, setPageInfo] = useState({ pageNo: 0, pageSize: 10, totalPages: 0, totalElements: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchTasks(0);
  }, [search, statusFilter, priorityFilter]);

  const fetchTasks = async (page = 0) => {
    try {
      setLoading(true);
      const data = await taskService.getTasks({
        search: search || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        page,
        size: 10,
      });

      setTasks(data.content);
      setPageInfo({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteId) return;
    try {
      await taskService.deleteTask(deleteId);
      setDeleteId(null);
      fetchTasks(pageInfo.pageNo);
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Task Management</h1>
          <p style={{ color: '#64748b' }}>Create tasks, assign work to employees, track priorities and status workflow.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} />
          <span>Create Task</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            className="form-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Tasks Data Table */}
      <div className="table-container">
        {loading ? (
          <LoadingSpinner message="Loading task board..." />
        ) : error ? (
          <div style={{ color: '#ef4444', padding: '2rem', textAlign: 'center' }}>{error}</div>
        ) : tasks.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            No tasks found. Create a new task to assign work to employees.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Assigned Employee</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td style={{ fontWeight: 600, maxWidth: '280px' }}>
                    <div>{task.title}</div>
                    {task.description && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {task.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500 }}>
                      <User size={14} color="#64748b" />
                      <span>{task.assignedEmployeeName || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td>
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td>
                    <StatusBadge status={task.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: '#475569' }}>
                      <Calendar size={14} />
                      <span>{task.dueDate}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.35rem 0.6rem' }}
                        title="Edit Task"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.35rem 0.6rem', color: '#ef4444', borderColor: '#fecaca' }}
                        title="Delete Task"
                        onClick={() => setDeleteId(task.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
          onPageChange={fetchTasks}
        />
      </div>

      {/* Task Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={selectedTask}
        onSuccess={() => fetchTasks(pageInfo.pageNo)}
      />

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Delete Task?</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteTask}>Delete Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksList;
