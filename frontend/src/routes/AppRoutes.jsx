import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

// Pages
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import EmployeesList from '../pages/EmployeesList';
import TasksList from '../pages/TasksList';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import EmployeeTasks from '../pages/EmployeeTasks';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-wrapper">{children}</main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? '/admin/dashboard' : '/employee/dashboard'} replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? (isAdmin ? '/admin/dashboard' : '/employee/dashboard') : '/login'} replace />
        }
      />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route
          path="/admin/dashboard"
          element={
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <MainLayout>
              <EmployeesList />
            </MainLayout>
          }
        />
        <Route
          path="/admin/tasks"
          element={
            <MainLayout>
              <TasksList />
            </MainLayout>
          }
        />
      </Route>

      {/* Protected Employee Routes */}
      <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']} />}>
        <Route
          path="/employee/dashboard"
          element={
            <MainLayout>
              <EmployeeDashboard />
            </MainLayout>
          }
        />
        <Route
          path="/employee/tasks"
          element={
            <MainLayout>
              <EmployeeTasks />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
      </Route>

      {/* Catch-all 404 Route */}
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFound />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
