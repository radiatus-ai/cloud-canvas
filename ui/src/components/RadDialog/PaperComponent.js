import { Paper, useTheme } from '@mui/material';
import React from 'react';

const PaperComponent = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <Paper
      {...props}
      sx={{
        background: theme.palette.background.paper,
      }}
    >
      {children}
    </Paper>
  );
};

export default PaperComponent;
