import api from './axios';

export const getProjectResearchPapers = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/research-papers`);
  return response.data;
};

export const getResearchPaperById = async (paperId) => {
  const response = await api.get(`/research-papers/${paperId}`);
  return response.data;
};

export const createResearchPaper = async (projectId, formData) => {
  // Use multipart/form-data for PDF upload
  const response = await api.post(`/projects/${projectId}/research-papers`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateResearchPaper = async (paperId, formData) => {
  // Use multipart/form-data for potential PDF update
  const response = await api.put(`/research-papers/${paperId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteResearchPaper = async (paperId) => {
  const response = await api.delete(`/research-papers/${paperId}`);
  return response.data;
};
