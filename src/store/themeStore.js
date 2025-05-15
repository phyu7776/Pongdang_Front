import { create } from "zustand";

/**
 * 테마 관련 상태를 관리하는 스토어
 */
const useThemeStore = create((set) => ({
  darkMode: JSON.parse(localStorage.getItem("darkMode")) || false,
  
  // 다크모드 설정
  setDarkMode: (isDark) => {
    set({ darkMode: isDark });
    localStorage.setItem("darkMode", JSON.stringify(isDark));
    
    // DOM에 다크모드 클래스 적용
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },
  
  // 다크모드 토글
  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
      
      // DOM에 다크모드 클래스 적용
      if (newDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      return { darkMode: newDarkMode };
    });
  },
  
  // 초기화 함수 - 앱 시작 시 호출
  initTheme: () => {
    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
    set({ darkMode: savedDarkMode });
    
    // 시스템 환경 설정 기반 다크모드 (localStorage에 저장된 값이 없을 경우)
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (localStorage.getItem("darkMode") === null && prefersDark) {
      set({ darkMode: true });
      localStorage.setItem("darkMode", JSON.stringify(true));
    }
    
    // DOM에 다크모드 클래스 적용
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}));

export default useThemeStore; 