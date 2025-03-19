import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Paper, Divider, Button, CircularProgress, Alert } from '@mui/material';
import AuthService from '../services/auth';
import PostService from '../services/post';
import CommentService from '../services/comment';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';
import { formatDate } from '../utils/formatDate';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        const postData = await PostService.getPostById(id);
        setPost(postData);
        
        const commentsData = await CommentService.getCommentsByPostId(id);
        setComments(commentsData);
      } catch (err) {
        console.error('获取文章详情失败:', err);
        setError('获取文章详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        await PostService.deletePost(id);
        navigate('/');
      } catch (err) {
        console.error('删除文章失败:', err);
        alert('删除文章失败，请稍后重试');
      }
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!post) {
    return <Alert severity="info">文章不存在</Alert>;
  }

  const isAuthor = currentUser && post.author && currentUser.id === post.author.id;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {post.title}
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          作者: {post.author?.username} • 发布于: {formatDate(post.createdAt)}
          {post.updatedAt !== post.createdAt && ` • 更新于: ${formatDate(post.updatedAt)}`}
        </Typography>
        
        {isAuthor && (
          <Box>
            <Button 
              variant="outlined" 
              color="primary" 
              size="small" 
              sx={{ mr: 1 }}
              onClick={() => navigate(`/edit-post/${post.id}`)}
            >
              编辑
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              size="small"
              onClick={handleDelete}
            >
              删除
            </Button>
          </Box>
        )}
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 4 }}>
        {post.content}
      </Typography>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h5" gutterBottom>
        评论 ({comments.length})
      </Typography>
      
      {AuthService.isAuthenticated() ? (
        <CommentForm postId={id} onCommentAdded={handleCommentAdded} />
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          请<Button color="primary" onClick={() => navigate('/login')}>登录</Button>后发表评论
        </Alert>
      )}
      
      <CommentList comments={comments} />
    </Paper>
  );
}

export default PostDetail; 