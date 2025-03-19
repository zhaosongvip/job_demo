import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppHeader from './Header';

const { Content, Footer } = AntLayout;

const Layout = () => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 'calc(100vh - 184px)' }}>
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        博客系统 ©{new Date().getFullYear()} Created by Your Name
      </Footer>
    </AntLayout>
  );
};

export default Layout; 