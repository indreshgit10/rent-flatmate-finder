import api from './api';

export const getProfile = () => api.get('/api/profile');
export const createProfile = (data) => api.post('/api/profile', data);
export const updateProfile = (data) => api.put('/api/profile', data);
