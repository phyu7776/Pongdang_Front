import { Routes, Route, Navigate } from "react-router-dom"; // Navigate 임포트 추가
import Layout from "./layout/Layout"; 
import Login from "./pages/Login";
import DashboardMain from "./pages/DashboardMain";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <DashboardMain /> : <Navigate to="/login" />}
        />
      </Route>
    </Routes>
  );
}

export default App;
