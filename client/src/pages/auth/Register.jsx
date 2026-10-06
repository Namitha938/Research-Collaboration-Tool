import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { signInWithGoogleFirebase } from '../../config/firebase';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect');
  const emailParam = searchParams.get('email');

  const [formData, setFormData] = useState({ 
    name: '', 
    email: emailParam || '', 
    password: '', 
    role: 'researcher' 
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Firebase Google Sign-Up / Sign-In
  const handleGoogleSignUp = async () => {
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
      });

      if (res.data.success) {
        login(res.data.token, res.data.user);
        toast.success(res.data.message || 'Account ready! Signed in with Google');
        if (redirect && redirect.startsWith('/')) {
          navigate(redirect);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.warn('Firebase popup sign-in fallback check:', error);
      if (window.google?.accounts?.id && googleClientId) {
        window.google.accounts.id.prompt();
      } else {
        toast.error(error.response?.data?.message || error.message || 'Google sign-up failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/google', {
        credential: credentialResponse.credential,
      });

      if (res.data.success) {
        login(res.data.token, res.data.user);
        toast.success(res.data.message || 'Signed in with Google!');
        if (redirect && redirect.startsWith('/')) {
          navigate(redirect);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleSuccess,
        });
      } catch (err) {
        console.error('Google Sign In init failed:', err);
      }
    }
  }, [googleClientId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/register', formData);
      if (response.data.success) {
        login(response.data.token, response.data.user);
        toast.success(response.data.message || 'Registration successful!');
        if (redirect && redirect.startsWith('/')) {
          navigate(redirect);
        } else {
          navigate('/dashboard');
        }
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
      title="Join the network."
      subtitle="Connect with top researchers, manage complex projects, and share findings."
    >
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-colors duration-300">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create an Account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Start collaborating on ground-breaking research today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-500 transition-colors bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="Dr. Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Academic Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-500 transition-colors bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="jane.doe@university.edu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Primary Role</label>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-500 transition-colors bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="researcher">Researcher</option>
              <option value="student">Student</option>
              <option value="professor">Professor</option>
              <option value="assistant">Research Assistant</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-500 transition-colors bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white pr-10"
                placeholder="••••••••"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:bg-slate-800" />
              <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                I agree to the <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>

          <Button type="submit" className="w-full py-3" disabled={isLoading}>
            {isLoading ? "Creating account..." : (
              <span className="flex items-center justify-center gap-2">
                Create Account <UserPlus size={18} />
              </span>
            )}
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 dark:text-slate-500 text-sm">or</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Unified Firebase Google Sign-up */}
          <button 
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 transition-all font-medium text-sm shadow-sm disabled:opacity-60"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
