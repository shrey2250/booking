const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_BASE_URL;

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
