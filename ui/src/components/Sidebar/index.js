import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { memo } from 'react';
import DraggableItem from './components/DraggableItem';
import useSidebarData from './hooks/useSidebarData';

const SidebarContainer = memo(({ children }) => (
  <Box
    sx={{
      height: '100%',
      background: 'linear-gradient(45deg, #1a0033, #4b0082, #0074D9, #7FDBFF)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite',
      '@keyframes gradient': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
      },
    }}
  >
    {children}
  </Box>
));

const Sidebar = () => {
  const { packages, isLoading, error } = useSidebarData();

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress size={24} sx={{ color: 'white' }} />
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
      <List
        sx={{ padding: '16px', overflow: 'auto', height: 'calc(100% - 80px)' }}
      >
        {packages.map((pkg) => (
          <ListItem key={pkg.id} sx={{ padding: '8px 0' }}>
            <Tooltip title={`Drag to add ${pkg.name}`}>
              <Box width="100%">
                <DraggableItem packageData={pkg} />
              </Box>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <SidebarContainer>
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
            letterSpacing: '2px',
          }}
        >
          PACKAGES
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
      {renderContent()}
    </SidebarContainer>
  );
};

export default Sidebar;
