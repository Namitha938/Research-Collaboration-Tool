import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectById } from '../../api/projectService';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Settings, AlertTriangle, Calendar, Save, Archive } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ManageProject() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    researchArea: '',
    description: '',
    startDate: '',
    deadline: '',
    status: 'active'
  });

  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectById(id);
        if (response.success) {
          const p = response.project;
          
          // Check if owner
          const userId = user?.id || user?._id;
          const ownerId = p.owner?._id || p.owner;
          if (ownerId?.toString() !== userId?.toString()) {
            toast.error("You don't have permission to manage this project.");
            navigate(`/projects/${id}`);
            return;
          }
          
          setProject(p);
          setFormData({
            title: p.title || '',
            researchArea: p.researchArea || '',
            description: p.description || '',
            startDate: p.startDate ? p.startDate.split('T')[0] : '',
            deadline: p.deadline ? p.deadline.split('T')[0] : '',
            status: p.status || 'active'
          });
        }
      } catch (error) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          toast.error("You don't have permission to manage this project.");
          navigate('/projects');
        } else {
          toast.error("Project not found or unable to load");
          navigate('/projects');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id, user?.id, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.researchArea || !formData.description) {
      return toast.error("Please fill in all required fields.");
    }
    
    if (formData.startDate && formData.deadline) {
      if (new Date(formData.deadline) < new Date(formData.startDate)) {
        return toast.error("Deadline cannot be earlier than start date.");
      }
    }

    setIsSaving(true);
    try {
      const res = await api.put(`/projects/${id}`, formData);
      if (res.data.success) {
        toast.success("Project settings saved successfully.");
        setProject(res.data.project);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update the project. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      const res = await api.put(`/projects/${id}`, { status: 'archived' });
      if (res.data.success) {
        toast.success("Project archived successfully.");
        setProject(res.data.project);
        setFormData({ ...formData, status: 'archived' });
        setShowArchiveModal(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to archive the project.");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmation !== project.title) return;
    
    setIsDeleting(true);
    try {
      const res = await api.delete(`/projects/${id}`);
      if (res.data.success) {
        toast.success("Project deleted successfully.");
        navigate('/projects', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to delete the project.");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 w-1/4 rounded"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 w-full rounded-xl"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="mx-auto max-w-4xl animate-fade-in space-y-6 pb-12">
      <Link to={`/projects/${id}`} className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors inline-flex">
        <ArrowLeft size={16} /> Back to Project
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Settings className="text-primary-600 dark:text-primary-500" size={28} />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Manage Project</h1>
      </div>

      {project.status === 'archived' && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-400">This project is archived</h3>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
              Archived projects are read-only and hidden from active lists. You can still view its data.
            </p>
          </div>
        </div>
      )}

      {/* General Information Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">General Information</h2>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Project Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-primary-500 transition-colors dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Research Area</label>
            <input
              type="text"
              name="researchArea"
              value={formData.researchArea}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-primary-500 transition-colors dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-primary-500 transition-colors dark:text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-primary-500 transition-colors dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Target Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-primary-500 transition-colors dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link
              to={`/projects/${id}`}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-70 transition-colors"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Status & Progress Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Status Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Project Status</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Update the current phase of your research project.
            </p>
            
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current Status</label>
            <div className="flex items-center gap-3">
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-primary-500 transition-colors dark:text-white capitalize"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived" disabled>Archived</option>
              </select>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || formData.status === project.status}
                className="px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Project Progress</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{project.progress || 0}%</span>
            </div>
            
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-4 overflow-hidden">
              <div 
                className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${project.progress || 0}%` }}
              ></div>
            </div>
            
            {project.progress === undefined || project.progress === null ? (
              <>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">No tasks yet</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Project progress will appear once tasks are created.</p>
              </>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Progress is calculated automatically from completed project tasks.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/30 shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-red-100 dark:border-red-900/20 bg-red-50/50 dark:bg-red-900/10">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-500">Danger Zone</h2>
        </div>
        
        {/* Archive Project Section */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-100 dark:border-red-900/10">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Archive Project</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Archive this project when research work is no longer active. All project data will remain available.
            </p>
          </div>
          <button
            onClick={() => setShowArchiveModal(true)}
            disabled={project.status === 'archived'}
            className="shrink-0 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 transition-colors"
          >
            Archive Project
          </button>
        </div>

        {/* Delete Project Section */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Delete Project</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Permanently delete this research project and its associated project data. <span className="font-semibold text-red-600 dark:text-red-400">This action cannot be undone.</span>
            </p>
          </div>
          <button
            onClick={() => {
              setDeleteConfirmation('');
              setShowDeleteModal(true);
            }}
            className="shrink-0 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Delete Project
          </button>
        </div>
      </div>

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-500">
              <Archive size={24} />
              <h2 className="text-xl font-bold">Archive Project?</h2>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              This project will be marked as archived. Its tasks, documents, resources, papers, references and activity history will remain, but it will be hidden from active project lists.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowArchiveModal(false)}
                disabled={isArchiving}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleArchive}
                disabled={isArchiving}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-70 transition-colors"
              >
                {isArchiving ? "Archiving..." : "Archive Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-500">
              <AlertTriangle size={24} />
              <h2 className="text-xl font-bold">Delete Research Project?</h2>
            </div>
            
            <div className="text-slate-600 dark:text-slate-400 text-sm mb-4 space-y-3">
              <p>Are you sure you want to permanently delete <strong className="text-slate-900 dark:text-white">"{project.title}"</strong>?</p>
              <p className="font-semibold text-red-600 dark:text-red-400">This action cannot be undone.</p>
              <p>The following project data will also be deleted:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-slate-500">
                <li>Project information</li>
                <li>Tasks</li>
                <li>Documents</li>
                <li>Resources</li>
                <li>Research Papers</li>
                <li>References</li>
                <li>Milestones</li>
                <li>Activity history</li>
                <li>Chat messages</li>
                <li>Project notifications</li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Type the project name to confirm:
              </label>
              <div className="p-2 mb-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-center select-all text-sm font-mono text-slate-800 dark:text-slate-200">
                {project.title}
              </div>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                disabled={isDeleting}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-red-500 transition-colors dark:text-white"
                placeholder={project.title}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting || deleteConfirmation !== project.title}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? "Deleting Project..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
