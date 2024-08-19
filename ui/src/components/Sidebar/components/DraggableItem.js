import { Paper, Typography, styled } from '@mui/material';
import React from 'react';

const StyledPaper = styled(Paper)(({ theme }) => ({
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

const DraggableItem = ({ packageData }) => {
  const handleDragStart = (event) => {
    event.dataTransfer.setData('application/json', JSON.stringify(packageData));
  };

  return (
    <StyledPaper draggable onDragStart={handleDragStart}>
      <Typography variant="subtitle2">{packageData.name}</Typography>
      <Typography variant="body2" color="textSecondary">
        {packageData.type}
      </Typography>
    </StyledPaper>
  );
};

export default DraggableItem;
