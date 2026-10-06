import api from './axios';

export const getProjectContributions = async (projectId, period = 'all') => {
  try {
    const response = await api.get(`/projects/${projectId}/contributions?period=${period}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
