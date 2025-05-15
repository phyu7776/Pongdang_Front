import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';

// 레이아웃 컴포넌트는 지연 로딩하지 않음
import Layout from '../layout/Layout';

// 페이지 컴포넌트 지연 로딩
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const DashboardMain = lazy(() => import('../pages/DashboardMain'));
const SystemSettings = lazy(() => import('../pages/SystemSettings'));
const MenuSettings = lazy(() => import('../pages/MenuSettings'));
const ManageUser = lazy(() => import('../pages/ManageUser'));
const UserSettings = lazy(() => import('../pages/UserSettings'));
const BoardList = lazy(() => import('../pages/BoardList'));
const BoardDetail = lazy(() => import('../pages/BoardDetail'));
const BoardWrite = lazy(() => import('../pages/BoardWrite'));
const LessonList = lazy(() => import('../pages/LessonList'));
const LessonDetail = lazy(() => import('../pages/LessonDetail'));
const LessonWrite = lazy(() => import('../pages/LessonWrite'));
const NotFound = lazy(() => import('../pages/NotFound'));

// 로딩 컴포넌트
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
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
          <Route path="board" element={<BoardList />} />
          <Route path="board/create" element={<BoardWrite />} />
          <Route path="board/:id" element={<BoardDetail />} />
          <Route path="board/:id/edit" element={<BoardWrite isEdit={true} />} />
          <Route path="lesson-reservation" element={<LessonList />} />
          <Route path="lesson-reservation/create" element={<LessonWrite />} />
          <Route path="lesson-reservation/:id" element={<LessonDetail />} />
          <Route path="lesson-reservation/:id/edit" element={<LessonWrite isEdit={true} />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}; 