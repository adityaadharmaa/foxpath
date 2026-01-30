import { Briefcase, FileText, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";

export const NAV_ITEMS = [
  { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "Cari Lowongan", path: "/user/programs", icon: Briefcase },
  { name: "Lamaran Saya", path: "/user/applications", icon: FileText },
];

export default function UserNavLinks() {
  return (
    <div className="hidden md:flex items-center gap-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              isActive
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
            }`
          }
        >
          <item.icon size={16} />
          {item.name}
        </NavLink>
      ))}
    </div>
  );
}
