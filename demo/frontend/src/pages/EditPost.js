import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Typography, Box, Paper, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import RichTextEditor from '../components/editor/RichTextEditor';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const editorRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      const post = response.data;

      // 检查是否是文章作者
      if (post.author.id !== currentUser?.id) {
        navigate(`/posts/${id}`);
        return;
      }

      setTitle(post.title);
      setContent(post.content || '');
    } catch (err) {
      console.error('获取文章失败:', err);
      if (err.response?.status === 404) {
        setError('文章不存在');
      } else {
        setError('获取文章失败');
      }
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError('请填写所有字段');
      return;
    }

    try {
      setSaving(true);
      await api.put(`/posts/${id}`, { title, content });
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error('更新文章失败:', err);
      setError(err.response?.data?.message || '更新文章失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        编辑文章
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
          disabled={saving}
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <RichTextEditor
            ref={editorRef}
            value={content}
            onChange={setContent}
          />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={saving}
          >
            {saving ? '保存中...' : '保存修改'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(`/posts/${id}`)}
            disabled={saving}
          >
            取消
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default EditPost; 