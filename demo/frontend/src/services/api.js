import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// 请求拦截器添加 token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const aiApi = {
  generateSummary: (content) => api.post('/ai/summary', content),
  suggestTags: (content) => api.post('/ai/tags', content),
  improveWriting: (content) => api.post('/ai/improve', content),
  generateTitle: (content) => api.post('/ai/title', content),
  recommendPosts: (content) => api.post('/ai/recommend', content)
};

export default api; 