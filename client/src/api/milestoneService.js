import api from './axios';

export const getProjectMilestones = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/milestones`);
  return data;
};

export const createMilestone = async (projectId, milestoneData) => {
  const { data } = await api.post(`/projects/${projectId}/milestones`, milestoneData);
  return data;
};

export const getMilestone = async (id) => {
  const { data } = await api.get(`/milestones/${id}`);
  return data;
};

export const updateMilestone = async (id, milestoneData) => {
  const { data } = await api.put(`/milestones/${id}`, milestoneData);
  return data;
};

export const deleteMilestone = async (id) => {
  const { data } = await api.delete(`/milestones/${id}`);
  return data;
};

export const updateMilestoneStatus = async (id, statusData) => {
  const { data } = await api.patch(`/milestones/${id}/status`, statusData);
  return data;
};

export const assignMilestone = async (id, assignData) => {
  const { data } = await api.patch(`/milestones/${id}/assign`, assignData);
  return data;
};