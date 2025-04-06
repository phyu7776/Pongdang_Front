import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import BottomDock from "../components/BottomDock";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-black transition">
      {/* Header 컴포넌트 */}
      <Header />

      <div className="flex flex-1">
        {/* SideBar 컴포넌트 */}
        <SideBar />

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 overflow-y-auto">
          <Outlet /> {/* 여기에 각 페이지가 렌더링됨 */}
        </main>
      </div>

      {/* BottomDock 컴포넌트 */}
      {/* <BottomDock /> */}
    </div>
  );
}

export default Layout;
