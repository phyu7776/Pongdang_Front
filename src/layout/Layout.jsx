import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import BottomDock from "../components/BottomDock";
import { useEffect } from "react";
import { useMenuStore } from "../store/menuStore";
import Cookies from 'js-cookie';
import mainLogo from "../assets/pongdang-logo-main.png";

function Layout() {
  const { fetchMenus } = useMenuStore();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchMenus();
    }
  }, [fetchMenus]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-zinc-900 transition">
      {/* Header 컴포넌트 */}
      <Header />

      <div className="flex flex-1">
        {/* SideBar 컴포넌트 */}
        <SideBar />

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 overflow-y-auto relative bg-white dark:bg-zinc-800 shadow-lg border-l border-gray-200 dark:border-zinc-700">
          {/* 배경 로고 */}
          <div 
            className="fixed pointer-events-none z-20"
            style={{
              top: '64px', // 헤더 높이만큼 아래로
              right: '0',
              bottom: '0',
              width: 'calc(100% - 16rem)', // sidebar 너비만큼 제외
              backgroundImage: `url(${mainLogo})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '500px',
              opacity: '0.15'
            }}
          />
          
          {/* 실제 콘텐츠 */}
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* BottomDock 컴포넌트 */}
      {/* <BottomDock /> */}
    </div>
  );
}

export default Layout;
