import api from './axios';

export const getReferences = async (projectId, params) => {
  const { data } = await api.get(`/projects/${projectId}/references`, { params });
  return data;
};

export const createReference = async (projectId, referenceData) => {
  const { data } = await api.post(`/projects/${projectId}/references`, referenceData);
  return data;
};

export const updateReference = async (referenceId, referenceData) => {
  const { data } = await api.put(`/references/${referenceId}`, referenceData);
  return data;
};

export const deleteReference = async (referenceId) => {
  const { data } = await api.delete(`/references/${referenceId}`);
  return data;
};
