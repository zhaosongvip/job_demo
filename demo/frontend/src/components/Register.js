import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      const requestData = {
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
        email: values.email
      };
      
      console.log('发送注册请求数据:', JSON.stringify(requestData));
      
      const response = await axios.post(
        'http://localhost:8080/api/auth/register', 
        requestData, 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('注册响应:', response);
      localStorage.setItem('token', response.data.token);
      message.success('注册成功！');
      navigate('/');
    } catch (error) {
      console.error('注册错误:', error);
      
      let errorMessage = '注册失败';
      if (error.response) {
        if (error.response.data) {
          if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.confirmPassword) {
            errorMessage = error.response.data.confirmPassword;
          } else {
            errorMessage = JSON.stringify(error.response.data);
          }
        }
      } else {
        errorMessage = error.message;
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card 
        title={
          <div style={{ 
            textAlign: 'center', 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: '#1890ff'
          }}>
            注册账号
          </div>
        }
        style={{ 
          width: 400,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '8px'
        }}
      >
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名！' },
              { min: 4, message: '用户名至少4个字符！' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              style={{ borderRadius: '4px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 6, message: '密码至少6个字符！' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码"
              style={{ borderRadius: '4px' }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不匹配！'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="确认密码"
              style={{ borderRadius: '4px' }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址！' },
              { required: true, message: '请输入邮箱！' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="邮箱"
              style={{ borderRadius: '4px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ 
                width: '100%',
                borderRadius: '4px',
                background: 'linear-gradient(to right, #1890ff, #40a9ff)',
                marginBottom: '16px'
              }}
            >
              注册
            </Button>
            <div style={{ textAlign: 'center' }}>
              已有账号？ <Link to="/login" style={{ color: '#1890ff' }}>立即登录</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 