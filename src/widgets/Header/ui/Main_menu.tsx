import { NavLink } from "react-router-dom";
import { Home, BarChart, MessageCircle, FileText, Users } from "lucide-react";
import { useSelector } from 'react-redux';
import type { RootState } from '@app/store';

function SidebarMenu() {
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const items = [
    { name: "Главная", icon: <Home size={16} />, path: "/" },
    { name: "Мероприятия", icon: <BarChart size={16} />, path: "/events" },
    { name: "Отзывы", icon: <MessageCircle size={16} />, path: "/feedback" },
    { name: "Команды", icon: <Users size={16} />, path: "/teams" },
  ];

  if (userRole === "administrator" || userRole === "manager") {
    items.push({ name: "Заявки", icon: <FileText size={16} />, path: "/applications" });
  }

  return (
      <div className="bg-[#004e9e] text-white rounded-2xl w-[140px] py-4 px-3 space-y-7 shadow-md">
        {items.map((item) => (
            <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                    `flex items-center space-x-2 text-sm font-medium transition-colors duration-200
            ${isActive ? "text-white" : "text-white/70 hover:text-white"}`
                }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
        ))}
      </div>
  );
}


export default SidebarMenu;
