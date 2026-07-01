import api from './api';

export const getListings = (params) => api.get('/api/listings', { params });
export const getListingById = (id) => api.get(`/api/listings/${id}`);
export const createListing = (data) => api.post('/api/listings', data);
export const updateListing = (id, data) => api.put(`/api/listings/${id}`, data);
export const markListingAsFilled = (id) => api.patch(`/api/listings/${id}/fill`);
export const deleteListing = (id) => api.delete(`/api/listings/${id}`);
