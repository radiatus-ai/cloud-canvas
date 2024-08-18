import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, Paper, Typography } from '@mui/material';
import React from 'react';

const ErrorFallback = ({ error, resetError }) => {
  const handleReportError = () => {
    // Sentry.captureException(error);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          We're sorry for the inconvenience. The error has been logged and we'll
          look into it.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Error: {error.message}
        </Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={resetError}
            sx={{ mr: 1 }}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReportError}
          >
            Report Error
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ErrorFallback;
