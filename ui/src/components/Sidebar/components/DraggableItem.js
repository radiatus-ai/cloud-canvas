import React from 'react';
import { Paper, Typography, styled } from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5),
  cursor: 'grab',
  width: '100%',
  transition: 'all 0.3s ease',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.2)',
  },
  '&:active': {
    cursor: 'grabbing',
    transform: 'translateY(0)',
  },
}));

const DraggableItem = ({ packageData }) => {
  const handleDragStart = (event) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify(packageData)
    );
    event.dataTransfer.setData('text/plain', JSON.stringify(packageData));
  };

  return (
    <StyledPaper draggable onDragStart={handleDragStart}>
      <Typography
        variant="subtitle2"
        sx={{ color: 'white', fontWeight: 'bold' }}
      >
        {packageData.name}
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
        {packageData.type}
      </Typography>
    </StyledPaper>
  );
};

export default DraggableItem;
