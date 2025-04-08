import { create } from "zustand";
import Cookies from 'js-cookie';

const useUserStore = create((set) => ({
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,

  setUser: (userData) => {
    set({ user: userData });
    Cookies.set('user', JSON.stringify(userData), { expires: 7, secure: true, sameSite: 'Strict' }); // user 쿠키에 저장
  },

  clearUser: () => {
    Cookies.remove('token');
    Cookies.remove('user'); // ✅ user 쿠키도 삭제
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
