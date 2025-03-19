import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AIAssistant from './AIAssistant';
import api from '../services/api';

const { TextArea } = Input;

const PostEditor = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAIUpdate = (aiContent, type) => {
    switch (type) {
      case 'summary':
        form.setFieldsValue({ summary: aiContent });
        break;
      case 'title':
        form.setFieldsValue({ title: aiContent });
        break;
      case 'improve':
        form.setFieldsValue({ content: aiContent });
        setContent(aiContent);
        break;
      case 'tags':
        form.setFieldsValue({ tags: aiContent });
        break;
      default:
        break;
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await api.post('/posts', {
        ...values,
        tags: values.tags.split(',').map(tag => tag.trim())
      });
      message.success('文章发布成功！');
      navigate(`/posts/${response.data.id}`);
    } catch (error) {
      message.error('发布失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
      <Card 
        title={
          <div style={{ textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold' }}>
            写文章
          </div>
        }
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <AIAssistant content={content} onUpdate={handleAIUpdate} />
        
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          style={{ marginTop: '20px' }}
        >
          <Form.Item 
            label="标题" 
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" />
          </Form.Item>
          
          <Form.Item 
            label="内容" 
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="请输入文章内容"
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Item>
          
          <Form.Item 
            label="标签" 
            name="tags"
            rules={[{ required: true, message: '请输入文章标签' }]}
          >
            <Input placeholder="文章标签，用逗号分隔" />
          </Form.Item>
          
          <Form.Item 
            label="摘要" 
            name="summary"
            rules={[{ required: true, message: '请输入文章摘要' }]}
          >
            <TextArea rows={3} placeholder="文章摘要" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              发布文章
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PostEditor; 