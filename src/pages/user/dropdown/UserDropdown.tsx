import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import { FileText, LogOut, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDropdown() {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getUser());
  const [imgError, setImgError] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const profilePicPath =
    user?.profile_picture || user?.profile?.profile_picture;

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    authService.logout();
    navigate("login");
  };

  const getAvatarUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    const storageBase =
      import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage";

    return `${storageBase}/${cleanPath}`;
  };

  useEffect(() => {
    setImgError(false);
  }, []);

  useEffect(() => {
    const syncUser = () => {
      setUser(authService.getUser);
    };

    window.addEventListener("user-updated", syncUser);

    return () => {
      window.removeEventListener("user-updated", syncUser);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-slate-200 dark:hover:ring-slate-700 transition-all p-0 overflow-hidden"
      >
        {profilePicPath && !imgError ? (
          <img
            src={getAvatarUrl(profilePicPath)}
            alt={user.username}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-sm">
            {user.username?.charAt(0).toUpperCase() || "US"}
          </div>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-950 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50 animate-in fade-in slide-in-from-top-2 duraation-200">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>

          <button
            onClick={() => {
              navigate("/user/profile");
              setIsOpen(false);
            }}
            className="w-full text-slate px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 transition-colors"
          >
            <User size={16} />
            Profil Saya
          </button>

          <button
            onClick={() => {
              navigate("/user/applications");
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 transition-colors"
          >
            <FileText size={16} />
            Lamaran Saya
          </button>
          <button
            onClick={() => {
              navigate("/user/settings");
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 transition-colors"
          >
            <Settings size={16} />
            Settings
          </button>

          <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>

          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors font-medium"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
