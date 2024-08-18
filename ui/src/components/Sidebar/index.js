import {
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import DraggableItem from './components/DraggableItem';
import useSidebarData from './hooks/useSidebarData';

const Sidebar = () => {
  const { packages, isLoading, error } = useSidebarData();

  if (isLoading) {
    return (
      <div>
        <CircularProgress size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="subtitle1">Available Packages</Typography>
      <Divider />
      <List>
        {packages.map((pkg) => (
          <ListItem key={pkg.id}>
            <Tooltip title={`Drag to add ${pkg.name}`}>
              <DraggableItem packageData={pkg} />
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
