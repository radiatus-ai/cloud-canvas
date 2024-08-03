import { Box, Container, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { apiService, setIdToken } from './apiService';
import FlowDiagram from './components/FlowDiagram';
import JsonSchemaFormTest from './components/JsonSchemaFormTest';
import Navigation from './components/Navigation';
import Projects from './components/Projects';
import theme from './theme';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on component mount
    setIsAuthenticated(apiService.isAuthenticated());
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    await setIdToken(credentialResponse.credential);
    setIsAuthenticated(true);
  };

  const handleLoginError = () => {
    console.error('Login Failed');
  };

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token_expiry');
    setIsAuthenticated(false);
  };

  return (
    <GoogleOAuthProvider clientId="988868445965-unqe5mu92nu921ev18c9fbrdhvqj21se.apps.googleusercontent.com">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {!isAuthenticated ? (
          <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to Platform
            </Typography>
            <Typography variant="body1" gutterBottom>
              Please sign in to continue
            </Typography>
            <Box mt={4}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                auto_select
              />
            </Box>
          </Container>
        ) : (
          <Router>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              <Navigation onLogout={handleLogout} />
              <Box
                component="main"
                sx={{ flexGrow: 1, p: 0, overflow: 'hidden' }}
              >
                <Routes>
                  <Route path="/" element={<Projects />} />
                  <Route path="/form" element={<JsonSchemaFormTest />} />
                  <Route path="/flow/:projectId" element={<FlowDiagram />} />
                </Routes>
              </Box>
            </Box>
          </Router>
        )}
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
