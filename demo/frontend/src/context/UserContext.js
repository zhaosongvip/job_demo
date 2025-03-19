import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 创建上下文
const UserContext = createContext();

// 创建提供者组件
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 添加用于检查token有效性的函数
  const verifyToken = async (token) => {
    try {
      const response = await axios.get('http://localhost:8080/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return { valid: true, user: response.data };
    } catch (error) {
      console.error('Token验证失败:', error);
      return { valid: false };
    }
  };

  // 应用加载时自动恢复用户会话
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // 从本地存储中获取token
        const token = localStorage.getItem('token');
        
        if (token) {
          console.log('检测到存储的token，尝试恢复会话');
          
          // 设置axios默认headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // 从本地存储获取用户信息
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            // 尝试使用存储的用户信息
            setUser(JSON.parse(storedUser));
          }
          
          // 验证token有效性并获取最新用户信息
          const { valid, user: currentUser } = await verifyToken(token);
          
          if (valid && currentUser) {
            console.log('Token有效，已恢复用户会话');
            setUser(currentUser);
            // 更新存储的用户信息
            localStorage.setItem('user', JSON.stringify(currentUser));
          } else {
            console.log('Token无效，清除本地存储');
            // Token无效，执行登出操作
            logout();
          }
        } else {
          console.log('未检测到存储的token');
        }
      } catch (err) {
        console.error('初始化认证失败:', err);
        setError('无法恢复会话，请重新登录');
        // 出错时清理本地存储
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('发送登录请求:', credentials);
      const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
      console.log('登录响应:', response.data);
      
      const { token, user } = response.data;
      
      // 保存 token 到本地存储
      localStorage.setItem('token', token);
      
      // 确保用户对象完整
      if (!user) {
        console.error('登录响应没有包含用户信息');
        return { success: false, message: '服务器返回的用户信息不完整' };
      }
      
      // 保存用户信息到本地存储
      localStorage.setItem('user', JSON.stringify(user));
      
      // 设置axios默认headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // 更新用户状态
      setUser(user);
      console.log('用户状态已更新:', user);
      
      return { success: true };
    } catch (err) {
      console.error('登录失败:', err);
      const errorMessage = err.response?.data?.message || '登录失败，请检查您的凭据';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', userData);
      
      const { token, user } = response.data;
      
      // 保存 token 到本地存储
      localStorage.setItem('token', token);
      
      // 保存用户信息到本地存储
      localStorage.setItem('user', JSON.stringify(user));
      
      // 设置axios默认headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // 更新用户状态
      setUser(user);
      
      return { success: true };
    } catch (err) {
      console.error('注册失败:', err);
      const errorMessage = err.response?.data?.message || '注册失败';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    // 清除本地存储中的token和用户信息
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 清除axios默认headers
    delete axios.defaults.headers.common['Authorization'];
    
    // 重置用户状态
    setUser(null);
    console.log('用户已登出');
  };

  const updateUserProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put('http://localhost:8080/api/users/profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const updatedUser = response.data;
      
      // 更新本地存储中的用户信息
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // 更新用户状态
      setUser(updatedUser);
      
      return { success: true };
    } catch (err) {
      console.error('更新用户资料失败:', err);
      const errorMessage = err.response?.data?.message || '更新资料失败';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // 提供上下文值
  const contextValue = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserProfile
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// 创建自定义hook以便于组件使用上下文
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 