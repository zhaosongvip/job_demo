import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, message, Select, Tag, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useUser } from '../context/UserContext';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

const PostEditor = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState({ tags: [], title: '' });
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  
  const { id } = useParams(); // 获取URL中的ID参数（编辑模式）
  const navigate = useNavigate();
  const { user } = useUser();

  // 判断是编辑模式还是创建模式
  const isEditMode = !!id;

  useEffect(() => {
    // 如果是编辑模式，加载文章数据
    if (isEditMode) {
      fetchPostDetails();
    } else {
      // 创建模式不需要加载文章
      setLoading(false);
    }
  }, [id]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const postData = response.data;
      setPost(postData);
      
      // 填充表单
      form.setFieldsValue({
        title: postData.title,
        summary: postData.summary,
        tags: postData.tags
      });
      setContent(postData.content);
      
    } catch (error) {
      console.error('获取文章详情失败', error);
      message.error('获取文章详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAISuggestions = async () => {
    try {
      setGeneratingSuggestions(true);
      // 只在有内容时请求AI建议
      if (!content || content.trim().length < 50) {
        message.warning('请先输入足够的内容以获取AI建议');
        return;
      }

      // 获取AI生成的标签
      const tagsResponse = await axios.post('http://localhost:8080/api/ai/tags', { content }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // 获取AI生成的标题建议
      const titleResponse = await axios.post('http://localhost:8080/api/ai/title', { content }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setAiSuggestions({
        tags: tagsResponse.data || [],
        title: titleResponse.data || ''
      });

      message.success('AI建议生成成功');
    } catch (error) {
      console.error('AI建议生成失败', error);
      message.error('AI建议生成失败');
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const handleApplyAITitle = () => {
    if (aiSuggestions.title) {
      form.setFieldsValue({ title: aiSuggestions.title });
    }
  };

  const handleApplyAITags = () => {
    if (aiSuggestions.tags && aiSuggestions.tags.length > 0) {
      form.setFieldsValue({ tags: aiSuggestions.tags });
    }
  };

  const handleGenerateSummary = async () => {
    try {
      if (!content || content.trim().length < 100) {
        message.warning('请先输入足够的内容以生成摘要');
        return;
      }

      const response = await axios.post('http://localhost:8080/api/ai/summary', { content }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data) {
        form.setFieldsValue({ summary: response.data });
      }
    } catch (error) {
      console.error('生成摘要失败', error);
      message.error('生成摘要失败');
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
      const postData = {
        ...values,
        content,
        userId: user.id
      };

      let response;
      if (isEditMode) {
        // 更新文章
        response = await axios.put(`http://localhost:8080/api/posts/${id}`, postData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        message.success('文章已更新');
      } else {
        // 创建新文章
        response = await axios.post('http://localhost:8080/api/posts', postData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        message.success('文章已发布');
      }

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

  if (loading && isEditMode) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Card title={isEditMode ? "编辑文章" : "创建新文章"} bordered={false}>
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
                onClick={handleApplyAITitle} 
                style={{ marginTop: 32 }}
                disabled={!aiSuggestions.title}
              >
                应用AI标题
              </Button>
            </Col>
          </Row>

          <Form.Item label="内容">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules}
              style={{ height: '300px', marginBottom: '50px' }}
            />
          </Form.Item>

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
                disabled={!content}
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
                  {aiSuggestions.tags.map(tag => (
                    <Option key={tag} value={tag}>{tag}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button 
                onClick={handleApplyAITags} 
                style={{ marginTop: 32 }}
                disabled={!aiSuggestions.tags || aiSuggestions.tags.length === 0}
              >
                应用AI标签
              </Button>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={24}>
              <Button 
                onClick={handleGenerateAISuggestions}
                loading={generatingSuggestions}
                disabled={!content || content.length < 50}
              >
                生成AI建议
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

          {aiSuggestions.tags && aiSuggestions.tags.length > 0 && (
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
              {isEditMode ? '更新文章' : '发布文章'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PostEditor; 