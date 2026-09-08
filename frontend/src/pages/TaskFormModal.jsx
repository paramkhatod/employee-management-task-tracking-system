import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Edit3, AlertCircle, Sparkles } from 'lucide-react';
import { taskService } from '../services/taskService';
import { employeeService } from '../services/employeeService';
import { aiService } from '../services/aiService';

const TaskFormModal = ({ isOpen, onClose, taskToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedEmployeeId: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchActiveEmployees();
    }
  }, [isOpen]);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        assignedEmployeeId: taskToEdit.assignedEmployeeId || '',
        priority: taskToEdit.priority || 'MEDIUM',
        status: taskToEdit.status || 'TODO',
        dueDate: taskToEdit.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assignedEmployeeId: '',
        priority: 'MEDIUM',
        status: 'TODO',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      });
    }
    setError('');
  }, [taskToEdit, isOpen]);

  const fetchActiveEmployees = async () => {
    try {
      const data = await employeeService.getEmployees({ active: true, size: 100 });
      setEmployees(data.content || []);
    } catch (err) {
      setError('Failed to fetch employee list for task assignment');
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAiBreakdown = async () => {
    if (!formData.title) {
      setError('Please enter a Task Title first to let Gemini AI generate sub-tasks.');
      return;
    }
    setError('');
    setAiLoading(true);

    try {
      const res = await aiService.generateTaskBreakdown(formData.title, formData.description);
      let formattedDescription = formData.description ? formData.description + '\n\n' : '';
      formattedDescription += `--- AI Sub-Task Decomposition ---\n${res.summary || ''}\n`;
      if (res.subTasks && res.subTasks.length > 0) {
        res.subTasks.forEach((item, idx) => {
          formattedDescription += `${idx + 1}. [ ] ${item.title} (~${item.estimatedHours}h, Priority: ${item.suggestedPriority})\n`;
        });
      }
      setFormData((prev) => ({ ...prev, description: formattedDescription.trim() }));
    } catch (err) {
      setError('AI breakdown request failed. Please check Gemini API configuration.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (taskToEdit) {
        await taskService.updateTask(taskToEdit.id, {
          ...formData,
          assignedEmployeeId: Number(formData.assignedEmployeeId),
        });
      } else {
        await taskService.createTask({
          ...formData,
          assignedEmployeeId: Number(formData.assignedEmployeeId),
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while saving task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {taskToEdit ? <Edit3 size={20} color="#4f46e5" /> : <CheckSquare size={20} color="#4f46e5" />}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {taskToEdit ? 'Edit Task Details' : 'Create & Assign Task'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label style={{ margin: 0 }}>Task Title *</label>
              <button
                type="button"
                onClick={handleAiBreakdown}
                disabled={aiLoading}
                className="btn btn-outline"
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.75rem',
                  borderColor: '#818cf8',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Sparkles size={13} color="#4f46e5" />
                {aiLoading ? 'Decomposing with Gemini...' : '✨ Generate AI Sub-tasks'}
              </button>
            </div>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. Implement User Authentication Service"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              className="form-textarea"
              rows={5}
              placeholder="Detailed description of requirements..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Assign to Employee *</label>
            <select
              name="assignedEmployeeId"
              className="form-select"
              value={formData.assignedEmployeeId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Active Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.department} - {emp.designation})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Priority *</label>
              <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                name="dueDate"
                className="form-input"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : taskToEdit ? 'Update Task' : 'Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
