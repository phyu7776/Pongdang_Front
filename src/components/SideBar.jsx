// Sidebar.jsx
import { NavLink } from "react-router-dom";
import { Mail, Calendar, FileText, Folder, Users, Settings } from "lucide-react";

const menuItems = [
  { label: "강습 예약", icon: <Mail size={18} />, path: "/lesson-booking" },
  { label: "투어 신청", icon: <Calendar size={18} />, path: "/tour-application" },
  { label: "중고 매물", icon: <FileText size={18} />, path: "/used-items" },
  { label: "공구", icon: <Settings size={18} />, path: "/tools" },
  { label: "게시판", icon: <Folder size={18} />, path: "/board" },
  { label: "로그북", icon: <Users size={18} />, path: "/logbook" },
];


function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-700 p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`
            }
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
