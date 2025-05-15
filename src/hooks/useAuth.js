import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';
import { useMenuStore } from '../store/menuStore';
import useConfigStore from '../store/configStore';
import axiosUtil from '../utils/axiosUtil';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const navigate = useNavigate();
  const { setUser, user, clearUser } = useUserStore();
  const { fetchMenus } = useMenuStore();
  const config = useConfigStore((state) => state.config);

  const login = async (userId, password) => {
    try {
      const response = await axiosUtil.post("/users/login", { userId, password });
      Cookies.set('token', response.data.token.accessToken, { 
        expires: config.liveAccessToken, 
        secure: true, 
        sameSite: 'Strict' 
      });
      localStorage.setItem("refreshToken", response.data.token.refreshToken);
    
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
      throw error;
    }
  };

  const logout = () => {
    // userStore의 clearUser만 호출 (중앙 집중식 로그아웃 처리)
    clearUser();
  };

  const isAuthenticated = !!user?.userId;

  return {
    login,
    logout,
    isAuthenticated,
    user
  };
}; 