import api from './axios';

export const getProjectMessages = async (projectId, page = 1, limit = 50) => {
  const response = await api.get(`/projects/${projectId}/messages`, {
    params: { page, limit }
  });
  return response.data;
};
