import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { setAuthToken } from '../utils/auth';
import { useUser } from '../context/UserContext';
import { message } from 'antd';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  
  // 获取用户之前尝试访问的页面
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止默认表单提交行为
    
    try {
      setLoading(true);
      setError(''); // 清除之前的错误信息
      
      // 手动收集表单数据
      const values = {
        username: username,
        password: password
      };
      
      console.log('提交登录数据:', values);
      const result = await login(values);
      
      if (result.success) {
        message.success('登录成功！');
        navigate(from, { replace: true }); // 使用之前存储的路径
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('登录错误:', error);
      setError(error.message || '登录失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          登录
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="用户名"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="密码"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login; 