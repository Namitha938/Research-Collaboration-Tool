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

export const getAuditLogs = async (params) => {
  const response = await api.get("/admin/audit-log", { params });
  return response.data;
};

const buildExportParams = (params = {}) => {
  const clean = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "All") {
      clean[key] = value;
    }
  });
  return clean;
};

const filenameFromDisposition = (disposition, fallback) => {
  if (!disposition) return fallback;
  const match = disposition.match(/filename="?([^";]+)"?/i);
  return match ? match[1] : fallback;
};

const triggerBlobDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const parseBlobError = async (blob) => {
  try {
    const text = await blob.text();
    return JSON.parse(text)?.message || null;
  } catch {
    return null;
  }
};

export const exportAuditLogs = async (params) => {
  let response;

  try {
    response = await api.get("/admin/audit-log/export", {
      params: buildExportParams(params),
      responseType: "blob",
    });
  } catch (error) {
    // A failed export returns JSON, not a CSV. Without this the browser would
    // save the error body as a broken .csv file.
    const blob = error.response?.data;
    const message =
      (blob instanceof Blob && (await parseBlobError(blob))) ||
      error.response?.data?.message ||
      "Audit log export failed. Please try again.";

    const wrapped = new Error(message);
    wrapped.status = error.response?.status;
    throw wrapped;
  }

  const fallback = `researchhub-audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
  const filename = filenameFromDisposition(
    response.headers["content-disposition"],
    fallback
  );

  triggerBlobDownload(response.data, filename);

  return {
    filename,
    rowCount: Number(response.headers["x-total-rows"] || 0),
    totalMatched: Number(response.headers["x-total-matched"] || 0),
    truncated: response.headers["x-truncated"] === "true",
  };
};

/**
 * Builds the toast message for a completed export, calling out truncation so a
 * capped file is never mistaken for the complete trail.
 */
export const describeAuditExport = ({ filename, rowCount, totalMatched, truncated }) => {
  const rows = `${rowCount} row${rowCount === 1 ? "" : "s"}`;

  if (!truncated) {
    return `Downloaded ${filename} (${rows})`;
  }

  return `Downloaded ${filename} with the most recent ${rows} of ${totalMatched} matches. Narrow the filters to export the rest.`;
};
