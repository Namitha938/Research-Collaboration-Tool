import axios from 'axios';

const API_URL = '/api';

export const getProjectMilestones = async (projectId) => {
  const response = await axios.get(`${API_URL}/projects/${projectId}/milestones`, {
    withCredentials: true
  });
  return response.data;
};

export const createMilestone = async (projectId, milestoneData) => {
  const response = await axios.post(`${API_URL}/projects/${projectId}/milestones`, milestoneData, {
    withCredentials: true
  });
  return response.data;
};

export const getMilestone = async (id) => {
  const response = await axios.get(`${API_URL}/milestones/${id}`, {
    withCredentials: true
  });
  return response.data;
};

export const updateMilestone = async (id, milestoneData) => {
  const response = await axios.put(`${API_URL}/milestones/${id}`, milestoneData, {
    withCredentials: true
  });
  return response.data;
};

export const deleteMilestone = async (id) => {
  const response = await axios.delete(`${API_URL}/milestones/${id}`, {
    withCredentials: true
  });
  return response.data;
};

export const updateMilestoneStatus = async (id, statusData) => {
  const response = await axios.patch(`${API_URL}/milestones/${id}/status`, statusData, {
    withCredentials: true
  });
  return response.data;
};

export const assignMilestone = async (id, assignData) => {
  const response = await axios.patch(`${API_URL}/milestones/${id}/assign`, assignData, {
    withCredentials: true
  });
  return response.data;
};
