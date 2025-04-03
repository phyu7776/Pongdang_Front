import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import DashboardMain from "./pages/DashboardMain";
import useUserStore from "./store/userStore"; // 전역 상태

function App() {
  const { user } = useUserStore();
  const isLoggedIn = !!user?.token;

  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/"
        element={isLoggedIn ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardMain />} />
      </Route>
    </Routes>
  );
}

export default App;
