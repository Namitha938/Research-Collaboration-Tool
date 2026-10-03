import React from 'react';
import { FileText, MoreVertical, ExternalLink, Calendar, BookOpen, Edit2, Trash2 } from 'lucide-react';

const ResearchPaperCard = ({ paper, userRole, userId, onEdit, onDelete, onView }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const adderId = paper.addedBy?._id || paper.addedBy;
  const canEdit = userRole === 'owner' || (userRole === 'researcher' && adderId === userId);
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full relative group">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 
            className="font-bold text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-primary-600 transition-colors"
            onClick={onView}
          >
            {paper.title}
          </h3>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <MoreVertical size={16} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-10">
                <button 
                  onClick={() => { setShowMenu(false); onView(); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <FileText size={14} /> View Details
                </button>
                {canEdit && (
                  <>
                    <button 
                      onClick={() => { setShowMenu(false); onEdit(); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => { setShowMenu(false); onDelete(); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {paper.authors && paper.authors.length > 0 && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-1">
            {paper.authors.join(', ')}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
          {paper.journal && (
            <span className="flex items-center gap-1">
              <BookOpen size={12} /> {paper.journal}
            </span>
          )}
          {paper.publicationYear && (
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {paper.publicationYear}
            </span>
          )}
        </div>

        {paper.tags && paper.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {paper.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">
                #{tag}
              </span>
            ))}
            {paper.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded text-xs">
                +{paper.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Added by {paper.addedBy?.name?.split(' ')[0] || 'Unknown'}
          </span>
          {paper.pdfUrl && (
            <span className="flex items-center gap-1 text-primary-600 font-medium bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">
              <FileText size={12} /> PDF
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchPaperCard;
