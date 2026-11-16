import axios from 'axios';

// Detect if running on localhost / 127.0.0.1
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// When developing locally, connect directly to local backend port 5000;
// In production (Vercel), connect to the production Render API.
const getApiBaseUrl = () => {
  if (isLocalhost) {
    return import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:5000/api';
  }
  return import.meta.env.VITE_API_URL || 'https://hirefit-server.onrender.com/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000 // 60s for AI calls
});

// Attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hirefit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hirefit_token');
      localStorage.removeItem('hirefit_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
