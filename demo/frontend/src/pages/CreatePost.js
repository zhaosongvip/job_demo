import React from 'react';
import PostEditor from '../components/PostEditor';
import { Typography } from 'antd';

const { Title } = Typography;

const CreatePost = () => {
  return (
    <div>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        创建新文章
      </Title>
      <PostEditor />
    </div>
  );
};

export default CreatePost; 