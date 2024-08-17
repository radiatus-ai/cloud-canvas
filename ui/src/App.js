import { Box, Container, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthenticationComponent from './components/Authentication';
import FlowDiagram from './components/FlowDiagram/index';
import JsonSchemaFormTest from './components/JsonSchemaFormTest';
import Navigation from './components/Navigation';
import Projects from './components/Projects';
import { useAuth } from './contexts/Auth';
import theme from './theme';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { token, login, logout } = useAuth();

  useEffect(() => {
    // Check authentication status on component mount
    // setIsAuthenticated(apiService.isAuthenticated());
  }, []);

  // const handleLoginSuccess = async (credentialResponse) => {
  //   await setIdToken(credentialResponse.credential);
  //   setIsAuthenticated(true);
  // };

  const onLogin = async (decodedToken, authToken) => {
    // const testGoogleLogin = async function(googleToken) {
    const apiUrl = 'http://localhost:8080'; // Adjust this to your API's URL
    const endpoint = '/login/google';

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: authToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      login(data.user, data.token);
      console.log('Login successful:', data);

      // You can handle the successful login here, e.g., storing the token
      // localStorage.setItem('authToken', data.token);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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
    <GoogleOAuthProvider clientId="1018921851541-kja9q7h1e3f1ah00c1v0pifu9n3mqbj8.apps.googleusercontent.com">
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
              {/* <GoogleLogin
                onSuccess={onLogin}
                onError={handleLoginError}
                auto_select
              /> */}
              <AuthenticationComponent
                onLogin={onLogin}
                onError={handleLoginError}
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
              <Navigation
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
              />
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
