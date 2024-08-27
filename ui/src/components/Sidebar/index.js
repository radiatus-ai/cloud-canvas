import React from 'react';
import {
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Tooltip,
  Typography,
  Box,
} from '@mui/material';
import DraggableItem from './components/DraggableItem';
import useSidebarData from './hooks/useSidebarData';

const Sidebar = () => {
  const { packages, isLoading, error } = useSidebarData();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        background:
          'linear-gradient(45deg, #1a0033, #4b0082, #0074D9, #7FDBFF)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        '@keyframes gradient': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
      }}
    >
      <Box
        sx={{
          padding: '20px',
          borderRadius: '0px 0px 0 0',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            // textTransform: 'uppercase',
            letterSpacing: '2px',
            // textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          PACKAGES
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
      <List
        sx={{ padding: '16px', overflow: 'auto', height: 'calc(100% - 80px)' }}
      >
        {packages.map((pkg) => (
          <ListItem key={pkg.id} sx={{ padding: '8px 0' }}>
            <Tooltip title={`Drag to add ${pkg.name}`}>
              <DraggableItem packageData={pkg} />
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
