import { useState } from "react";
import { Link } from "react-router-dom";
import UserNavLinks from "./UserNavLinks";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Bell, Menu, X } from "lucide-react";
import UserDropdown from "../dropdown/UserDropdown";
import UserMobileMenu from "./UserMobileMenu";

export default function UserNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        <div className="flex items-center gap-8">
          <Link to="/user/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold shadow-sm">
              FP
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100 hidden sm-block">
              FoxPath
            </span>
          </Link>

          <UserNavLinks />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <ModeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 relative hidden sm:flex"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950"></span>
          </Button>

          <UserDropdown />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      <UserMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
}
