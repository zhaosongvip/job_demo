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
        <Typography variant="body2" color="text.secondary" gutterBottom>
          作者：{post.author?.username} | 发布时间：{formatDate(post.createdAt)}
        </Typography>
        <Typography variant="body1" sx={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {post.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Button 
            component={RouterLink} 
            to={`/posts/${post.id}`}
            color="primary"
          >
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