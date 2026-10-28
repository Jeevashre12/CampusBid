import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusbid_token');
  if (token) config.headers.Authorization = ['Bearer', token].join(' ');
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

export async function getListing(id) {
  const { data } = await api.get(`/listings/${id}`);
  return data;
}

export async function placeBid(id, amount) {
  const { data } = await api.post(`/listings/${id}/bids`, { amount });
  return data;
}

export async function decideBid(listingId, bidId, decision) {
  const { data } = await api.patch(`/listings/${listingId}/bids/${bidId}/decision`, { decision });
  return data;
}

export async function deleteListing(id) {
  const { data } = await api.delete(`/listings/${id}`);
  return data;
}

export function getMediaUrl(mediaPath) {
  if (!mediaPath) return '';
  if (/^https?:\/\//i.test(mediaPath)) return mediaPath;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  const serverUrl = apiUrl.replace(/\/api\/?$/, '');
  const normalizedPath = `/${String(mediaPath).replace(/^\/+/, '').replace(/^api\/uploads\//i, 'uploads/')}`;
  return `${serverUrl}${normalizedPath}`;
}

export default api;
