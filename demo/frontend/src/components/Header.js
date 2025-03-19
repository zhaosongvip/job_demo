import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, PlusOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const { Header } = Layout;

const AppHeader = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  
  console.log('Header 组件中的用户状态:', user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 用户菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">个人资料</Link>
      </Menu.Item>
      <Menu.Item key="create-post" icon={<PlusOutlined />}>
        <Link to="/create-post">创建文章</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div className="logo" style={{ fontSize: '18px', fontWeight: 'bold' }}>
        <Link to="/">博客系统</Link>
      </div>
      
      <div>
        {user ? (
          <Dropdown overlay={userMenu} trigger={['click']}>
            <div style={{ cursor: 'pointer', color: '#fff' }}>
              <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
              {user.username ? user.username : JSON.stringify(user)}
            </div>
          </Dropdown>
        ) : (
          <div>
            <Button type="link" onClick={() => navigate('/login')}>
              登录
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              注册
            </Button>
          </div>
        )}
      </div>
    </Header>
  );
};

export default AppHeader; 