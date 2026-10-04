import api from "./axios";

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getUsers = async (params) => {
  const response = await api.get("/admin/users", { params });
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

export const getProjects = async (params) => {
  const response = await api.get("/admin/projects", { params });
  return response.data;
};

export const getProjectById = async (projectId) => {
  const response = await api.get(`/admin/projects/${projectId}`);
  return response.data;
};
