import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, message, Select, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useUser } from '../context/UserContext';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

const PostCreate = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState({ tags: [], title: '' });
  const [loadingAI, setLoadingAI] = useState({
    title: false,
    tags: false,
    summary: false,
    content: false
  });
  
  const navigate = useNavigate();
  const { user } = useUser();
  
  // 内容有效性检查 - 最少需要50个字符才能启用AI功能
  const isContentValid = () => {
    return content && content.replace(/<[^>]*>/g, '').trim().length >= 50;
  };

  const handleGenerateAITitle = async () => {
    try {
      if (!isContentValid()) {
        message.warning('请先输入足够的内容以获取AI标题建议');
        return;
      }
      
      setLoadingAI({...loadingAI, title: true});
      
      const response = await axios.post('http://localhost:8080/api/ai/title', { content }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data) {
        // 更新AI建议并直接应用
        setAiSuggestions({...aiSuggestions, title: response.data});
        form.setFieldsValue({ title: response.data });
        message.success('AI标题已应用');
      }
    } catch (error) {
      console.error('获取AI标题失败', error);
      message.error('获取AI标题失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingAI({...loadingAI, title: false});
    }
  };

  const handleGenerateAITags = async () => {
    try {
      if (!isContentValid()) {
        message.warning('请先输入足够的内容以获取AI标签建议');
        return;
      }
      
      setLoadingAI({...loadingAI, tags: true});
      
      const response = await axios.post('http://localhost:8080/api/ai/tags', { content }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // 确保tags始终是数组
      const tags = Array.isArray(response.data) ? response.data : [];
      
      // 更新AI建议并直接应用
      setAiSuggestions({...aiSuggestions, tags: tags});
      form.setFieldsValue({ tags: tags });
      message.success('AI标签已应用');
      
    } catch (error) {
      console.error('获取AI标签失败', error);
      message.error('获取AI标签失败: ' + (error.response?.data?.message || error.message));
      // 确保错误时也保持tags为数组
      setAiSuggestions({...aiSuggestions, tags: []});
    } finally {
      setLoadingAI({...loadingAI, tags: false});
    }
  };

  const handleGenerateSummary = async () => {
    try {
      if (!isContentValid()) {
        message.warning('请先输入足够的内容以生成摘要');
        return;
      }
      
      setLoadingAI({...loadingAI, summary: true});

      const response = await axios.post('http://localhost:8080/api/ai/summary', { content }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data) {
        form.setFieldsValue({ summary: response.data });
        message.success('AI摘要已生成');
      }
    } catch (error) {
      console.error('生成摘要失败', error);
      message.error('生成摘要失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingAI({...loadingAI, summary: false});
    }
  };
  
  const handleOptimizeContent = async () => {
    try {
      if (!isContentValid()) {
        message.warning('请先输入足够的内容以进行优化');
        return;
      }
      
      setLoadingAI({...loadingAI, content: true});
      
      const response = await axios.post('http://localhost:8080/api/ai/optimize', { content }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data) {
        setContent(response.data);
        message.success('文章内容已优化');
      }
    } catch (error) {
      console.error('优化内容失败', error);
      message.error('优化内容失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingAI({...loadingAI, content: false});
    }
  };

  const handleSubmit = async (values) => {
    if (!user) {
      message.error('请先登录');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      // 准备提交数据
      const postData = {
        title: values.title,
        content: content,
        summary: values.summary,
        tags: values.tags,
        // 其他可能的字段如coverImage等
      };
      
      // 发送请求
      const response = await axios.post('http://localhost:8080/api/posts', postData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      message.success('文章发布成功！');
      // 导航到新创建的文章详情页
      navigate(`/posts/${response.data.id}`);
    } catch (error) {
      console.error('发布文章失败', error);
      message.error('发布文章失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card title="创建新文章" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            title: '',
            summary: '',
            tags: []
          }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="标题"
                rules={[{ required: true, message: '请输入文章标题' }]}
              >
                <Input placeholder="输入文章标题" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button 
                onClick={handleGenerateAITitle} 
                style={{ marginTop: 32 }}
                disabled={!isContentValid()}
                loading={loadingAI.title}
              >
                生成AI标题
              </Button>
            </Col>
          </Row>

          <Row style={{ marginBottom: '10px' }}>
            <Col span={24}>
              <Form.Item label="内容">
                <ReactQuill 
                  theme="snow" 
                  value={content} 
                  onChange={setContent} 
                  modules={modules}
                  style={{ height: '300px', marginBottom: '50px' }}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row style={{ marginBottom: '20px' }}>
            <Col span={24}>
              <Button 
                onClick={handleOptimizeContent} 
                disabled={!isContentValid()}
                loading={loadingAI.content}
              >
                优化内容
              </Button>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="summary"
                label="摘要"
                rules={[{ required: true, message: '请输入文章摘要' }]}
              >
                <TextArea rows={4} placeholder="输入文章摘要" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button 
                onClick={handleGenerateSummary} 
                style={{ marginTop: 32 }}
                disabled={!isContentValid()}
                loading={loadingAI.summary}
              >
                生成摘要
              </Button>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="tags"
                label="标签"
                rules={[{ required: true, message: '请至少选择一个标签' }]}
              >
                <Select 
                  mode="tags" 
                  style={{ width: '100%' }} 
                  placeholder="添加标签"
                  tokenSeparators={[',']}
                >
                  {/* 确保aiSuggestions.tags是数组 */}
                  {Array.isArray(aiSuggestions.tags) && aiSuggestions.tags.map(tag => (
                    <Option key={tag} value={tag}>{tag}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button 
                onClick={handleGenerateAITags} 
                style={{ marginTop: 32 }}
                disabled={!isContentValid()}
                loading={loadingAI.tags}
              >
                生成AI标签
              </Button>
            </Col>
          </Row>

          {aiSuggestions.title && (
            <Row style={{ marginBottom: 20 }}>
              <Col span={24}>
                <Card size="small" title="AI建议的标题">
                  {aiSuggestions.title}
                </Card>
              </Col>
            </Row>
          )}

          {Array.isArray(aiSuggestions.tags) && aiSuggestions.tags.length > 0 && (
            <Row style={{ marginBottom: 20 }}>
              <Col span={24}>
                <Card size="small" title="AI建议的标签">
                  {aiSuggestions.tags.map(tag => (
                    <Tag key={tag} color="blue">{tag}</Tag>
                  ))}
                </Card>
              </Col>
            </Row>
          )}

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

export default PostCreate; 