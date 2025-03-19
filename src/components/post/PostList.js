import React from 'react';
import { Grid, Typography, Box, Pagination } from '@mui/material';
import PostCard from './PostCard';

function PostList({ posts, totalPages, currentPage, onPageChange }) {
  if (!posts || posts.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">暂无文章</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>
      
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={currentPage + 1} 
            onChange={(e, page) => onPageChange(page - 1)}
            color="primary" 
          />
        </Box>
      )}
    </Box>
  );
}

export default PostList; 
 