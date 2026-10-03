import React, { useState } from 'react';
import { Target, Calendar, User, Edit2, Trash2, Clock, CheckCircle2, PlayCircle, MoreVertical } from 'lucide-react';
import { updateMilestoneStatus, assignMilestone } from '../../api/milestoneService';
import toast from 'react-hot-toast';

const MilestoneCard = ({ milestone, project, currentUserRole, currentUserId, isOwner, onEdit, onDelete, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Check permissions
  const canEdit = isOwner || (currentUserRole === 'researcher' && (milestone.createdBy._id === currentUserId || milestone.assignedTo?._id === currentUserId));
  const canDelete = isOwner || (currentUserRole === 'researcher' && milestone.createdBy._id === currentUserId);
  const canUpdateStatus = canEdit;
  const canAssign = isOwner || (currentUserRole === 'researcher' && canEdit);

  const isOverdue = milestone.dueDate && new Date(milestone.dueDate) < new Date() && milestone.status !== 'completed';

  const handleStatusChange = async (e) => {
    try {
      setIsUpdating(true);
      const newStatus = e.target.value;
      let newProgress = milestone.progress;
      if (newStatus === 'completed') newProgress = 100;
      if (newStatus === 'not_started') newProgress = 0;
      
      await updateMilestoneStatus(milestone._id, { status: newStatus, progress: newProgress });
      toast.success('Status updated');
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssign = async (e) => {
    try {
      setIsUpdating(true);
      const userId = e.target.value;
      await assignMilestone(milestone._id, { assignedTo: userId === 'unassigned' ? null : userId });
      toast.success('Assignment updated');
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign milestone');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusConfig = () => {
    switch (milestone.status) {
      case 'completed': return { icon: <CheckCircle2 size={16} />, color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400', label: 'Completed' };
      case 'in_progress': return { icon: <PlayCircle size={16} />, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400', label: 'In Progress' };
      default: return { icon: <Clock size={16} />, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400', label: 'Not Started' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`relative flex flex-col rounded-xl border bg-white p-5 shadow-sm transition-all dark:bg-slate-900 ${
      isOverdue ? 'border-red-200 dark:border-red-900/50' : 'border-slate-200 dark:border-slate-800'
    }`}>
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${statusConfig.color}`}>
            <Target size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1" title={milestone.title}>
              {milestone.title}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
              {isOverdue && (
                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  Overdue
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions Dropdown */}
        {(canEdit || canDelete) && (
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <MoreVertical size={16} />
            </button>
            
            {showOptions && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)} />
                <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  {canEdit && (
                    <button
                      onClick={() => { setShowOptions(false); onEdit(); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => { setShowOptions(false); onDelete(); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {milestone.description && (
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {milestone.description}
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-4 mt-auto">
        <div className="mb-1.5 flex justify-between text-xs font-medium">
          <span className="text-slate-700 dark:text-slate-300">Progress</span>
          <span className="text-slate-900 dark:text-white">{milestone.progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              milestone.status === 'completed' ? 'bg-green-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${milestone.progress}%` }}
          />
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        
        {/* Assignment */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <User size={12} className="text-slate-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase text-slate-500">Assigned To</p>
            {canAssign ? (
              <select
                value={milestone.assignedTo?._id || 'unassigned'}
                onChange={handleAssign}
                disabled={isUpdating}
                className="w-full truncate bg-transparent text-xs font-medium text-slate-900 focus:outline-none dark:text-white"
              >
                <option value="unassigned" className="dark:bg-slate-900">Unassigned</option>
                {project.members.map(m => (
                  <option key={m.user._id} value={m.user._id} className="dark:bg-slate-900">
                    {m.user.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="truncate text-xs font-medium text-slate-900 dark:text-white">
                {milestone.assignedTo?.name || 'Unassigned'}
              </p>
            )}
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <Calendar size={12} className="text-slate-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase text-slate-500">Due Date</p>
            <p className="truncate text-xs font-medium text-slate-900 dark:text-white">
              {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'No date'}
            </p>
          </div>
        </div>
        
        {/* Quick Status Update for Assignee */}
        {canUpdateStatus && milestone.status !== 'completed' && (
           <div className="col-span-2 mt-2">
             <select
               value={milestone.status}
               onChange={handleStatusChange}
               disabled={isUpdating}
               className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
             >
               <option value="not_started">Status: Not Started</option>
               <option value="in_progress">Status: In Progress</option>
               <option value="completed">Mark as Completed</option>
             </select>
           </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneCard;
