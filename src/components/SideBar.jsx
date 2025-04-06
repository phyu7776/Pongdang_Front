import React from 'react';
import { Link } from 'react-router-dom';
import { useMenuStore } from '../store/menuStore';

function Sidebar() {
  const { menus } = useMenuStore();

  return (
    <aside className="sidebar p-4 bg-gray-100 dark:bg-zinc-800 min-h-screen">
      <ul className="space-y-2">
        {menus.map((menu) => {
          // 만약 url 이 null 이면 클릭 안 되게 처리 (예외처리!)
          const isClickable = !!menu.url;

          return (
            <li key={menu.uid} className="text-black dark:text-white">
              {isClickable ? (
                <Link to={menu.url} className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700">
                  {menu.name}
                </Link>
              ) : (
                <span className="block p-2 rounded text-gray-400 cursor-not-allowed">
                  {menu.name}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
