import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Paper, Divider, Button, CircularProgress, Alert, Pagination } from '@mui/material';
import api from '../services/api';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';
import { formatDate } from '../utils/formatDate';
import RichTextEditor from '../components/editor/RichTextEditor';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
    } catch (err) {
      setError('获取文章详情失败');
      console.error('获取文章详情失败:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/posts/${id}/comments`, {
        params: {
          page: page - 1,
          size: 10
        }
      });
      setComments(response.data);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('获取评论失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id, page]);

  const handleDelete = async () => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        await api.delete(`/posts/${id}`);
        navigate('/');
      } catch (err) {
        setError('删除文章失败');
      }
    }
  };

  const handleCommentSubmit = async (comment) => {
    try {
      await api.post(`/posts/${id}/comments`, comment);
      // 重新加载第一页评论
      setPage(1);
      fetchComments();
    } catch (err) {
      setError(err.response?.data?.message || '发表评论失败');
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
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

  if (!post) {
    return null;
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {post.title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        作者：{post.author?.username} | 发布时间：{formatDate(post.createdAt)}
        {post.updatedAt !== post.createdAt && ` | 更新时间：${formatDate(post.updatedAt)}`}
      </Typography>

      {currentUser?.id === post.author?.id && (
        <Box sx={{ mt: 2, mb: 3 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mr: 1 }}
            onClick={() => navigate(`/posts/${id}/edit`)}
          >
            编辑
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            onClick={handleDelete}
          >
            删除
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 4, mb: 4 }}>
        <Box
          className="ql-editor"
          sx={{
            '& p': { my: 1 },
            '& h1, & h2, & h3, & h4, & h5, & h6': { my: 2 },
            '& img': { maxWidth: '100%', height: 'auto' },
            '& ul, & ol': { my: 1, pl: 4 },
            '& blockquote': {
              borderLeft: '4px solid #ccc',
              pl: 2,
              my: 2,
              color: 'text.secondary'
            },
            '& pre': {
              backgroundColor: '#f8f9fa',
              p: 2,
              borderRadius: 1,
              overflowX: 'auto'
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }
          }}
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
      </Box>

      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h6" gutterBottom>
        评论
      </Typography>

      {currentUser ? (
        <CommentForm 
          postId={id}
          onSubmit={handleCommentSubmit}
        />
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          请<Button color="primary" onClick={() => navigate('/login')}>登录</Button>后发表评论
        </Alert>
      )}
      
      <Box sx={{ mt: 2 }}>
        <CommentList comments={comments} />
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default PostDetail; 