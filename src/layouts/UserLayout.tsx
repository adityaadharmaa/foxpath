import UserNav from "@/pages/admin/nav/UserNav";
import UserFooter from "@/pages/user/footer/UserFooter";
import UserNavbar from "@/pages/user/navbar/UserNavbar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 flex flex-col">
      <UserNavbar />

      <main className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 flex-1">
        <Outlet />
      </main>

      <UserFooter />
    </div>
  );
}
