import Header from "@/pages/admin/header/Header"
import Sidebar from "@/pages/admin/sidebar/Sidebar"
import { useState } from "react"
import { Outlet } from "react-router-dom"

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>

            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 md:pl-64">
                <Header setSidebarOpen={setIsSidebarOpen}/>

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}