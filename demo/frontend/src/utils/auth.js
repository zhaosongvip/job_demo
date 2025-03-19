export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  // 如果 token 已经包含 Bearer 前缀，直接返回
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
};

export const setAuthToken = (token) => {
  if (!token) {
    localStorage.removeItem('token');
    return;
  }
  // 如果 token 已经包含 Bearer 前缀，直接存储
  localStorage.setItem('token', token);
}; 