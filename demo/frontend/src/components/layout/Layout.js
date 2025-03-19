import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import Footer from './Footer';

function Layout() {
  const isAuthenticated = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ 
            flexGrow: 1, 
            textDecoration: 'none',
            color: 'inherit'
          }}>
            博客系统
          </Typography>
          
          {isAuthenticated ? (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/posts/create"
                sx={{ mr: 2 }}
              >
                写文章
              </Button>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                {currentUser?.username}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                退出
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ mr: 1 }}
              >
                登录
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/register"
              >
                注册
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}

export default Layout; 