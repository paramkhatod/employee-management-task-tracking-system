import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmployeeFormModal from './EmployeeFormModal';
import { Search, Plus, Filter, Edit, UserX, AlertCircle } from 'lucide-react';

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [pageInfo, setPageInfo] = useState({ pageNo: 0, pageSize: 10, totalPages: 0, totalElements: 0 });
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deactivateId, setDeactivateId] = useState(null);

  useEffect(() => {
    fetchEmployees(0);
  }, [search, department, activeFilter]);

  const fetchEmployees = async (page = 0) => {
    try {
      setLoading(true);
      const activeParam = activeFilter === 'true' ? true : activeFilter === 'false' ? false : undefined;
      const data = await employeeService.getEmployees({
        search: search || undefined,
        department: department || undefined,
        active: activeParam,
        page,
        size: 10,
      });

      setEmployees(data.content);
      setPageInfo({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (err) {
      setError('Failed to fetch employee list');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateId) return;
    try {
      await employeeService.deactivateEmployee(deactivateId);
      setDeactivateId(null);
      fetchEmployees(pageInfo.pageNo);
    } catch (err) {
      alert('Failed to deactivate employee');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Employee Directory</h1>
          <p style={{ color: '#64748b' }}>Manage company employees, designations, and account access.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedEmployee(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="controls-bar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            className="form-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={{ minWidth: '160px' }}
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
          </select>

          <select
            className="form-select"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        {loading ? (
          <LoadingSpinner message="Loading employee directory..." />
        ) : error ? (
          <div style={{ color: '#ef4444', padding: '2rem', textAlign: 'center' }}>{error}</div>
        ) : employees.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            No employees found matching the specified criteria.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 600 }}>{emp.fullName}</td>
                  <td style={{ color: '#64748b' }}>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px', background: emp.role === 'ADMIN' ? '#eef2ff' : '#f1f5f9', color: emp.role === 'ADMIN' ? '#4f46e5' : '#475569' }}>
                      {emp.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${emp.active ? 'badge-active' : 'badge-inactive'}`}>
                      {emp.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.35rem 0.6rem' }}
                        title="Edit Employee"
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit size={14} />
                      </button>

                      {emp.active && (
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.6rem', color: '#ef4444', borderColor: '#fecaca' }}
                          title="Deactivate Employee"
                          onClick={() => setDeactivateId(emp.id)}
                        >
                          <UserX size={14} />
                        </button>
                      )}
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
          onPageChange={fetchEmployees}
        />
      </div>

      {/* Employee Modal */}
      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employeeToEdit={selectedEmployee}
        onSuccess={() => fetchEmployees(pageInfo.pageNo)}
      />

      {/* Deactivate Confirmation Modal */}
      {deactivateId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', marginBottom: '1rem' }}>
              <AlertCircle size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Deactivate Employee?</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Are you sure you want to deactivate this employee? Their account login access will be disabled immediately.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setDeactivateId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeactivate}>Deactivate Access</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesList;
