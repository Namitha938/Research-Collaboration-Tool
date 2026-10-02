import api from "./axios";

export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData);
  return response.data;
};

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const updateProject = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

// --- Team & Invitations ---

export const getProjectMembers = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/members`);
  return response.data;
};

export const removeProjectMember = async (projectId, userId) => {
  const response = await api.delete(`/projects/${projectId}/members/${userId}`);
  return response.data;
};

export const changeMemberRole = async (projectId, userId, role) => {
  const response = await api.put(`/projects/${projectId}/members/${userId}/role`, { role });
  return response.data;
};

export const getProjectInvitations = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/invitations`);
  return response.data;
};

export const sendInvitation = async (projectId, email, role) => {
  const response = await api.post(`/projects/${projectId}/invitations`, { email, role });
  return response.data;
};

export const cancelInvitation = async (projectId, invitationId) => {
  const response = await api.delete(`/projects/${projectId}/invitations/${invitationId}`);
  return response.data;
};

export const getMyInvitations = async () => {
  const response = await api.get('/invitations');
  return response.data;
};

export const getInvitationByToken = async (token) => {
  const response = await api.get(`/invitations/${token}`);
  return response.data;
};

export const acceptInvitation = async (token) => {
  const response = await api.post(`/invitations/${token}/accept`);
  return response.data;
};

export const rejectInvitation = async (token) => {
  const response = await api.post(`/invitations/${token}/reject`);
  return response.data;
};
