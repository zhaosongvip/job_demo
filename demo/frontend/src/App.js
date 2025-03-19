import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppRoutes from './routes';
import 'antd/dist/antd.css';
import { UserProvider } from './context/UserContext';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <UserProvider>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppRoutes />
        </ThemeProvider>
      </Router>
    </UserProvider>
  );
}

export default App;
