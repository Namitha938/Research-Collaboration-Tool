import React, { useState } from 'react';
import { BookMarked, Calendar, ExternalLink, Edit2, Trash2, Copy, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const ReferenceCard = ({ reference, onEdit, onDelete, currentUserRole, isOwner, currentUserId }) => {
  const [expanded, setExpanded] = useState(false);

  // Check permissions
  const canEdit = isOwner || (currentUserRole === 'researcher' && reference.addedBy._id === currentUserId);
  const canDelete = isOwner || (currentUserRole === 'researcher' && reference.addedBy._id === currentUserId);

  const copyCitation = () => {
    navigator.clipboard.writeText(reference.citationText);
    toast.success('Citation copied to clipboard');
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
              {reference.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              {reference.authors && reference.authors.length > 0 && (
                <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <BookMarked size={14} className="shrink-0" />
                  <span className="truncate">{reference.authors.join(', ')}</span>
                </span>
              )}
              {reference.publicationYear && (
                <span className="flex items-center gap-1.5 shrink-0">
                  <Calendar size={14} className="shrink-0" />
                  {reference.publicationYear}
                </span>
              )}
              {(reference.journal || reference.conference) && (
                <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <FileText size={14} className="shrink-0" />
                  <span className="truncate">{reference.journal || reference.conference}</span>
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {reference.url && (
              <a 
                href={reference.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Open Source"
              >
                <ExternalLink size={16} />
              </a>
            )}
            {canEdit && (
              <button 
                onClick={() => onEdit(reference)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Edit Reference"
              >
                <Edit2 size={16} />
              </button>
            )}
            {canDelete && (
              <button 
                onClick={() => onDelete(reference._id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Delete Reference"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Citation Display */}
        <div className="mt-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {reference.citationStyle} Citation
            </span>
            <button 
              onClick={copyCitation}
              className="text-xs flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium"
            >
              <Copy size={12} /> Copy
            </button>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 italic">
            {reference.citationText}
          </p>
        </div>
        
        {/* Toggle Details */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide Details' : 'View Details'}
        </button>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {reference.researchPaper && (
              <div className="sm:col-span-2">
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Linked Research Paper</span>
                <span className="text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText size={14} className="text-primary-500" />
                  {reference.researchPaper.title}
                </span>
              </div>
            )}
            
            {reference.doi && (
              <div>
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">DOI</span>
                <span className="text-slate-900 dark:text-white">{reference.doi}</span>
              </div>
            )}
            
            {reference.publisher && (
              <div>
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Publisher</span>
                <span className="text-slate-900 dark:text-white">{reference.publisher}</span>
              </div>
            )}
            
            {(reference.volume || reference.issue || reference.pages) && (
              <div>
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Vol / Issue / Pages</span>
                <span className="text-slate-900 dark:text-white">
                  {[
                    reference.volume ? `Vol ${reference.volume}` : '',
                    reference.issue ? `Issue ${reference.issue}` : '',
                    reference.pages ? `p. ${reference.pages}` : ''
                  ].filter(Boolean).join(' | ')}
                </span>
              </div>
            )}
            
            <div className="sm:col-span-2">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Added By</span>
              <span className="text-slate-900 dark:text-white">{reference.addedBy.name}</span>
            </div>
            
            {reference.notes && (
              <div className="sm:col-span-2 mt-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                <span className="block text-xs font-medium text-yellow-800 dark:text-yellow-500 mb-1">Notes</span>
                <span className="text-yellow-900 dark:text-yellow-100 whitespace-pre-wrap">{reference.notes}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferenceCard;
