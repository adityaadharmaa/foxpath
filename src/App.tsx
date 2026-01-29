import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Login from "@/pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResendVerification from "./pages/auth/ResendVerification";
import Landing from "./pages/public/Landing";
import UserDashboard from "./pages/user/dashboard/Index";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import ProfilePage from "./pages/public/ProfilePage";
import UserLayout from "./layouts/UserLayout";
import UserManagementPage from "./pages/admin/management/UserManagement";
import RoleManagementPage from "./pages/admin/roles";
import ProgramManagementPage from "./pages/admin/program";
import ApplicantManagementPage from "./pages/admin/applicants";
import CriteriaManagementPage from "./pages/admin/criteria/CriteriaManagementPage";
import DashboardPage from "./pages/admin/dashboard/dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email/verify/:id/:hash" element={<VerifyEmail />} />
        <Route path="/email/resend" element={<ResendVerification />} />

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
            <Route path="/admin/applicants" element={<UserManagementPage />} />
            <Route path="/admin/roles" element={<RoleManagementPage />} />
            <Route path="/admin/programs" element={<ProgramManagementPage />} />
            <Route
              path="/admin/applications"
              element={<ApplicantManagementPage />}
            ></Route>
            <Route
              path="/admin/criteria"
              element={<CriteriaManagementPage />}
            ></Route>
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["users"]} />}>
          <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
