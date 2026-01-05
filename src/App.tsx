import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import Login from "@/pages/auth/Login";
import AdminDashboard from "./pages/admin/dashboard";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResendVerification from "./pages/auth/ResendVerification";

export default function App(){
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors/>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword />}/>
        <Route path="/email/verify/:id/:hash" element={<VerifyEmail />}/>
        <Route path="/email/resend" element={<ResendVerification />}/>

        <Route path="/" element={<Navigate to="/login" replace/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}