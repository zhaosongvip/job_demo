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

export const authApi = {
  register: (userData) => {
    // 确保所有字段都被正确传递
    const requestData = {
      username: userData.username,
      password: userData.password,
      confirmPassword: userData.confirmPassword,  // 确保这个字段被包含
      email: userData.email
    };
    console.log('注册请求数据:', requestData); // 添加日志
    return api.post('/auth/register', requestData);
  },
  login: (credentials) => api.post('/auth/login', credentials)
};

export const aiApi = {
  generateSummary: (content) => api.post('/ai/summary', content),
  suggestTags: (content) => api.post('/ai/tags', content),
  improveWriting: (content) => api.post('/ai/improve', content),
  generateTitle: (content) => api.post('/ai/title', content),
  recommendPosts: (content) => api.post('/ai/recommend', content)
};

export default api; 