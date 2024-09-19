import {
  Box,
  CircularProgress,
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import AuthenticationComponent from './components/Authentication';
import Canvas from './components/Canvas';
import Navigation from './components/Navigation';
import Projects from './components/Projects';
import Secrets from './components/Secrets';
import { useAuth } from './contexts/Auth';
import useApi from './hooks/useAPI';

const App = () => {
  const { user, token, login, logout, getValidToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const theme = useTheme();
  const api = useApi();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const validToken = await getValidToken();
        setIsLoading(false);
        if (!validToken) {
          // If no valid token, user needs to log in
          setAuthError(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthError('Failed to initialize authentication. Please try again.');
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [getValidToken]);

  const handleLogin = useCallback(
    async (decodedToken, authToken) => {
      setIsLoading(true);
      try {
        const response = await fetch('https://auth.dev.r7ai.net/login/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: authToken }),
          credentials: 'include', // Important for cookies
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        await login(data.user, data.token);
        setAuthError(null);
      } catch (error) {
        console.error('Login error:', error);
        setAuthError('Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  const handleLoginError = useCallback((error) => {
    console.error('Login Failed:', error);
    setAuthError('Login failed. Please try again.');
  }, []);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!token) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            CLOUD CANVAS
          </Typography>
          {authError && (
            <Typography variant="body2" color="error" gutterBottom>
              {authError}
            </Typography>
          )}
          <Box mt={4}>
            <AuthenticationComponent
              onLogin={handleLogin}
              onError={handleLoginError}
            />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Router>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Navigation onLogout={logout} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            overflow: 'hidden',
            ...(theme.palette.mode === 'light' && {
              backgroundImage: 'url("/noise-220.png")',
              backgroundSize: '220px 220px',
              backgroundRepeat: 'repeat',
              backgroundPosition: '0 0',
            }),
          }}
        >
          <Routes>
            <Route path="/" element={<Projects />} />
            <Route path="/secrets" element={<Secrets />} />
            <Route path="/canvas/:projectId" element={<Canvas />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
