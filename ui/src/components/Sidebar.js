import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Tooltip,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import apiService from '../apiService';

const SidebarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRight: `1px solid ${theme.palette.divider}`,
  width: '250px',
  height: '100%',
  overflowY: 'auto',
  backgroundColor: theme.palette.background.paper,
}));

const DraggableItem = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5),
  cursor: 'grab',
  width: '100%',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
  '&:active': {
    cursor: 'grabbing',
    transform: 'translateY(0)',
  },
}));

const Sidebar = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.fetchAllPackages();
      setPackages(data);
      setError(null);
    } catch (err) {
      setError('Failed to load packages. Please try again later.');
      console.error('Error fetching packages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onDragStart = (event, packageData) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify(packageData)
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  if (isLoading) {
    return (
      <SidebarContainer
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={24} />
      </SidebarContainer>
    );
  }

  if (error) {
    return (
      <SidebarContainer>
        <Alert severity="error" variant="outlined">
          {error}
        </Alert>
      </SidebarContainer>
    );
  }

  return (
    <SidebarContainer>
      <Typography variant="subtitle1" gutterBottom fontWeight="medium">
        Available Packages
      </Typography>
      <Typography variant="caption" color="text.secondary" paragraph>
        Drag items to the canvas on the right.
      </Typography>
      <Divider sx={{ my: 2 }} />
      <List disablePadding>
        {packages.map((pkg) => (
          <ListItem key={pkg.id} disablePadding>
            <Tooltip title={`Drag to add ${pkg.name}`} placement="right" arrow>
              <DraggableItem
                elevation={0}
                onDragStart={(event) => onDragStart(event, pkg)}
                draggable
              >
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight="medium">
                      {pkg.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {pkg.type}
                    </Typography>
                  }
                />
              </DraggableItem>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </SidebarContainer>
  );
};

export default Sidebar;
