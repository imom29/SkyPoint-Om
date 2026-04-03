import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleGuard from "./components/common/RoleGuard";

// Pages
import HomePage from "./pages/shared/HomePage";
import ProfilePage from "./pages/shared/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import JobListPage from "./pages/candidate/JobListPage";
import JobDetailPage from "./pages/candidate/JobDetailPage";
import MyApplicationsPage from "./pages/candidate/MyApplicationsPage";
import HRDashboardPage from "./pages/hr/HRDashboardPage";
import CreateJobPage from "./pages/hr/CreateJobPage";
import EditJobPage from "./pages/hr/EditJobPage";
import JobApplicantsPage from "./pages/hr/JobApplicantsPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />

          {/* Any authenticated user */}
          <Route
            path="/profile"
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
          />

          {/* Candidate only */}
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["candidate"]}>
                  <MyApplicationsPage />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* HR only */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["hr"]}>
                  <HRDashboardPage />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/create"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["hr"]}>
                  <CreateJobPage />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:jobId/edit"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["hr"]}>
                  <EditJobPage />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:jobId/applicants"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["hr"]}>
                  <JobApplicantsPage />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
