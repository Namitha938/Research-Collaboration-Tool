import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { signInWithGoogleFirebase } from '../../config/firebase';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFirebaseAdminGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const authData = await signInWithGoogleFirebase();
      const res = await api.post('/auth/google', {
        token: authData.idToken,
        idToken: authData.idToken,
        email: authData.email,
        name: authData.name,
        avatar: authData.avatar,
        googleId: authData.googleId,
        isAdminLogin: true,
      });

      if (res.data.success) {
        if (res.data.user.role !== 'admin') {
          toast.error("Access denied: You do not have administrator privileges.");
          return;
        }
        login(res.data.token, res.data.user);
        toast.success(res.data.message || 'Admin login successful!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error("Admin Google Auth failed:", error);
      toast.error(error.response?.data?.message || error.message || 'Admin Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/login', formData);
      if (response.data.success) {
        if (response.data.user.role !== 'admin') {
          toast.error("You do not have administrator access.");
          setIsLoading(false);
          return;
        }
        
        login(response.data.token, response.data.user);
        toast.success(response.data.message || 'Admin login successful!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to connect to the server';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const adminIllustration = (
    <div className="relative rounded-2xl overflow-hidden border border-indigo-500/30 shadow-2xl group mt-4">
      <img
        src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
        alt="System Control Center"
        className="w-full h-56 object-cover transform group-hover:scale-105 transition duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-4">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck size={16} /> Restricted Admin Governance Control
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout 
      title="Admin Control Center"
      subtitle="Authorized personnel sign in to manage institutional metrics, researchers, and system security."
      illustration={adminIllustration}
    >
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <ShieldCheck size={22} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Portal Login</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">System Administrator Credentials</p>
            </div>
          </div>
          <Link to="/login" className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 flex items-center gap-1">
            <ArrowLeft size={12} /> User Portal
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Admin Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-colors bg-slate-50 dark:bg-slate-950 focus:bg-white dark:bg-slate-900 text-sm"
              placeholder="admin@researchhub.edu"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-colors bg-slate-50 dark:bg-slate-950 focus:bg-white dark:bg-slate-900 pr-10 text-sm"
                placeholder="••••••••"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md font-semibold text-sm" disabled={isLoading}>
            {isLoading ? "Verifying Credentials..." : "Access Admin Portal"}
          </Button>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">or authenticate with</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <button 
            type="button"
            onClick={handleFirebaseAdminGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold text-sm shadow-sm disabled:opacity-60"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google (Admin)
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default AdminLogin;

