import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./UserNavLinks"; // Import list menu yang sama

interface UserMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserMobileMenu({
  isOpen,
  onClose,
}: UserMobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 absolute w-full shadow-lg animate-in slide-in-from-top-2 left-0 top-16 z-30">
      <div className="p-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                isActive
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
