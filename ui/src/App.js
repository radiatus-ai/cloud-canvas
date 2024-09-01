import {
  Box,
  CircularProgress,
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthenticationComponent from './components/Authentication';
import Canvas from './components/Canvas';
import JsonSchemaFormTest from './components/JsonSchemaFormTest';
import Navigation from './components/Navigation';
import Projects from './components/Projects';
import Secrets from './components/Secrets';
import { useAuth } from './contexts/Auth';

const App = () => {
  const { token, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const handleLogin = useCallback(
    async (decodedToken, authToken) => {
      setIsLoading(true);
      try {
        // todo: add env var / config to set this
        const response = await fetch(
          'https://auth-service-razsp32k5q-uc.a.run.app/login/google',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: authToken }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        login(data.user, data.token);
        console.log('Login successful:', data);
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  const handleLoginError = (error) => {
    console.error('Login Failed:', error);
  };
  // utility for using a token to upload packages, etc. todo: remove and add a hotkey to expose debug info in the UI.
  // make the debug feature feel really cool.
  console.log('token', token);

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
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome To
          </Typography>
          <Typography variant="h3" component="h1" gutterBottom>
            CLOUD CANVAS
          </Typography>
          {/* <Typography variant="body1" gutterBottom>
          Please sign in to continue
        </Typography> */}
          <Box mt={4}>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <AuthenticationComponent
                onLogin={handleLogin}
                onError={handleLoginError}
              />
            )}
          </Box>
        </Container>
      </Box>
    );
  }
  // debugger;

  return (
    <Router>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          // backgroundColor: theme.palette.primary.main,
        }}
      >
        <Navigation onLogout={logout} />
        <Box component="main" sx={{ flexGrow: 1, p: 0, overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Projects />} />
            <Route path="/secrets" element={<Secrets />} />
            <Route path="/form" element={<JsonSchemaFormTest />} />
            <Route path="/canvas/:projectId" element={<Canvas />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
