import axios from 'axios';

// Configurar URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  register: (email, password, name) =>
    api.post('/auth/register', { email, password, name }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Servicios de A3
export const a3Service = {
  getAll: () => api.get('/a3'),
  getById: (id) => api.get(`/a3/${id}`),
  downloadPdf: (id) => api.get(`/a3/${id}/pdf`, { responseType: 'blob' }),
  create: (data) => api.post('/a3', data),
  update: (id, data) => api.put(`/a3/${id}`, data),
  delete: (id) => api.delete(`/a3/${id}`),
};

// Servicios de datos
export const dataService = {
  upload: ({ file, linea, departamento }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (linea) {
      formData.append('linea', linea);
    }
    if (departamento) {
      formData.append('departamento', departamento);
    }

    return api.post('/data/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  list: (params = {}) => api.get('/data/list', { params }),
  getPareto: (params = {}) => api.get('/data/pareto', { params }),
};

// Servicios de IA
export const aiService = {
  generateAnalisis: (data) =>
    api.post('/ai/generate-analisis', data),
  generateCausaRaiz: (data) =>
    api.post('/ai/generate-causa-raiz', data),
  generatePlanAccion: (data) =>
    api.post('/ai/generate-plan-accion', data),
  generateEstandarizacion: (data) =>
    api.post('/ai/generate-estandarizacion', data),
  generateInsights: (data) =>
    api.post('/ai/generate-analisis', data),
  generateSolutions: (data) =>
    api.post('/ai/generate-causa-raiz', data),
  generateFollowUp: (data) =>
    api.post('/ai/generate-plan-accion', data),
};

// Servicios de health check
export const healthService = {
  check: () => api.get('/health'),
};

export default api;
