import api from './api';

export const getScore = (listingId) => api.get(`/api/compatibility/${listingId}`);
