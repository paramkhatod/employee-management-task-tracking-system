import React, { useState, useEffect } from 'react';
import { X, UserPlus, Edit3, AlertCircle } from 'lucide-react';
import { employeeService } from '../services/employeeService';

const EmployeeFormModal = ({ isOpen, onClose, employeeToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: 'Software Engineer',
    joiningDate: new Date().toISOString().split('T')[0],
    role: 'EMPLOYEE',
    password: '',
    active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        firstName: employeeToEdit.firstName || '',
        lastName: employeeToEdit.lastName || '',
        email: employeeToEdit.email || '',
        phone: employeeToEdit.phone || '',
        department: employeeToEdit.department || 'Engineering',
        designation: employeeToEdit.designation || 'Software Engineer',
        joiningDate: employeeToEdit.joiningDate || new Date().toISOString().split('T')[0],
        role: employeeToEdit.role || 'EMPLOYEE',
        password: '', // Password not required for update
        active: employeeToEdit.active !== undefined ? employeeToEdit.active : true,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: 'Engineering',
        designation: 'Software Engineer',
        joiningDate: new Date().toISOString().split('T')[0],
        role: 'EMPLOYEE',
        password: '',
        active: true,
      });
    }
    setError('');
    setValidationErrors({});
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setLoading(true);

    try {
      if (employeeToEdit) {
        await employeeService.updateEmployee(employeeToEdit.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          department: formData.department,
          designation: formData.designation,
          active: formData.active,
        });
      } else {
        await employeeService.createEmployee(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'An error occurred while saving employee details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {employeeToEdit ? <Edit3 size={20} color="#4f46e5" /> : <UserPlus size={20} color="#4f46e5" />}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {employeeToEdit ? 'Edit Employee Details' : 'Add New Employee'}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                className="form-input"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {validationErrors.firstName && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{validationErrors.firstName}</span>}
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                className="form-input"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {validationErrors.lastName && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{validationErrors.lastName}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                disabled={!!employeeToEdit}
                required
              />
              {validationErrors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{validationErrors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={handleChange}
              />
              {validationErrors.phone && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{validationErrors.phone}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Department *</label>
              <select name="department" className="form-select" value={formData.department} onChange={handleChange}>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            <div className="form-group">
              <label>Designation *</label>
              <input
                type="text"
                name="designation"
                className="form-input"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {!employeeToEdit && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Joining Date *</label>
                <input
                  type="date"
                  name="joiningDate"
                  className="form-input"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>System Role *</label>
                <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
          )}

          {!employeeToEdit && (
            <div className="form-group">
              <label>Account Initial Password *</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {validationErrors.password && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{validationErrors.password}</span>}
            </div>
          )}

          {employeeToEdit && (
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              <label htmlFor="active" style={{ marginBottom: 0, cursor: 'pointer' }}>Active Employee Status</label>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : employeeToEdit ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
