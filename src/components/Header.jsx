import { useEffect } from "react";
import { Moon, Sun } from "lucide-react"; // 다크모드 아이콘
import { Bell, Settings, LogOut } from "lucide-react";
import useUserStore from "../store/userStore";
import { useNavigate, Link } from "react-router-dom";
import headerLogo from "../assets/pongdang-logo.png";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/animations/shift-away.css';

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
    clearUser(); // 상태 초기화 및 로그아웃 처리
  };

  return (
    <header className="w-full flex justify-between items-center px-6 py-3 bg-white dark:bg-zinc-900 shadow">
      <Link 
        to="/dashboard" 
        className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
      >
        <img src={headerLogo} alt="퐁당 로고" className="h-8 w-auto object-contain" />
        퐁당
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 dark:text-gray-200">
          {user?.name || user?.userId}님
        </span>
        <Bell className="text-gray-500 dark:text-gray-300 cursor-pointer" />
        <Tippy 
          content={
            <div className="flex items-center space-x-1 px-2 py-1">
              <Settings className="w-4 h-4" />
              <span>개인 설정</span>
            </div>
          }
          theme="material"
          animation="shift-away"
          arrow={false}
          placement="bottom"
          delay={[0, 0]}
        >
          <button onClick={() => navigate('/user-settings')}>
            <Settings className="text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" />
          </button>
        </Tippy>

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
