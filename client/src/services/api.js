import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      const isAuthRequest = err.config?.url?.includes('/auth/login') || err.config?.url?.includes('/auth/register');
      if (!isAuthRequest && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me')
};

export const propertiesAPI = {
  getAll: (params) => api.get('/api/properties', { params }),
  getById: (id) => api.get(`/api/properties/${id}`),
  getMyListings: () => api.get('/api/properties/my-listings'),
  create: (data) => api.post('/api/properties', data),
  update: (id, data) => api.put(`/api/properties/${id}`, data),
  delete: (id) => api.delete(`/api/properties/${id}`)
};

export const favoritesAPI = {
  getAll: () => api.get('/api/favorites'),
  toggle: (propertyId) => api.post('/api/favorites', { propertyId }),
  check: (propertyId) => api.get(`/api/favorites/check/${propertyId}`)
};

export const inquiriesAPI = {
  create: (data) => api.post('/api/inquiries', data),
  getAll: () => api.get('/api/inquiries'),
  reply: (id, reply) => api.put(`/api/inquiries/${id}/reply`, { reply }),
  delete: (id) => api.delete(`/api/inquiries/${id}`)
};

export const adminAPI = {
  getStats: () => api.get('/api/admin/stats'),
  getUsers: () => api.get('/api/admin/users'),
  updateUser: (id, data) => api.put(`/api/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  getProperties: (params) => api.get('/api/admin/properties', { params }),
  updatePropertyStatus: (id, status) => api.put(`/api/admin/properties/${id}/status`, { status })
};

export default api;