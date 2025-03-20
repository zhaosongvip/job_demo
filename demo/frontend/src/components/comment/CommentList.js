import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Divider } from '@mui/material';
import { formatDate } from '../../utils/formatDate';

function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p>暂无评论</p>;
  }
  
  return (
    <List>
      {comments.map((comment, index) => (
        <React.Fragment key={comment.id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src={comment.user?.avatar} alt={comment.user?.username}>
                {comment.user?.username?.[0]?.toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography component="span" variant="subtitle2">
                  {comment.user?.username}
                </Typography>
              }
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                    sx={{ display: 'block', my: 1 }}
                  >
                    {comment.content}
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    color="textSecondary"
                  >
                    {formatDate(comment.createdAt)}
                  </Typography>
                </>
              }
            />
          </ListItem>
          {index < comments.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
}

export default CommentList; 