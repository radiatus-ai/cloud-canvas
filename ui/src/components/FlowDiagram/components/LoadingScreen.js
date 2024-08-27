import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading infrastructure data...
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Please wait while we fetch your project information.
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
