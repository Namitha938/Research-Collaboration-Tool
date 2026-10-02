import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <ShieldCheck size={22} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Portal Login</h1>
              <p className="text-xs text-slate-500">System Administrator Credentials</p>
            </div>
          </div>
          <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft size={12} /> User Portal
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Admin Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-colors bg-slate-50 focus:bg-white text-sm"
              placeholder="admin@researchhub.edu"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-colors bg-slate-50 focus:bg-white pr-10 text-sm"
                placeholder="••••••••"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md font-semibold text-sm" disabled={isLoading}>
            {isLoading ? "Verifying Credentials..." : "Access Admin Portal"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default AdminLogin;

