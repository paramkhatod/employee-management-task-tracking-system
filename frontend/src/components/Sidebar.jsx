import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  UserCircle,
  Building2,
} from 'lucide-react';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Building2 size={24} color="#4f46e5" />
        <span>PulseTrack Pro</span>
      </div>

      <nav className="sidebar-nav">
        {isAdmin ? (
          <>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Admin Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/employees"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>Employees</span>
            </NavLink>

            <NavLink
              to="/admin/tasks"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <CheckSquare size={18} />
              <span>Task Board</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/employee/dashboard"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/employee/tasks"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <CheckSquare size={18} />
              <span>My Assigned Tasks</span>
            </NavLink>
          </>
        )}

        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          style={{ marginTop: 'auto' }}
        >
          <UserCircle size={18} />
          <span>My Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
