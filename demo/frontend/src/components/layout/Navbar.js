import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          博客系统
        </Link>
        
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            <Link to="/posts/create" style={{ color: 'inherit' }}>
              创建文章
            </Link>
          </Button>
          {/* 其他导航项... */}
        </Space>
      </div>
    </nav>
  );
};

export default Navbar; 