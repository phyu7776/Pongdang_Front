import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardMain from "./pages/DashboardMain";
import useUserStore from "./store/userStore";
import axiosUtil from "./utils/axiosUtil";
import Cookies from 'js-cookie';
import { useMenuStore } from "./store/menuStore";

function App() {
  const { setUser } = useUserStore();
  const { fetchMenus } = useMenuStore();
  const isLoggedIn = !!Cookies.get('token');
  const navigate = useNavigate();

  const handleLogin = async (userId, password) => {
    try {
      const response = await axiosUtil.post("/users/login", { userId, password });
      Cookies.set('token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
    
      setUser({
        userId: response.data.userId,
        name: response.data.name,
        nickname: response.data.nickname,
        role: response.data.role,
        birthday: response.data.birthday,
        uid: response.data.uid,
      });

      await fetchMenus();
      navigate("/dashboard");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <Routes>

      <Route
        path="/login"
        element={
          isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
        }
      />

      <Route
          path="/register"
          element={<Register />} // ✅ 추가!
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
