import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';

function PostCard({ post }) {
  return (
    <Card sx={{ mb: 2, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          作者: {post.author?.username} • 发布于: {formatDate(post.createdAt)}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {post.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button size="small" component={RouterLink} to={`/posts/${post.id}`}>
            阅读全文
          </Button>
          <Typography variant="body2" color="text.secondary">
            {post.comments?.length || 0} 条评论
          </Typography>
        </Box>
      </CardActions>
    </Card>
  );
}

export default PostCard; 