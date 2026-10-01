import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
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

  return (
    <AuthLayout 
      title="Admin Portal"
      subtitle="Sign in to manage the ResearchHub platform."
    >
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
             <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
            <p className="text-sm text-slate-500 mt-1">Authorized personnel only</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Admin Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-colors bg-slate-50 focus:bg-white"
              placeholder="admin@researchhub.edu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-colors bg-slate-50 focus:bg-white pr-10"
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

          <Button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Access Admin Portal"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default AdminLogin;
