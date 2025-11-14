/**
 * API Client for PHP Backend
 * Handles all HTTP requests to the PHP API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Make API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const result: ApiResponse<T> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * Releases API
 */
export const releasesAPI = {
  getAll: () => apiRequest('/releases'),
  getLatest: (limit: number = 5) => 
    apiRequest(`/releases?action=latest&limit=${limit}`),
  getById: (id: number) => 
    apiRequest(`/releases?action=getById&id=${id}`),
  create: (data: any) => 
    apiRequest('/releases', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) => 
    apiRequest('/releases', {
      method: 'PUT',
      body: JSON.stringify({ ...data, id }),
    }),
  delete: (id: number) => 
    apiRequest('/releases', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    }),
};

/**
 * Tracks API
 */
export const tracksAPI = {
  getAll: () => apiRequest('/tracks'),
  getByReleaseId: (releaseId: number) => 
    apiRequest(`/tracks?action=getByReleaseId&releaseId=${releaseId}`),
  getById: (id: number) => 
    apiRequest(`/tracks?action=getById&id=${id}`),
  create: (data: any) => 
    apiRequest('/tracks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) => 
    apiRequest('/tracks', {
      method: 'PUT',
      body: JSON.stringify({ ...data, id }),
    }),
  delete: (id: number) => 
    apiRequest('/tracks', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    }),
};

/**
 * News API
 */
export const newsAPI = {
  getAll: () => apiRequest('/news'),
  getLatest: (limit: number = 5) => 
    apiRequest(`/news?action=latest&limit=${limit}`),
  getById: (id: number) => 
    apiRequest(`/news?action=getById&id=${id}`),
  create: (data: any) => 
    apiRequest('/news', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) => 
    apiRequest('/news', {
      method: 'PUT',
      body: JSON.stringify({ ...data, id }),
    }),
  delete: (id: number) => 
    apiRequest('/news', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    }),
};

/**
 * Upload API
 */
export const uploadAPI = {
  uploadFile: async (file: File, type: 'image' | 'audio') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload Error: ${response.statusText}`);
    }

    const result: ApiResponse<{ url: string; filename: string }> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  },
};

export default apiRequest;
