import { Box } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import React from 'react';

const AuthenticationComponent = ({ onLogin, onError }) => {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {/* <Typography variant="body1" gutterBottom>
        Sign in with your Google account:
      </Typography> */}
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const decodedToken = jwtDecode(credentialResponse.credential);
          onLogin(decodedToken, credentialResponse.credential);
        }}
        onError={() => {
          console.error('Login Failed');
          onError('Login failed. Please try again.');
        }}
      />
    </Box>
  );
};

export default AuthenticationComponent;
