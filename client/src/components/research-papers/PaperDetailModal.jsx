import React from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Download, FileText, Calendar, BookOpen, Edit2, Trash2 } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const PaperDetailModal = ({ paper, userRole, userId, onClose, onEdit, onDelete }) => {
  const adderId = paper.addedBy?._id || paper.addedBy;
  const canEdit = userRole === 'owner' || (userRole === 'researcher' && adderId === userId);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="pr-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              {paper.title}
            </h2>
            {paper.authors && paper.authors.length > 0 && (
              <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
                {paper.authors.join(', ')}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 hover:text-slate-600 dark:text-slate-400 transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            {paper.journal && (
              <span className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                <BookOpen size={16} /> {paper.journal}
              </span>
            )}
            {paper.conference && (
              <span className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                <BookOpen size={16} /> {paper.conference}
              </span>
            )}
            {paper.publicationYear && (
              <span className="flex items-center gap-1.5">
                <Calendar size={16} /> {paper.publicationYear}
              </span>
            )}
            {paper.doi && (
              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                DOI: {paper.doi}
              </span>
            )}
          </div>

          {paper.abstract && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">Abstract</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                {paper.abstract}
              </p>
            </div>
          )}

          {paper.notes && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-500 mb-2">Researcher Notes</h3>
              <p className="text-amber-700 dark:text-amber-400/80 text-sm whitespace-pre-wrap">
                {paper.notes}
              </p>
            </div>
          )}

          {paper.tags && paper.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {paper.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Added by <span className="font-medium text-slate-700 dark:text-slate-300">{paper.addedBy?.name || 'Unknown'}</span>
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> • </span>
              {formatDate(paper.createdAt)}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {paper.url && (
                <a 
                  href={paper.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  <ExternalLink size={16} /> Open Link
                </a>
              )}
              {paper.pdfUrl && (
                <>
                  <a 
                    href={paper.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-medium transition-colors"
                  >
                    <FileText size={16} /> View PDF
                  </a>
                  <a 
                    href={paper.pdfUrl.replace('/upload/', '/upload/fl_attachment/')} 
                    download
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download size={16} /> Download
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 rounded-b-2xl">
            <button 
              onClick={() => { onClose(); onEdit(); }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Edit2 size={16} /> Edit
            </button>
            <button 
              onClick={() => { onClose(); onDelete(); }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default PaperDetailModal;
