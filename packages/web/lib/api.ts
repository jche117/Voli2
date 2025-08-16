import axios from 'axios';

// Provide a fallback for the API URL to prevent build errors if the .env variable is not loaded.
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1';

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    `Warning: NEXT_PUBLIC_API_URL is not set. Defaulting to ${baseURL}. Please check your .env.local file.`
  );
}

export const api = axios.create({
  baseURL,
});

export const getRoles = async (token: string) => {
  const response = await api.get('/roles/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Role assignment endpoints (backend expects path params user_id & role_id)
export const assignRoleToUser = async (userId: number, roleId: number, token: string) => {
  const response = await api.post(`/roles/users/${userId}/assign/${roleId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const revokeRoleFromUser = async (userId: number, roleId: number, token: string) => {
  const response = await api.delete(`/roles/users/${userId}/revoke/${roleId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Task API calls
export const getTasks = async (token: string) => {
  const response = await api.get('/tasks/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createTask = async (taskData: any, token: string) => {
  const response = await api.post('/tasks/', taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateTask = async (taskId: number, taskData: any, token: string) => {
  const response = await api.put(`/tasks/${taskId}`, taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteTask = async (taskId: number, token: string) => {
  const response = await api.delete(`/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Asset API calls
export const getAssets = async (token: string) => {
  const response = await api.get('/assets/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createAsset = async (assetData: any, token: string) => {
  const response = await api.post('/assets/', assetData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateAsset = async (assetId: number, assetData: any, token: string) => {
  const response = await api.put(`/assets/${assetId}`, assetData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteAsset = async (assetId: number, token: string) => {
  const response = await api.delete(`/assets/${assetId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const assignAsset = async (assetId: number, userId: number, token: string) => {
  const response = await api.post(`/assets/${assetId}/assign/${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Task Template API calls
export const getTemplates = async (token: string) => {
  const response = await api.get('/templates/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getTemplate = async (templateId: number, token: string) => {
  const response = await api.get(`/templates/${templateId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  return response.data;
};

export const createTemplate = async (templateData: any, token: string) => {
  const response = await api.post('/templates/', templateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateTemplate = async (templateId: number, templateData: any, token: string) => {
  const response = await api.put(`/templates/${templateId}`, templateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteTemplate = async (templateId: number, token: string) => {
  const response = await api.delete(`/templates/${templateId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


