import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getInvitationByToken, acceptInvitation } from '../../api/projectService';
import { useAuth } from '../../context/AuthContext';
import { Mail, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InvitationPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const res = await getInvitationByToken(token);
        if (res.success) {
          setInvitation(res.invitation);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Invitation not found or invalid");
      } finally {
        setLoading(false);
      }
    };
    fetchInvite();
  }, [token]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const res = await acceptInvitation(token);
      toast.success(res.message);
      navigate(`/projects/${res.projectId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept invitation");
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Invitation</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <Link to="/" className="inline-block rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 text-center border-b border-slate-100">
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">You're Invited!</h1>
          <p className="text-slate-500">
            <span className="font-semibold text-slate-700">{invitation.invitedBy?.name}</span> has invited you to collaborate on <span className="font-semibold text-slate-700">{invitation.project?.title}</span>.
          </p>
        </div>
        
        <div className="p-8 bg-slate-50/50">
          <div className="space-y-4 mb-8 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500">Sent to</span>
              <span className="font-medium text-slate-900">{invitation.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500">Role</span>
              <span className="font-medium text-slate-900 capitalize">{invitation.role}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500">Status</span>
              <span className="font-medium text-slate-900 capitalize">{invitation.status}</span>
            </div>
          </div>

          {!user ? (
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-4">You need to sign in to accept this invitation.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)}
                  className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  Sign In <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => navigate(`/register?email=${encodeURIComponent(invitation.email)}&redirect=${encodeURIComponent(location.pathname)}`)}
                  className="w-full rounded-lg bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Create Account
                </button>
              </div>
            </div>
          ) : user.email !== invitation.email ? (
            <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-800 text-sm">
              <p className="font-semibold mb-1">Email Mismatch</p>
              <p>You are signed in as <strong>{user.email}</strong>, but this invitation was sent to <strong>{invitation.email}</strong>.</p>
              <button onClick={() => navigate('/login')} className="mt-3 text-orange-700 underline font-medium hover:text-orange-900">
                Sign in with a different account
              </button>
            </div>
          ) : invitation.status !== 'pending' ? (
            <div className="text-center p-4 bg-slate-100 rounded-xl text-slate-600 text-sm">
              This invitation is already {invitation.status}.
            </div>
          ) : (
            <button 
              onClick={handleAccept}
              disabled={accepting}
              className="w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-bold text-white hover:bg-primary-700 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {accepting ? "Accepting..." : <><CheckCircle size={18} /> Accept Invitation</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
