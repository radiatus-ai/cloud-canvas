import { Button, CircularProgress } from '@mui/material';
import React from 'react';

const LoadingButton = ({ loading, children, ...props }) => (
  <Button {...props} disabled={loading}>
    {loading ? <CircularProgress size={24} /> : children}
  </Button>
);

export default LoadingButton;
