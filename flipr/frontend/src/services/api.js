import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects
export const getProjects = () => api.get('/api/projects');
export const addProject = (formData) => api.post('/api/projects', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Clients
export const getClients = () => api.get('/api/clients');
export const addClient = (formData) => api.post('/api/clients', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Contacts
export const getContacts = () => api.get('/api/contacts');
export const submitContact = (data) => api.post('/api/contacts', data);

// Newsletter
export const getNewsletterSubscriptions = () => api.get('/api/newsletter');
export const subscribeNewsletter = (data) => api.post('/api/newsletter', data);

export default api;

