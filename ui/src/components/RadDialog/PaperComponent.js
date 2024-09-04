import { Paper, useTheme } from '@mui/material';
import React, { memo } from 'react';

const PaperComponent = memo(({ children, ...props }) => {
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
});

export default PaperComponent;
