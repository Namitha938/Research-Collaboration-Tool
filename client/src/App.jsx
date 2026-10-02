import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";

import Projects from "./pages/Projects";
import ProjectCreate from "./pages/projects/ProjectCreate";
import ProjectDetail from "./pages/projects/ProjectDetail";
import InvitationPage from "./pages/projects/InvitationPage";

import Tasks from "./pages/Tasks";
import Documents from "./pages/Documents";
import Team from "./pages/Team";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

import DashboardLayout from "./components/DashboardLayout";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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

            <Route
              path="/projects/new"
              element={<ProjectCreate />}
            />

            <Route
              path="/projects/:id"
              element={<ProjectDetail />}
            />

            <Route path="/tasks" element={<Tasks />} />

            <Route path="/documents" element={<Documents />} />

            <Route
              path="/resources"
              element={<Documents defaultCategory="dataset" />}
            />

            <Route
              path="/papers"
              element={<Documents defaultCategory="paper" />}
            />

            <Route path="/team" element={<Team />} />

            <Route path="/chat" element={<Chat />} />

            <Route
              path="/notifications"
              element={<Notifications />}
            />

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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}