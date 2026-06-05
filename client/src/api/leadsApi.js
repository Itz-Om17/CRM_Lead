import axios from 'axios';

const API_BASE = '/api/leads';

/**
 * Fetch leads list with optional query params (search, status, sortBy, order, page, limit)
 */
export const getLeads = async (params = {}) => {
  const response = await axios.get(API_BASE, { params });
  return response.data;
};

/**
 * Fetch a single lead by its ID
 */
export const getLeadById = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

/**
 * Create a new lead
 */
export const createLead = async (leadData) => {
  const response = await axios.post(API_BASE, leadData);
  return response.data;
};

/**
 * Update an existing lead by ID
 */
export const updateLead = async (id, leadData) => {
  const response = await axios.put(`${API_BASE}/${id}`, leadData);
  return response.data;
};

/**
 * Delete a lead by ID
 */
export const deleteLead = async (id) => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};

/**
 * Get lead statistics grouped by status
 */
export const getLeadStats = async () => {
  const response = await axios.get(`${API_BASE}/stats`);
  return response.data;
};
