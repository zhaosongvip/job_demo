import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Divider } from '@mui/material';
import { formatDate } from '../../utils/formatDate';

function CommentList({ comments }) {
  // 检查comments是否是分页数据
  const commentList = comments?.content || [];

  if (!commentList.length) {
    return (
      <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
        暂无评论
      </Typography>
    );
  }

  return (
    <List>
      {commentList.map((comment, index) => (
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
          {index < commentList.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
}

export default CommentList; 