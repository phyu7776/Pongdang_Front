import { create } from "zustand";
import Cookies from 'js-cookie';
import axiosUtil from '../utils/axiosUtil'

const useUserStore = create((set) => ({
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,

  setUser: (userData) => {
    set({ user: userData });
    Cookies.set('user', JSON.stringify(userData), { expires: 7, secure: true, sameSite: 'Strict' }); // user 쿠키에 저장
  },

  clearUser: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = Cookies.get("token");
      const user = JSON.parse(Cookies.get("user")); // ✅ 문자열 → 객체
      
      const userInfo = {
        userId: user.userId,
        token : {
          "refreshToken" : refreshToken,
          "accessToken" : accessToken
        }
      };

      await axiosUtil.post("/users/logout", userInfo);

    } catch (error) {
      console.error("서버 로그아웃 실패:", error); // 실패하더라도 클라이언트는 초기화할 거니까 걱정하지 마!
    }

    Cookies.remove('token');
    Cookies.remove('user'); // ✅ user 쿠키도 삭제
    localStorage.removeItem("refreshToken");
    set({ user: null });
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
