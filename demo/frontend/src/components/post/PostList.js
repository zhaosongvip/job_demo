import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, Typography, Box, Divider, Pagination } from '@mui/material';
import { formatDate } from '../../utils/formatDate';

function PostList({ posts, totalPages, currentPage, onPageChange }) {
  // 创建一个函数来获取纯文本内容的预览
  const getContentPreview = (htmlContent, maxLength = 200) => {
    // 创建一个临时的 div 来解析 HTML
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;
    // 获取纯文本内容
    const textContent = temp.textContent || temp.innerText;
    // 截取指定长度并添加省略号
    return textContent.length > maxLength 
      ? `${textContent.substring(0, maxLength)}...` 
      : textContent;
  };

  if (!posts || posts.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
        暂无文章
      </Typography>
    );
  }

  return (
    <>
      <List>
        {posts.map((post, index) => (
          <React.Fragment key={post.id}>
            <ListItem 
              component={Link} 
              to={`/posts/${post.id}`}
              sx={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                {post.title}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                作者：{post.author?.username} | 发布时间：{formatDate(post.createdAt)}
                {post.updatedAt !== post.createdAt && ` | 更新时间：${formatDate(post.updatedAt)}`}
              </Typography>

              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  my: 1
                }}
              >
                {getContentPreview(post.content)}
              </Typography>
            </ListItem>
            {index < posts.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={(e, page) => onPageChange(page - 1)}
            color="primary"
          />
        </Box>
      )}
    </>
  );
}

export default PostList; 