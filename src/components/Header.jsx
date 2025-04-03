import { useEffect } from "react";
import { Moon, Sun } from "lucide-react"; // 다크모드 아이콘
import { Bell, Settings, LogOut } from "lucide-react";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user ,clearUser } = useUserStore();
  const { darkMode, setDarkMode } = useUserStore();
  const navigate = useNavigate();

  // 초기 렌더링 시 다크모드 상태 반영
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);


  const handleLogout = () => {
    clearUser(); // 상태 초기화
    localStorage.removeItem("token"); // 토큰 제거
    navigate("/login"); // 로그인으로 이동
  };

  return (
    <header className="w-full flex justify-between items-center px-6 py-3 bg-white dark:bg-zinc-900 shadow">
      <div className="text-xl font-bold text-gray-800 dark:text-white">
        퐁당 메인
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 dark:text-gray-200">
          {user?.name || user?.userId}님
        </span>
        <Bell className="text-gray-500 dark:text-gray-300 cursor-pointer" />
        <Settings className="text-gray-500 dark:text-gray-300 cursor-pointer" />

         {/* 다크모드 토글 버튼 */}
         <button className="text-gray-500 dark:text-gray-300 cursor-pointer"
          onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>


        <button onClick={handleLogout} className="text-red-500 cursor-pointer">
          <LogOut />
        </button>
      
      </div>
    </header>
  );
}

export default Header;
