import { Box, CircularProgress, Typography } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';

const AuthenticationComponent = ({ onLogin, onError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const decodedToken = jwtDecode(credentialResponse.credential);
      await onLogin(decodedToken, credentialResponse.credential);
    } catch (error) {
      console.error('Google login error:', error);
      onError('Failed to process Google login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Google Login Failed');
    onError('Google login failed. Please try again.');
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography variant="h6" gutterBottom>
        Sign in to Cloud Canvas
      </Typography>
      {isLoading ? (
        <CircularProgress size={24} />
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
          useOneTap
          theme="filled_blue"
          shape="pill"
          text="continue_with"
        />
      )}
    </Box>
  );
};

export default AuthenticationComponent;
