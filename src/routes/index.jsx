import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardMain from '../pages/DashboardMain';
import SystemSettings from '../pages/SystemSettings';
import MenuSettings from '../pages/MenuSettings';
import ManageUser from '../pages/ManageUser';
import UserSettings from '../pages/UserSettings';
import NotFound from '../pages/NotFound';
import { useAuth } from '../hooks/useAuth';

export const AppRoutes = () => {
  const { isAuthenticated, login } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={login} />
        }
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardMain />} />
        <Route path="system-settings" element={<SystemSettings />} />
        <Route path="manage-menu" element={<MenuSettings />} />
        <Route path="manage-user" element={<ManageUser />} />
        <Route path="user-settings" element={<UserSettings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}; 