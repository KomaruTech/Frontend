import { NavLink } from "react-router-dom";
import { Home, BarChart, PieChart } from "lucide-react";

const menuItems = [
  { name: "Главная", icon: <Home size={16} />, path: "/" },
  { name: "Мероприятия", icon: <BarChart size={16} />, path: "/events" },
  { name: "Статистика", icon: <PieChart size={16} />, path: "/stats" },
];

function SidebarMenu() {
  return (
    <div className="bg-[#004e9e] text-white rounded-2xl w-[140px] h-[150px] py-4 px-3 space-y-7 shadow-md">
      {menuItems.map((item) => (
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
