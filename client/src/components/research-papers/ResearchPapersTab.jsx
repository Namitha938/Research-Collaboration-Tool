import React, { useState, useEffect, useMemo } from 'react';
import { getProjectResearchPapers, deleteResearchPaper } from '../../api/researchPaperService';
import ResearchPaperCard from './ResearchPaperCard';
import AddPaperModal from './AddPaperModal';
import EditPaperModal from './EditPaperModal';
import PaperDetailModal from './PaperDetailModal';
import { Search, Plus, Filter, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const ResearchPapersTab = ({ projectId, project }) => {
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'withPdf', 'withoutPdf'
  const [filterYear, setFilterYear] = useState('all');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [viewingPaper, setViewingPaper] = useState(null);

  const { user } = useAuth();
  
  const userRole = useMemo(() => {
    if (!project || !user) return null;
    const userId = user._id || user.id;
    const ownerId = project.owner?._id || project.owner;
    
    if (ownerId === userId) return 'owner';
    const member = project.members?.find(m => {
      const mId = m.user?._id || m.user;
      return mId === userId;
    });
    return member ? member.role : null;
  }, [project, user]);

  const canAdd = userRole === 'owner' || userRole === 'researcher';

  const fetchPapers = async () => {
    try {
      setIsLoading(true);
      const data = await getProjectResearchPapers(projectId);
      if (data.success) {
        setPapers(data.papers);
      }
    } catch (error) {
      toast.error('Failed to fetch research papers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, [projectId]);

  const handleDelete = async (paperId) => {
    if (window.confirm('Are you sure you want to delete this research paper?')) {
      try {
        const res = await deleteResearchPaper(paperId);
        if (res.success) {
          toast.success('Research paper deleted successfully');
          setPapers(papers.filter(p => p._id !== paperId));
          if (viewingPaper?._id === paperId) setViewingPaper(null);
        }
      } catch (error) {
        toast.error('Failed to delete research paper');
      }
    }
  };

  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const matchesSearch = searchTerm === '' || 
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.authors?.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
        paper.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        paper.journal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.doi?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPdf = filterType === 'all' || 
        (filterType === 'withPdf' && paper.pdfUrl) || 
        (filterType === 'withoutPdf' && !paper.pdfUrl);

      const matchesYear = filterYear === 'all' || 
        (paper.publicationYear && paper.publicationYear.toString() === filterYear);

      return matchesSearch && matchesPdf && matchesYear;
    });
  }, [papers, searchTerm, filterType, filterYear]);

  const uniqueYears = useMemo(() => {
    const years = new Set();
    papers.forEach(p => {
      if (p.publicationYear) years.add(p.publicationYear);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [papers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-primary-500" />
            Research Papers
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Organize and review the academic literature used by your research team.</p>
        </div>
        {canAdd && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="shrink-0 flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Add Paper
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search papers by title, author, tag..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-colors text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 min-w-[120px]"
            >
              <option value="all">All Files</option>
              <option value="withPdf">With PDF</option>
              <option value="withoutPdf">Without PDF</option>
            </select>
          </div>
          <div className="relative">
            <select 
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 min-w-[100px]"
            >
              <option value="all">All Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400">Loading research papers...</p>
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <BookOpen size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No research papers found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            {papers.length === 0 
              ? "Add academic papers to build your project's research library." 
              : "No papers match your current filters."}
          </p>
          {canAdd && papers.length === 0 && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Add First Paper
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map(paper => (
            <ResearchPaperCard 
              key={paper._id} 
              paper={paper} 
              userRole={userRole}
              userId={user?._id || user?.id}
              onEdit={() => setEditingPaper(paper)}
              onDelete={() => handleDelete(paper._id)}
              onView={() => setViewingPaper(paper)}
            />
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <AddPaperModal 
          projectId={projectId} 
          onClose={() => setIsAddModalOpen(false)} 
          onSuccess={(newPaper) => {
            setPapers([newPaper, ...papers]);
            setIsAddModalOpen(false);
          }} 
        />
      )}

      {editingPaper && (
        <EditPaperModal 
          paper={editingPaper} 
          onClose={() => setEditingPaper(null)} 
          onSuccess={(updatedPaper) => {
            setPapers(papers.map(p => p._id === updatedPaper._id ? updatedPaper : p));
            setEditingPaper(null);
            if (viewingPaper?._id === updatedPaper._id) setViewingPaper(updatedPaper);
          }} 
        />
      )}

      {viewingPaper && (
        <PaperDetailModal 
          paper={viewingPaper} 
          userRole={userRole}
          userId={user?._id || user?.id}
          onClose={() => setViewingPaper(null)}
          onEdit={() => setEditingPaper(viewingPaper)}
          onDelete={() => handleDelete(viewingPaper._id)}
        />
      )}
    </div>
  );
};

export default ResearchPapersTab;
