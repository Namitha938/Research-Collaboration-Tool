import React, { useState, useEffect } from 'react';
import { Users, Mail, Trash2, Edit2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { 
  getProjectMembers, 
  getProjectInvitations, 
  removeProjectMember, 
  changeMemberRole, 
  cancelInvitation 
} from '../../api/projectService';
import InviteMemberModal from './InviteMemberModal';

export default function TeamTab({ project }) {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const userId = user?.id || user?._id;
  const isOwner = project.owner?._id?.toString() === userId?.toString() || project.owner?.toString() === userId?.toString();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [membersRes, invitesRes] = await Promise.all([
        getProjectMembers(project._id),
        isOwner ? getProjectInvitations(project._id) : Promise.resolve({ invitations: [] })
      ]);
      if (membersRes.success) setMembers(membersRes.members);
      if (invitesRes.success) setInvitations(invitesRes.invitations);
    } catch (error) {
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [project._id]);

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeProjectMember(project._id, userId);
      toast.success("Member removed");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member");
    }
  };

  const handleChangeRole = async (userId, role) => {
    try {
      await changeMemberRole(project._id, userId, role);
      toast.success("Role updated");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change role");
    }
  };

  const handleCancelInvite = async (invitationId) => {
    try {
      await cancelInvitation(project._id, invitationId);
      toast.success("Invitation cancelled");
      fetchData();
    } catch (error) {
      toast.error("Failed to cancel invitation");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading team...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Team Members</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage researchers and collaborators working on this project.</p>
          </div>
          {isOwner && (
            <button onClick={() => setShowInviteModal(true)} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 shadow-sm flex items-center gap-2">
              <Users size={16} /> Invite Member
            </button>
          )}
        </div>
        
        {members.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-3">
              <Users size={20} className="text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">No team members yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">Invite researchers and collaborators to work together on this project.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {members.map((m) => {
              const u = m.user;
              if (!u) return null;
              return (
                <li key={u._id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{u.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{m.role}</span>
                      <span className="text-xs text-slate-400">Joined {new Date(m.joinedAt).toLocaleDateString()}</span>
                    </div>
                    {isOwner && m.role !== 'owner' && (
                      <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-6">
                        <select
                          value={m.role}
                          onChange={(e) => handleChangeRole(u._id, e.target.value)}
                          className="text-sm border-slate-200 dark:border-slate-800 rounded-md py-1 px-2 text-slate-600 dark:text-slate-400 outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="researcher">Researcher</option>
                          <option value="viewer">Viewer</option>
                        </select>
                        <button onClick={() => handleRemoveMember(u._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Remove member">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {isOwner && invitations.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pending Invitations</h2>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {invitations.map((inv) => (
              <li key={inv._id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{inv.email}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">Role: {inv.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200">Pending</span>
                  <button onClick={() => handleCancelInvite(inv._id)} className="text-sm text-red-500 hover:underline font-medium">Cancel</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showInviteModal && (
        <InviteMemberModal 
          projectId={project._id} 
          onClose={() => setShowInviteModal(false)} 
          onInvited={fetchData} 
        />
      )}
    </div>
  );
}
