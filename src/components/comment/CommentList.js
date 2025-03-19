import React from 'react';
import { List, ListItem, ListItemText, Typography, Divider, Box, Avatar } from '@mui/material';
import { formatDate } from '../../utils/formatDate';

function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="body2" color="text.secondary">暂无评论</Typography>
      </Box>
    );
  }

  return (
    <List>
      {comments.map((comment, index) => (
        <React.Fragment key={comment.id}>
          <ListItem alignItems="flex-start" sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', width: '100%' }}>
              <Avatar sx={{ mr: 2 }}>{comment.user?.username?.charAt(0).toUpperCase()}</Avatar>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" component="span">
                    {comment.user?.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(comment.createdAt)}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {comment.content}
                </Typography>
              </Box>
            </Box>
          </ListItem>
          {index < comments.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
}

export default CommentList; 