import React, { useState, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { updateResearchPaper } from '../../api/researchPaperService';
import toast from 'react-hot-toast';

const EditPaperModal = ({ paper, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    abstract: '',
    publicationYear: '',
    journal: '',
    conference: '',
    doi: '',
    url: '',
    tags: '',
    notes: ''
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (paper) {
      setFormData({
        title: paper.title || '',
        authors: paper.authors ? paper.authors.join(', ') : '',
        abstract: paper.abstract || '',
        publicationYear: paper.publicationYear || '',
        journal: paper.journal || '',
        conference: paper.conference || '',
        doi: paper.doi || '',
        url: paper.url || '',
        tags: paper.tags ? paper.tags.join(', ') : '',
        notes: paper.notes || ''
      });
    }
  }, [paper]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }
    if (file && file.size > 50 * 1024 * 1024) {
      toast.error('File size exceeds 50MB limit');
      return;
    }
    setPdfFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsLoading(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key] || '');
      });
      if (pdfFile) {
        submitData.append('pdf', pdfFile);
      }

      const res = await updateResearchPaper(paper._id, submitData);
      if (res.success) {
        toast.success('Research paper updated successfully');
        onSuccess(res.paper);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update research paper');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-3xl flex flex-col max-h-[95vh] rounded-2xl bg-white dark:bg-slate-900 shadow-xl animate-in zoom-in-95 duration-200"
      >
        {/* Fixed Header */}
        <div className="flex shrink-0 items-center justify-between p-6 pb-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Research Paper</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 dark:text-slate-400 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Row 1 */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Title *</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:text-white transition-colors"
              />
            </div>

            {/* Row 2 */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Authors (comma separated)</label>
              <input 
                type="text" 
                name="authors"
                value={formData.authors}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Publication Year</label>
              <input 
                type="number" 
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:text-white transition-colors"
              />
            </div>

            {/* Row 3 */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Journal / Conference</label>
              <input 
                type="text" 
                name="journal"
                value={formData.journal}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">DOI</label>
              <input 
                type="text" 
                name="doi"
                value={formData.doi}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:text-white transition-colors"
              />
            </div>

            {/* Row 4 */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">External URL</label>
              <input 
                type="url" 
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Tags (comma separated)</label>
              <input 
                type="text" 
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:text-white transition-colors"
              />
            </div>

            {/* Row 5 */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Abstract</label>
              <textarea 
                name="abstract"
                value={formData.abstract}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:text-white transition-colors resize-none h-24"
              ></textarea>
            </div>

            {/* Row 6 */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                {paper.pdfUrl ? 'Replace PDF File' : 'Upload PDF File'}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="pdf-upload-edit"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label 
                  htmlFor="pdf-upload-edit" 
                  className="shrink-0 cursor-pointer flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Upload size={16} /> Choose PDF
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {pdfFile ? (
                    <span className="flex items-center gap-1 text-primary-600 dark:text-primary-500 font-medium">
                      <FileText size={14} /> {pdfFile.name}
                    </span>
                  ) : paper.pdfUrl ? (
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <FileText size={14} /> Existing PDF attached
                    </span>
                  ) : "No file selected"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Notes</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:text-white transition-colors resize-none h-[68px]"
              ></textarea>
            </div>

          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex shrink-0 justify-end gap-3 p-6 pt-4">
          <button 
            type="button" 
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60 flex items-center gap-2 transition-colors shadow-sm"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPaperModal;
