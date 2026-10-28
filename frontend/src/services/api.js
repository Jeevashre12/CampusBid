import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusbid_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function getHealth() {
  const { data } = await api.get('/health');
  return data;
}

export async function getListings(params = {}) {
  const { data } = await api.get('/listings', { params });
  return data;
}

export default api;

