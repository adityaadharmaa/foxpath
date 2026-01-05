import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import { authService } from "@/services/authService";

export default function AdminDashboard() {
    const navigate = useNavigate()
    const user = authService.getUser()

    const handleLogout = async () => {
        await authService.logout()

        toast.success("Berhasil keluar sistem")

        navigate("/login", { replace: true })
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          
          {/* TOMBOL LOGOUT */}
          <Button 
            onClick={handleLogout} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Selamat Datang, {user?.username || 'Admin'}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Anda telah berhasil login. Ini adalah halaman Admin Dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    )
}