import { create } from "zustand";
import Cookies from 'js-cookie';
import axiosUtil from '../utils/axiosUtil'

const useUserStore = create((set, get) => ({
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,
  isLoggingOut: false, // 로그아웃 진행 중 플래그 추가

  setUser: (userData) => {
    set({ user: userData });
    Cookies.set('user', JSON.stringify(userData), { expires: 7, secure: true, sameSite: 'Strict' }); // user 쿠키에 저장
  },

  clearUser: async () => {
    // 로그아웃 진행 중 플래그 설정
    set({ isLoggingOut: true });
    
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = Cookies.get("token");
      const user = JSON.parse(Cookies.get("user") || "{}"); // 쿠키 없는 경우 빈 객체로 대체
      
      // 유저 정보가 있는 경우만 로그아웃 API 호출
      if (user?.userId && accessToken) {
        const userInfo = {
          userId: user.userId,
          token : {
            "refreshToken" : refreshToken,
            "accessToken" : accessToken
          }
        };

        await axiosUtil.post("/users/logout", userInfo);
      }
    } catch (error) {
      console.error("서버 로그아웃 실패:", error);
    } finally {
      // 모든 인증 정보 삭제
      Cookies.remove('token');
      Cookies.remove('user');
      localStorage.removeItem("refreshToken");
      set({ user: null });
      
      // 로그아웃 이벤트 발생
      const event = new CustomEvent('auth-logout');
      window.dispatchEvent(event);
    }
  },
  
  // 로그아웃 완료 후 호출
  completeLogout: () => {
    set({ isLoggingOut: false });
  },
  
  darkMode: JSON.parse(localStorage.getItem("darkMode")) || false, // 다크모드 상태
  setDarkMode: (isDark) => {
    set({ darkMode: isDark });
    localStorage.setItem("darkMode", JSON.stringify(isDark)); // 다크모드 상태 저장
    if (isDark) {
      document.documentElement.classList.add("dark"); // 다크모드 클래스 추가
    } else {
      document.documentElement.classList.remove("dark"); // 다크모드 클래스 제거
    }
  },
}));

export default useUserStore;
