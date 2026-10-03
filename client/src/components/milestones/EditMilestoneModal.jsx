import React, { useState } from 'react';
import { X } from 'lucide-react';
import { updateMilestone } from '../../api/milestoneService';
import toast from 'react-hot-toast';

const EditMilestoneModal = ({ project, milestone, currentUserRole, currentUserId, isOwner, onClose, onSuccess }) => {
  // Check if current user has assignment permission
  const canAssign = isOwner || currentUserRole === 'researcher'; // According to earlier constraints, researchers might edit if created by or assigned to them

  const [formData, setFormData] = useState({
    title: milestone.title || '',
    description: milestone.description || '',
    assignedTo: milestone.assignedTo?._id || '',
    status: milestone.status || 'not_started',
    progress: milestone.progress || 0,
    startDate: milestone.startDate ? new Date(milestone.startDate).toISOString().split('T')[0] : '',
    dueDate: milestone.dueDate ? new Date(milestone.dueDate).toISOString().split('T')[0] : ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProgressChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    if (val >= 0 && val <= 100) {
      setFormData(prev => ({ ...prev, progress: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const submitData = { ...formData };
      if (submitData.assignedTo === '') submitData.assignedTo = null; // Unassigned
      
      await updateMilestone(milestone._id, submitData);
      toast.success('Milestone updated successfully');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update milestone');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex w-full max-w-2xl flex-col max-h-[90vh] rounded-2xl bg-white shadow-xl dark:bg-slate-900 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Milestone</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          <form id="edit-milestone-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Data Collection Phase"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the goals and requirements for this phase..."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Assign To
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  disabled={!canAssign}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white disabled:opacity-60"
                >
                  <option value="">Unassigned</option>
                  {project.members.map(member => (
                    <option key={member.user._id} value={member.user._id}>
                      {member.user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex justify-between">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Progress
                </label>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{formData.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleProgressChange}
                disabled={formData.status === 'completed' || formData.status === 'not_started'}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-700 accent-indigo-600 disabled:opacity-50"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Progress is automatic for Not Started (0%) and Completed (100%).
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 p-5 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-milestone-form"
            disabled={isSubmitting}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              'Save Changes'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditMilestoneModal;
