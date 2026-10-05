import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";

import Landing from "./pages/Landing";
import About from "./pages/About";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Dashboard from "./pages/Dashboard";

import ProjectsInfo from "./pages/product/ProjectsInfo";
import CollaborationInfo from "./pages/product/CollaborationInfo";
import ResourcesInfo from "./pages/product/ResourcesInfo";
import Contact from "./pages/Contact";
import Documentation from "./pages/Documentation";
import HelpCenter from "./pages/HelpCenter";
import ResearchGuide from "./pages/ResearchGuide";

import Projects from "./pages/Projects";

import ProjectCreate from "./pages/projects/ProjectCreate";
import ProjectDetail from "./pages/projects/ProjectDetail";
import ManageProject from "./pages/projects/ManageProject";
import InvitationPage from "./pages/projects/InvitationPage";

import Tasks from "./pages/Tasks";
import Documents from "./pages/Documents";
import Resources from "./pages/Resources";
import ResearchPapers from "./pages/ResearchPapers";
import Team from "./pages/Team";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

import DashboardLayout from "./components/DashboardLayout";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ProjectManagement from "./pages/admin/ProjectManagement";
import AuditLog from "./pages/admin/AuditLog";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/product/projects" element={<ProjectsInfo />} />
            <Route path="/product/collaboration" element={<CollaborationInfo />} />
            <Route path="/product/resources" element={<ResourcesInfo />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/research-guide" element={<ResearchGuide />} />

            {/* Invitation Route */}
            <Route
              path="/invitations/:token"
              element={<InvitationPage />}
            />

            {/* Protected App Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/projects/:id/manage" element={<ManageProject />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/papers" element={<ResearchPapers />} />
              <Route path="/team" element={<Team />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin/login"
              element={<AdminLogin />}
            />

            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <AdminProtectedRoute>
                  <UserManagement />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/projects"
              element={
                <AdminProtectedRoute>
                  <ProjectManagement />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/audit-log"
              element={
                <AdminProtectedRoute>
                  <AuditLog />
                </AdminProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
