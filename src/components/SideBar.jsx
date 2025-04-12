import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMenuStore } from '../store/menuStore';
import axiosUtil from '../utils/axiosUtil';
import { ChevronDown, ChevronRight } from 'lucide-react';

function Sidebar() {
  const { menus } = useMenuStore();
  const [subMenus, setSubMenus] = useState({});
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();

  const handleMenuClick = async (menu, isArrowClick = false) => {
    // 화살표 클릭이 아니고 URL이 있는 경우 해당 페이지로 이동
    if (!isArrowClick && menu.url) {
      navigate(menu.url);
    }

    // 이미 서브메뉴 데이터가 있다면 토글만
    if (subMenus[menu.uid]) {
      setExpandedMenus(prev => ({
        ...prev,
        [menu.uid]: !prev[menu.uid]
      }));
      return;
    }

    try {
      const response = await axiosUtil.get(`/menu/get/${menu.uid}`);
      setSubMenus(prev => ({
        ...prev,
        [menu.uid]: response.data
      }));
      setExpandedMenus(prev => ({
        ...prev,
        [menu.uid]: true
      }));
    } catch (error) {
      console.error('메뉴 데이터 가져오기 실패:', error);
    }
  };

  const renderSubMenus = (parentUid) => {
    const menuSubItems = subMenus[parentUid];
    if (!menuSubItems || menuSubItems.length === 0 || !expandedMenus[parentUid]) return null;

    return (
      <ul className="ml-8 mt-2 space-y-2 border-l-2 border-gray-200 dark:border-zinc-700">
        {menuSubItems.map((subMenu) => (
          <li key={subMenu.uid} className="text-black dark:text-white">
            {subMenu.url ? (
              <Link 
                to={subMenu.url}
                className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-sm"
              >
                {subMenu.name}
              </Link>
            ) : (
              <span className="block p-2 rounded text-gray-400 cursor-not-allowed text-sm">
                {subMenu.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const renderMenuItem = (menu) => {
    const isClickable = !!menu?.url;
    const isExpanded = expandedMenus[menu.uid];

    return (
      <li key={menu.uid} className="text-black dark:text-white">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleMenuClick(menu, true)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded"
          >
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
          {isClickable ? (
            <div 
              onClick={() => handleMenuClick(menu)}
              className="flex-1 block p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer"
            >
              {menu.name}
            </div>
          ) : (
            <span 
              className="flex-1 block p-2 rounded text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700"
              onClick={() => handleMenuClick(menu)}
            >
              {menu.name}
            </span>
          )}
        </div>
        {renderSubMenus(menu.uid)}
      </li>
    );
  };

  return (
    <aside className="sidebar p-4 bg-gray-100 dark:bg-zinc-800 min-h-screen">
      <ul className="space-y-2">
        {menus?.map(renderMenuItem)}
      </ul>
    </aside>
  );
}

export default Sidebar;
