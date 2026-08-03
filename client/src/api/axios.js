import axios from 'axios';

// Base URL: use VITE_API_URL in production; fall back to relative /api
// (handled by the Vite dev proxy) in development.
const baseURL = (import.meta.env.VITE_API_URL || '') + '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach admin token if present (for the optional admin panel).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nlcs_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // For file uploads, let the browser set the multipart boundary itself —
  // our default JSON header would otherwise strip it and break parsing.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Normalise errors to a readable message.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject({ ...error, message });
  }
);

export default api;
