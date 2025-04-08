import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardMain from "./pages/DashboardMain";
import useUserStore from "./store/userStore";
import axiosUtil from "./utils/axiosUtil";
import Cookies from 'js-cookie';
import { useMenuStore } from "./store/menuStore";
import { useEffect, useState } from "react";
import useConfigStore from "./store/configStore";

function App() {
  const navigate = useNavigate();
  const { setUser, user } = useUserStore();
  const { fetchMenus } = useMenuStore();
  const [loading, setLoading] = useState(true);
  const config = useConfigStore((state) => state.config);
  const setConfig = useConfigStore((state) => state.setConfig);
  
  const isLoggedIn = !!user?.userId; 

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axiosUtil.get("/config/getConfig");
        setConfig(response.data); 
      } catch (error) {
        console.error("Config 불러오기 실패:", error);
        // 필요 시 fallback 처리
      } finally {
        setLoading(false); // 무조건 로딩 끝내기
      }
    };
  
    fetchConfig();
  }, []);

  const handleLogin = async (userId, password) => {
    try {
      const response = await axiosUtil.post("/users/login", { userId, password });
      Cookies.set('token', response.data.token.accessToken, { expires: config.liveAccessToken, secure: true, sameSite: 'Strict' });
      localStorage.setItem("refreshToken", response.data.token.refreshToken)
    
      setUser({
        userId: response.data.userId,
        name: response.data.name,
        nickname: response.data.nickname,
        role: response.data.role,
        birthday: response.data.birthday,
        uid: response.data.uid
      });

      await fetchMenus();
      navigate("/dashboard");
    } catch (error) {        
      throw error; // 부모 컴포넌트로 에러 던짐
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">초기 설정 불러오는 중...</div>;
  }

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
