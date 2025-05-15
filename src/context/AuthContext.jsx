import React, { createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';
import { useMenuStore } from '../store/menuStore';
import useConfigStore from '../store/configStore';
import axiosUtil from '../utils/axiosUtil';
import Cookies from 'js-cookie';

const AuthContext = createContext();

/**
 * 인증 컨텍스트 제공자 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const { setUser, user, clearUser } = useUserStore();
  const { fetchMenus } = useMenuStore();
  const config = useConfigStore((state) => state.config);

  // 로그인 함수
  const login = useCallback(async (userId, password) => {
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
      return response.data;
    } catch (error) {
      console.error("로그인 오류:", error);
      throw error;
    }
  }, [navigate, setUser, fetchMenus, config]);

  // 로그아웃 함수
  const logout = useCallback(() => {
    clearUser();
  }, [clearUser]);

  // 인증 상태 체크
  const isAuthenticated = !!user?.userId;

  const value = {
    user,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 인증 컨텍스트를 사용하기 위한 커스텀 훅
 * @returns {Object} 인증 관련 상태 및 함수
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다');
  }
  return context;
} 