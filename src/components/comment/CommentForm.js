import React, { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import CommentService from '../../services/comment';

function CommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('评论内容不能为空');
      return;
    }

    try {
      setLoading(true);
      const newComment = await CommentService.createComment(postId, content);
      setContent('');
      setError('');
      onCommentAdded(newComment);
    } catch (err) {
      setError('发布评论失败，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        fullWidth
        multiline
        rows={4}
        label="发表评论"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mb: 2 }}
        disabled={loading}
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="primary"
        disabled={loading}
      >
        {loading ? '提交中...' : '提交评论'}
      </Button>
    </Box>
  );
}

export default CommentForm; 