import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import PostList from '../components/post/PostList';
import PostService from '../services/post';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await PostService.getAllPosts(page);
      setPosts(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('获取文章列表失败:', err);
      setError('获取文章列表失败，请稍后重试');
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