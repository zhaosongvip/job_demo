import React, { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import api from '../../services/api';

function CommentForm({ postId, onSubmit }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('请输入评论内容');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/posts/${postId}/comments`, { content });
      setContent('');
      if (onSubmit) {
        onSubmit(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || '发表评论失败');
      console.error('发表评论失败:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="写下你的评论..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? '发表中...' : '发表评论'}
      </Button>
    </Box>
  );
}

export default CommentForm; 