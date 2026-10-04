import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Research Paper</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 hover:text-slate-600 dark:text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Title *</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500 bg-transparent"
              placeholder="Deep Learning for Diabetic Retinopathy Detection"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Authors (comma separated)</label>
            <input 
              type="text" 
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500 bg-transparent"
              placeholder="John Smith, Priya Kumar"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Publication Year</label>
            <input 
              type="number" 
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500 bg-transparent"
              placeholder="2025"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Journal / Conference</label>
            <input 
              type="text" 
              name="journal"
              value={formData.journal}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500 bg-transparent"
              placeholder="IEEE Access"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">DOI</label>
            <input 
              type="text" 
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500 bg-transparent"
              placeholder="10.xxxx/xxxxx"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">External URL</label>
            <input 
              type="url" 
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500 bg-transparent"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Tags (comma separated)</label>
            <input 
              type="text" 
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500 bg-transparent"
              placeholder="AI, deep-learning"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Abstract</label>
            <textarea 
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500 bg-transparent h-24"
              placeholder="Brief summary of the paper..."
            ></textarea>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">PDF File</label>
            <div className="flex w-full items-center justify-center">
              <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100">
                <div className="flex flex-col items-center justify-center pb-4 pt-5 text-center">
                  <Upload className="mb-2 h-6 w-6 text-slate-400" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {pdfFile ? <span className="font-semibold text-primary-600">{pdfFile.name}</span> : "Click to select a file"}
                  </p>
                </div>
                <input
                  type="file"
                  id="pdf-upload"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Notes</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500 bg-transparent h-[4.5rem]"
              placeholder="Any personal notes for the team..."
            ></textarea>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {isLoading ? "Adding..." : "Add Research Paper"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddPaperModal;
