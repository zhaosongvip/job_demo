import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RichTextEditor from '../components/editor/RichTextEditor';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError('请填写所有字段');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/posts', { title, content });
      navigate(`/posts/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || '创建文章失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        创建文章
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
          disabled={loading}
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <RichTextEditor
            value={content}
            onChange={setContent}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? '发布中...' : '发布文章'}
        </Button>
      </Box>
    </Paper>
  );
}

export default CreatePost; 