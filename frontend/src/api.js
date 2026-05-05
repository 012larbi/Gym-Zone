import axios from 'axios';

// Single place to change the backend URL — no more hardcoded localhost scattered everywhere
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // Fail fast — 10s timeout
});

// Auto-attach admin token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
