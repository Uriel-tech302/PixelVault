import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: agrega el token JWT automáticamente a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pixelvault_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: si el backend responde 401 (token inválido o expirado), limpia sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('pixelvault_token');
      localStorage.removeItem('pixelvault_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;