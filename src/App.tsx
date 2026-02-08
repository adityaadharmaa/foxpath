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
import UserProgram from "./pages/user/program/UserProgram";
import UserApplication from "./pages/user/applications/UserApplication";
import ApplicationDetail from "./pages/user/applications/ApplicationDetail";
import FindPrograms from "./pages/user/program/FindProgram";
import ProgramDetail from "./pages/user/program/ProgramDetail";
import Settings from "./pages/user/settings/Settings";
import NotificationPage from "./pages/notification/NotificationPage";

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
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
            <Route path="/admin/applicants" element={<UserManagementPage />} />
            <Route path="/admin/roles" element={<RoleManagementPage />} />
            <Route path="/admin/programs" element={<ProgramManagementPage />} />
            <Route path="/admin/notifications" element={<NotificationPage />} />
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
            <Route path="/user/programs" element={<FindPrograms />} />
            <Route path="/user/programs/:id" element={<ProgramDetail />} />
            <Route path="/user/applications" element={<UserApplication />} />
            <Route path="/user/settings" element={<Settings />} />
            <Route path="/user/notifications" element={<NotificationPage />} />
            <Route
              path="/user/applications/:id"
              element={<ApplicationDetail />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
