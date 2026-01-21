import UserNavbar from "@/pages/user/navbar/UserNavbar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
            <UserNavbar/>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet/>
            </main>

            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} FoxPath. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}