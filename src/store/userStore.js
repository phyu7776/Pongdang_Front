import { create } from "zustand";

const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,

  setUser: (userData) => {
    set({ user: userData });
    localStorage.setItem("user", JSON.stringify(userData)); // user를 localStorage에 저장
  },

  clearUser: () => {
    set({ user: null });
    localStorage.removeItem("user");
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
