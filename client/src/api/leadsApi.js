import axios from 'axios';

// In production, direct requests to the deployed backend on Render. In development, use Vite's local proxy.
const BACKEND_URL = import.meta.env.PROD
  ? 'https://your-backend-api.onrender.com' // Replace with your Render URL
  : '';

const API_BASE = `${BACKEND_URL}/api/leads`;
const AUTH_BASE = `${BACKEND_URL}/api/auth`;

// Request interceptor to attach JWT token to all requests automatically
axios.interceptors.request.use(
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

/**
 * Authentication APIs
 */
export const loginUser = async (credentials) => {
  const response = await axios.post(`${AUTH_BASE}/login`, credentials);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await axios.post(`${AUTH_BASE}/register`, data);
  return response.data;
};

export const getMyProfile = async () => {
  const response = await axios.get(`${AUTH_BASE}/me`);
  return response.data;
};

export const updateMyProfile = async (data) => {
  const response = await axios.put(`${AUTH_BASE}/profile`, data);
  return response.data;
};

/**
 * Lead CRUD APIs
 */
export const getLeads = async (params = {}) => {
  const response = await axios.get(API_BASE, { params });
  return response.data;
};

export const getLeadById = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

export const createLead = async (leadData) => {
  const response = await axios.post(API_BASE, leadData);
  return response.data;
};

export const updateLead = async (id, leadData) => {
  const response = await axios.put(`${API_BASE}/${id}`, leadData);
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};

export const getLeadStats = async () => {
  const response = await axios.get(`${API_BASE}/stats`);
  return response.data;
};
