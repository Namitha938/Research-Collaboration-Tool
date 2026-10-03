import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Filter, AlertTriangle } from 'lucide-react';
import { getProjectMilestones, deleteMilestone } from '../../api/milestoneService';
import MilestoneCard from './MilestoneCard';
import AddMilestoneModal from './AddMilestoneModal';
import EditMilestoneModal from './EditMilestoneModal';
import toast from 'react-hot-toast';

const MilestonesTab = ({ project, currentUserRole, currentUserId }) => {
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assignedFilter, setAssignedFilter] = useState('All');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [deletingMilestoneId, setDeletingMilestoneId] = useState(null);

  const isOwner = project.owner?._id === currentUserId || project.owner === currentUserId;
  const canAdd = isOwner || currentUserRole === 'researcher';

  useEffect(() => {
    fetchMilestones();
  }, [project._id]);

  const fetchMilestones = async () => {
    try {
      setIsLoading(true);
      const res = await getProjectMilestones(project._id);
      if (res.milestones) {
        setMilestones(res.milestones);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch milestones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMilestone(deletingMilestoneId);
      toast.success('Milestone deleted successfully');
      setDeletingMilestoneId(null);
      fetchMilestones();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete milestone');
      setDeletingMilestoneId(null);
    }
  };

  // Extract unique assignees for filter
  const assignees = useMemo(() => {
    const map = new Map();
    milestones.forEach(m => {
      if (m.assignedTo) {
        map.set(m.assignedTo._id, m.assignedTo);
      }
    });
    return Array.from(map.values());
  }, [milestones]);

  // Filter & Search Logic
  const filteredMilestones = useMemo(() => {
    return milestones.filter(m => {
      // Search
      const searchLower = search.toLowerCase();
      const matchesSearch = !search || 
        m.title.toLowerCase().includes(searchLower) || 
        (m.description && m.description.toLowerCase().includes(searchLower));
        
      // Status
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
      
      // Assigned
      const matchesAssigned = assignedFilter === 'All' || 
        (assignedFilter === 'Unassigned' && !m.assignedTo) ||
        (m.assignedTo && m.assignedTo._id === assignedFilter);

      return matchesSearch && matchesStatus && matchesAssigned;
    });
  }, [milestones, search, statusFilter, assignedFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Milestones</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track major phases, deadlines, and progress for this research project.
          </p>
        </div>
        {canAdd && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            <span>Add Milestone</span>
          </button>
        )}
      </div>

      {/* Filters and Search */}
      {milestones.length > 0 && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search milestones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="text-slate-400" size={16} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filters:</span>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="All">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="All">All Members</option>
              <option value="Unassigned">Unassigned</option>
              {assignees.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        </div>
      ) : milestones.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm dark:bg-slate-800">
            <Plus className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">No milestones yet</h3>
          <p className="mb-6 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Create milestones to break your research project into clear phases and deadlines.
          </p>
          {canAdd && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              + Add Milestone
            </button>
          )}
        </div>
      ) : filteredMilestones.length === 0 ? (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400">
          No milestones match your search or filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {filteredMilestones.map(milestone => (
            <MilestoneCard
              key={milestone._id}
              milestone={milestone}
              project={project}
              currentUserRole={currentUserRole}
              currentUserId={currentUserId}
              isOwner={isOwner}
              onEdit={() => setEditingMilestone(milestone)}
              onDelete={() => setDeletingMilestoneId(milestone._id)}
              onUpdate={fetchMilestones}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMilestoneId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Delete Milestone?</h3>
            <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this milestone? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingMilestoneId(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isAddModalOpen && (
        <AddMilestoneModal
          project={project}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchMilestones();
          }}
        />
      )}

      {editingMilestone && (
        <EditMilestoneModal
          project={project}
          milestone={editingMilestone}
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
          isOwner={isOwner}
          onClose={() => setEditingMilestone(null)}
          onSuccess={() => {
            setEditingMilestone(null);
            fetchMilestones();
          }}
        />
      )}
    </div>
  );
};

export default MilestonesTab;
