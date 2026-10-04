import React from 'react';
import { FileText, MoreVertical, ExternalLink, Calendar, BookOpen, Edit2, Trash2 } from 'lucide-react';

const ResearchPaperCard = ({ paper, userRole, userId, onEdit, onDelete, onView }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const adderId = paper.addedBy?._id || paper.addedBy;
  const canEdit = userRole === 'owner' || (userRole === 'researcher' && adderId === userId);
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full relative group">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 
            className="font-bold text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-primary-600 transition-colors"
            onClick={onView}
            title={paper.title}
          >
            {paper.title}
          </h3>
          <div className="relative shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreVertical size={16} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-10">
                <button 
                  onClick={() => { setShowMenu(false); onView(); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <FileText size={14} /> View Details
                </button>
                {canEdit && (
                  <>
                    <button 
                      onClick={() => { setShowMenu(false); onEdit(); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
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
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-1" title={paper.authors.join(', ')}>
            {paper.authors.join(', ')}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
          {(paper.journal || paper.conference) && (
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
              <BookOpen size={13} className="text-slate-400 shrink-0" /> 
              <span className="truncate">{paper.journal || paper.conference}</span>
            </span>
          )}
          {paper.publicationYear && (
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <Calendar size={13} className="text-slate-400 shrink-0" /> {paper.publicationYear}
            </span>
          )}
          {paper.doi && (
            <span className="flex items-center gap-1 text-slate-400 truncate max-w-[120px]" title={paper.doi}>
              <span className="font-semibold">DOI:</span> <span className="truncate">{paper.doi}</span>
            </span>
          )}
        </div>

        {paper.abstract && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
            {paper.abstract}
          </p>
        )}

        <div className="mt-auto">
          {paper.tags && paper.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {paper.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded text-xs font-medium border border-primary-100 dark:border-primary-800/30">
                  {tag}
                </span>
              ))}
              {paper.tags.length > 3 && (
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded text-xs font-medium">
                  +{paper.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-slate-500 dark:text-slate-400">
                Added by <span className="font-medium text-slate-700 dark:text-slate-300">{paper.addedBy?.name?.split(' ')[0] || 'Unknown'}</span>
              </span>
              {paper.createdAt && (
                <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                  {new Date(paper.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
            
            {paper.pdfUrl && (
              <a 
                href={paper.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
              >
                <FileText size={14} /> PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchPaperCard;
