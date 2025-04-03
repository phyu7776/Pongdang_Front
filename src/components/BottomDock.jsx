import { NavLink } from "react-router-dom";
import {
  Home,
  MessageCircle,
  FolderKanban,
  CalendarCheck,
  Settings,
} from "lucide-react";

const dockItems = [
  { label: "홈", icon: <Home size={20} />, path: "/dashboard" },
  { label: "메신저", icon: <MessageCircle size={20} />, path: "/chat" },
  { label: "업무", icon: <FolderKanban size={20} />, path: "/tasks" },
  { label: "일정", icon: <CalendarCheck size={20} />, path: "/calendar" },
  { label: "설정", icon: <Settings size={20} />, path: "/settings" },
];

function BottomDock() {
  return (
    <div className="sticky bottom-0 w-full bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 px-6 py-3 flex justify-around shadow-inner z-50">
      {dockItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs gap-1 transition ${
              isActive
                ? "text-blue-500"
                : "text-gray-500 dark:text-gray-300 hover:text-blue-400"
            }`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}

export default BottomDock;
