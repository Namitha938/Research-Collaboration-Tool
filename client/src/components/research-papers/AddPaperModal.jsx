import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { createResearchPaper } from '../../api/researchPaperService';
import toast from 'react-hot-toast';

const AddPaperModal = ({ projectId, onClose, onSuccess }) => {
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
        if (formData[key]) submitData.append(key, formData[key]);
      });
      if (pdfFile) {
        submitData.append('pdf', pdfFile);
      }

      const res = await createResearchPaper(projectId, submitData);
      if (res.success) {
        toast.success('Research paper added successfully');
        onSuccess(res.paper);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add research paper');
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Research Paper</h2>
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
                placeholder="Deep Learning for Diabetic Retinopathy Detection"
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
                placeholder="John Smith, Priya Kumar"
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
                placeholder="2025"
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
                placeholder="IEEE Access"
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
                placeholder="10.xxxx/xxxxx"
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
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Tags (comma separated)</label>
              <input 
                type="text" 
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-colors text-slate-900 dark:text-white"
                placeholder="AI, deep-learning"
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
                placeholder="Brief summary of the paper..."
              ></textarea>
            </div>

            {/* Row 6 */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">PDF File</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="pdf-upload"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label 
                  htmlFor="pdf-upload" 
                  className="shrink-0 cursor-pointer flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Upload size={16} /> Choose PDF
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {pdfFile ? (
                    <span className="flex items-center gap-1 text-primary-600 dark:text-primary-500 font-medium">
                      <FileText size={14} /> {pdfFile.name}
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
                placeholder="Any personal notes for the team..."
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
                Adding...
              </>
            ) : 'Add Research Paper'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPaperModal;
