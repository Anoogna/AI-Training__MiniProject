import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (name, email, password, role = 'dispatcher') =>
    api.post('/auth/register', { name, email, password, role }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

export const shipmentAPI = {
  list: () => api.get('/shipments'),
  get: (id) => api.get(`/shipments/${id}`),
  track: (trackingId) => api.get(`/shipments/track/${trackingId}`),
  create: (data) => api.post('/shipments', data),
  updateStatus: (id, status, note) => api.patch(`/shipments/${id}/status`, { status, note }),
};

export const vehicleAPI = {
  list: () => api.get('/vehicles'),
  updateLocation: (id, lat, lng, status) =>
    api.patch(`/vehicles/${id}/location`, { lat, lng, status }),
};

export const deliveryAPI = {
  tasks: () => api.get('/delivery/tasks'),
  runBot: () => api.post('/delivery/bot/run'),
  assign: (taskId, vehicleId, driverId) =>
    api.post('/delivery/assign', { taskId, vehicleId, driverId }),
};

export const messageAPI = {
  list: () => api.get('/messages'),
  send: (receiverId, text) => api.post('/messages', { receiverId, text }),
  broadcast: (text) => api.post('/messages/broadcast', { text }),
  markRead: (id) => api.patch(`/messages/${id}/read`),
};

export const routeAPI = {
  list: () => api.get('/routes'),
  optimize: (shipmentId) => api.post(`/routes/optimize/${shipmentId}`),
};

export const trafficAPI = {
  alerts: () => api.get('/traffic/alerts'),
  check: () => api.post('/traffic/check'),
};

export const gateAPI = {
  logs: () => api.get('/gate/logs'),
  entry: (lane, shipmentId, vehicleId) =>
    api.post('/gate/entry', { lane, shipmentId, vehicleId }),
  exit: (lane, shipmentId, vehicleId) =>
    api.post('/gate/exit', { lane, shipmentId, vehicleId }),
};

export const warehouseAPI = {
  tasks: () => api.get('/warehouse/tasks'),
  complete: (id, location) => api.patch(`/warehouse/tasks/${id}/complete`, { location }),
  create: (shipmentId, location) => api.post('/warehouse/tasks', { shipmentId, location }),
};

export const voiceAPI = {
  process: (transcript, sessionId) => api.post('/voice/process', { transcript, sessionId }),
};

export const leadAPI = {
  demo: (data) => api.post('/leads/demo', data),
  newsletter: (email) => api.post('/leads/newsletter', { email }),
  contact: (data) => api.post('/leads/contact', data),
  list: (params) => api.get('/leads', { params }),
  update: (id, data) => api.patch(`/leads/${id}`, data),
};

export default api;
