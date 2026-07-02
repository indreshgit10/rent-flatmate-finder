import api from './api';

export const sendInterest = (listingId) => api.post('/api/interests', { listingId });
export const getSentInterests = (params) => api.get('/api/interests/sent', { params });
export const getReceivedInterests = (params) => api.get('/api/interests/received', { params });
export const acceptInterest = (id) => api.patch(`/api/interests/${id}/accept`);
export const declineInterest = (id) => api.patch(`/api/interests/${id}/decline`);
