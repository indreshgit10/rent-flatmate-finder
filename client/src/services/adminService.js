import api from './api';

export const getUsers = (page = 1, limit = 10) => 
  api.get(`/api/admin/users?page=${page}&limit=${limit}`);

export const disableUser = (id) => 
  api.patch(`/api/admin/users/${id}/disable`);

export const enableUser = (id) => 
  api.patch(`/api/admin/users/${id}/enable`);

export const getAllListings = (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (filters.location) params.append('location', filters.location);
  return api.get(`/api/admin/listings?${params.toString()}`);
};

export const hideListing = (id) => 
  api.patch(`/api/admin/listings/${id}/hide`);

export const unhideListing = (id) => 
  api.patch(`/api/admin/listings/${id}/unhide`);

export const getPlatformStats = () => 
  api.get('/api/admin/stats');
