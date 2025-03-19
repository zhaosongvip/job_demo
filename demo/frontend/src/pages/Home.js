import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress, Button } from '@mui/material';
import PostList from '../components/post/PostList';
import api from '../services/api';
import { Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const isAuthenticated = localStorage.getItem('token');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts?page=${page}&size=10`);
      setPosts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('获取文章列表失败');
      console.error('获取文章列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        最新文章
      </Typography>

      {isAuthenticated && (
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/posts/create"
          sx={{ mb: 3 }}
        >
          写文章
        </Button>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ py: 2 }}>
          {error}
        </Typography>
      ) : (
        <PostList 
          posts={posts} 
          totalPages={totalPages} 
          currentPage={page} 
          onPageChange={handlePageChange} 
        />
      )}
    </Box>
  );
}

export default Home; 