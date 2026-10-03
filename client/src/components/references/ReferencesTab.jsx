import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, AlertTriangle } from 'lucide-react';
import { getReferences, deleteReference } from '../../api/referenceService';
import ReferenceCard from './ReferenceCard';
import AddReferenceModal from './AddReferenceModal';
import EditReferenceModal from './EditReferenceModal';
import toast from 'react-hot-toast';

const ReferencesTab = ({ project, currentUserRole, currentUserId }) => {
  const [references, setReferences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [styleFilter, setStyleFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [paperFilter, setPaperFilter] = useState('All');
  
  // Available filter options (derived from data)
  const [availableYears, setAvailableYears] = useState([]);
  const [availablePapers, setAvailablePapers] = useState([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingReference, setEditingReference] = useState(null);
  const [deletingReferenceId, setDeletingReferenceId] = useState(null);

  const isOwner = project.owner?._id === currentUserId || project.owner === currentUserId;
  const canAdd = isOwner || currentUserRole === 'researcher';

  useEffect(() => {
    fetchReferences();
  }, [project._id, search, styleFilter, yearFilter, paperFilter]);

  const fetchReferences = async () => {
    try {
      setIsLoading(true);
      const res = await getReferences(project._id, {
        search,
        citationStyle: styleFilter,
        publicationYear: yearFilter,
        researchPaper: paperFilter
      });
      if (res.success) {
        setReferences(res.references);
        
        // Extract available years and papers for filter dropdowns on first load
        if (availableYears.length === 0) {
          const years = [...new Set(res.references.map(r => r.publicationYear).filter(Boolean))].sort((a, b) => b - a);
          setAvailableYears(years);
          
          const papers = [];
          const paperIds = new Set();
          res.references.forEach(r => {
            if (r.researchPaper && !paperIds.has(r.researchPaper._id)) {
              paperIds.add(r.researchPaper._id);
              papers.push(r.researchPaper);
            }
          });
          setAvailablePapers(papers);
        }
      }
    } catch (error) {
      toast.error('Failed to load references');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingReferenceId) return;
    try {
      const res = await deleteReference(deletingReferenceId);
      if (res.success) {
        toast.success('Reference deleted');
        setReferences(references.filter(r => r._id !== deletingReferenceId));
        setDeletingReferenceId(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete reference');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">References & Citations</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage citations and references used in this research project.</p>
        </div>
        {canAdd && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="shrink-0 flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Add Reference</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search references..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary-500 dark:text-white transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select 
            value={styleFilter} 
            onChange={(e) => setStyleFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm px-3 py-2 outline-none focus:border-primary-500 dark:text-white"
          >
            <option value="All">All Styles</option>
            <option value="APA">APA</option>
            <option value="MLA">MLA</option>
            <option value="IEEE">IEEE</option>
            <option value="Chicago">Chicago</option>
          </select>

          <select 
            value={yearFilter} 
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm px-3 py-2 outline-none focus:border-primary-500 dark:text-white"
          >
            <option value="All">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select 
            value={paperFilter} 
            onChange={(e) => setPaperFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm px-3 py-2 outline-none focus:border-primary-500 dark:text-white max-w-[200px] truncate"
          >
            <option value="All">All Papers</option>
            <option value="none">No Linked Paper</option>
            {availablePapers.map(paper => (
              <option key={paper._id} value={paper._id}>{paper.title}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : references.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <BookMarked size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No references yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Add references to organize the sources used in your research.
          </p>
          {canAdd && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
            >
              <Plus size={18} />
              <span>Add Reference</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {references.map((reference) => (
            <ReferenceCard
              key={reference._id}
              reference={reference}
              onEdit={setEditingReference}
              onDelete={setDeletingReferenceId}
              currentUserRole={currentUserRole}
              isOwner={isOwner}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <AddReferenceModal
          projectId={project._id}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={(newRef) => {
            setReferences([newRef, ...references]);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {editingReference && (
        <EditReferenceModal
          projectId={project._id}
          reference={editingReference}
          onClose={() => setEditingReference(null)}
          onSuccess={(updatedRef) => {
            setReferences(references.map(r => r._id === updatedRef._id ? updatedRef : r));
            setEditingReference(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingReferenceId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-500 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Reference?</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 ml-14">
              Are you sure you want to delete this reference? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingReferenceId(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferencesTab;
