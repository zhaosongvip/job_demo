import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import PostEditor from './components/PostEditor';
import PostCreate from './components/PostCreate';
import { useUser } from './context/UserContext';

// 需要身份验证的路由
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  
  // 正在加载时显示加载状态
  if (loading) {
    return <div>加载中...</div>;
  }
  
  // 未登录则重定向到登录页
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="posts/:id" element={<PostDetail />} />
        <Route path="posts/create" element={<Navigate to="/create-post" replace />} />
        <Route 
          path="create-post" 
          element={
            <ProtectedRoute>
              <PostCreate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="edit-post/:id" 
          element={
            <ProtectedRoute>
              <PostEditor />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 