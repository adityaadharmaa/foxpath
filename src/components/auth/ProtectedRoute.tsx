import { authService } from "@/services/authService"
import { Navigate, Outlet } from "react-router-dom"

interface ProtectedRouteProps {
    allowedRoles: string[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const user = authService.getUser()
    const isAuth = authService.isAuthenticated()

    if(!isAuth || !user) {
        return <Navigate to="/login" replace />
    }

    if(!allowedRoles.includes(user?.role)){
        if(user?.role === "admin") {
            return <Navigate to="/admin/dashboard" replace />
        }
        return <Navigate to="/" replace />
    }

    return <Outlet/>
}