import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
        
        <div className="p-6 bg-primary-50 rounded-xl border border-primary-100">
          <h2 className="text-xl font-semibold text-primary-900 mb-2">Welcome, {user.name}!</h2>
          <p className="text-slate-600">Email: {user.email}</p>
          <p className="text-slate-600">Role: <span className="capitalize font-medium">{user.role}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
