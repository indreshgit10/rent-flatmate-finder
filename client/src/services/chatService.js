import api from './api';

export const getChatMessages = (interestId) => api.get(`/api/chat/${interestId}`);
