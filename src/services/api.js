import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://hirefit-server.onrender.com/api' || 'http://localhost:5000/api',
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
