import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

export const pollAPI = {
  getAllPolls: () => api.get('/polls'),
  getPollById: (id) => api.get(`/polls/${id}`),
  createPoll: (data) => api.post('/polls', data),
  deletePoll: (id) => api.delete(`/polls/${id}`),
  addOptionToPoll: (pollId, optionData) => api.post(`/polls/${pollId}/options`, optionData),
  vote: (pollId, optionId, userId) => api.post(`/polls/${pollId}/vote`, null, {
    params: { optionId, userId }
  }),
  getUserVotes: (userId) => api.get(`/polls/user-votes/${userId}`),
  getPollResults: (pollId) => api.get(`/polls/${pollId}/results`),
};

export default api;