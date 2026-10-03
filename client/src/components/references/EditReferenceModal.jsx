import React, { useState, useEffect } from 'react';
import { X, Copy } from 'lucide-react';
import { updateReference } from '../../api/referenceService';
import { getProjectResearchPapers } from '../../api/researchPaperService';
import toast from 'react-hot-toast';

const formatCitationPreview = (data) => {
  const authorStr = data.authors ? (typeof data.authors === 'string' ? data.authors.split(',').map(a => a.trim()).filter(Boolean).join(', ') : data.authors.join(', ')) : 'Unknown Author';
  const yearStr = data.publicationYear || 'n.d.';
  const titleStr = data.title || 'Unknown Title';
  const venueStr = data.journal || data.conference || data.publisher || '';
  
  switch (data.citationStyle) {
    case 'MLA':
      return `${authorStr || 'Unknown Author'}. "${titleStr}."${venueStr ? ' ' + venueStr + ',' : ''} ${yearStr}.`;
    case 'IEEE':
      return `${authorStr || 'Unknown Author'}, "${titleStr},"${venueStr ? ' ' + venueStr + ',' : ''} ${yearStr}.`;
    case 'Chicago':
      return `${authorStr || 'Unknown Author'}. "${titleStr}."${venueStr ? ' ' + venueStr + '.' : ''} ${yearStr}.`;
    case 'APA':
    default:
      return `${authorStr || 'Unknown Author'}. (${yearStr}). ${titleStr}.${venueStr ? ' ' + venueStr + '.' : ''}`;
  }
};

const EditReferenceModal = ({ projectId, reference, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    publicationYear: '',
    journal: '',
    conference: '',
    doi: '',
    url: '',
    publisher: '',
    volume: '',
    issue: '',
    pages: '',
    citationStyle: 'APA',
    researchPaper: '',
    notes: '',
    citationText: ''
  });
  
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPapers();
    if (reference) {
      setFormData({
        title: reference.title || '',
        authors: reference.authors ? reference.authors.join(', ') : '',
        publicationYear: reference.publicationYear || '',
        journal: reference.journal || '',
        conference: reference.conference || '',
        doi: reference.doi || '',
        url: reference.url || '',
        publisher: reference.publisher || '',
        volume: reference.volume || '',
        issue: reference.issue || '',
        pages: reference.pages || '',
        citationStyle: reference.citationStyle || 'APA',
        researchPaper: reference.researchPaper ? (reference.researchPaper._id || reference.researchPaper) : '',
        notes: reference.notes || '',
        citationText: reference.citationText || ''
      });
    }
  }, [projectId, reference]);

  const fetchPapers = async () => {
    try {
      const res = await getProjectResearchPapers(projectId);
      if (res.success) {
        setPapers(res.papers);
      }
    } catch (error) {
      console.error('Failed to load research papers');
    }
  };

  const handleChange = (e) => {
    // If the user modifies standard fields, we want to auto-update the citation text
    // We will clear citationText so it falls back to auto-generation preview
    setFormData({ ...formData, [e.target.name]: e.target.value, citationText: '' });
  };

  const copyToClipboard = () => {
    const citation = formData.citationText || formatCitationPreview(formData);
    navigator.clipboard.writeText(citation);
    toast.success('Citation copied to clipboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsLoading(true);
    try {
      const dataToSubmit = { ...formData };
      if (dataToSubmit.researchPaper === '') {
        dataToSubmit.researchPaper = null;
      }
      if (dataToSubmit.citationText === '') {
        delete dataToSubmit.citationText; // Let backend auto-generate
      }

      const res = await updateReference(reference._id, dataToSubmit);
      if (res.success) {
        toast.success('Reference updated successfully');
        onSuccess(res.reference);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update reference');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:text-white transition-colors";
  const labelClass = "mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-3xl flex flex-col max-h-[95vh] rounded-2xl bg-white dark:bg-slate-900 shadow-xl animate-in zoom-in-95 duration-200"
      >
        {/* Fixed Header */}
        <div className="flex shrink-0 items-center justify-between p-6 pb-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Reference</h2>
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
            
            {/* Title - Full Width */}
            <div className="md:col-span-2">
              <label className={labelClass}>Title *</label>
              <input 
                type="text" name="title" value={formData.title} onChange={handleChange} required
                className={inputClass} placeholder="Enter reference title"
              />
            </div>

            {/* Row 2 */}
            <div>
              <label className={labelClass}>Authors (comma separated)</label>
              <input type="text" name="authors" value={formData.authors} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Publication Year</label>
              <input type="number" name="publicationYear" value={formData.publicationYear} onChange={handleChange} className={inputClass} />
            </div>

            {/* Row 3 */}
            <div>
              <label className={labelClass}>Journal</label>
              <input type="text" name="journal" value={formData.journal} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Conference</label>
              <input type="text" name="conference" value={formData.conference} onChange={handleChange} className={inputClass} />
            </div>

            {/* Row 4 */}
            <div>
              <label className={labelClass}>DOI</label>
              <input type="text" name="doi" value={formData.doi} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Source URL</label>
              <input type="url" name="url" value={formData.url} onChange={handleChange} className={inputClass} />
            </div>

            {/* Row 5 */}
            <div>
              <label className={labelClass}>Publisher</label>
              <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} className={inputClass} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className={labelClass}>Vol</label>
                <input type="text" name="volume" value={formData.volume} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Issue</label>
                <input type="text" name="issue" value={formData.issue} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Pages</label>
                <input type="text" name="pages" value={formData.pages} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            {/* Row 6 */}
            <div>
              <label className={labelClass}>Citation Style</label>
              <select name="citationStyle" value={formData.citationStyle} onChange={handleChange} className={inputClass}>
                <option value="APA">APA</option>
                <option value="MLA">MLA</option>
                <option value="IEEE">IEEE</option>
                <option value="Chicago">Chicago</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Link to Research Paper (Optional)</label>
              <select name="researchPaper" value={formData.researchPaper} onChange={handleChange} className={inputClass}>
                <option value="">None / Select a research paper</option>
                {papers.map(p => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>

            {/* Citation Preview - Full Width */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Citation Preview</label>
                <button type="button" onClick={copyToClipboard} className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium">
                  <Copy size={12} /> Copy
                </button>
              </div>
              <div className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 italic min-h-[60px] flex items-center">
                {formData.citationText || formatCitationPreview(formData)}
              </div>
            </div>

            {/* Notes - Full Width */}
            <div className="md:col-span-2">
              <label className={labelClass}>Notes</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className={`${inputClass} resize-none h-[80px]`}
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
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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

export default EditReferenceModal;
