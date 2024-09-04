import { Paper, Typography, styled } from '@mui/material';
import PropTypes from 'prop-types';
import React, { forwardRef, memo } from 'react';
import useDragOperations from '../hooks/useDragOperations';

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
    cursor: 'grabbing',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.2)',
  },
  '&:active': {
    cursor: 'grabbing',
    transform: 'translateY(0)',
  },
}));

const DraggableItem = forwardRef(({ packageData }, ref) => {
  const { handleDragStart } = useDragOperations();

  return (
    <StyledPaper ref={ref} draggable onDragStart={handleDragStart(packageData)}>
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
});

DraggableItem.displayName = 'DraggableItem';

DraggableItem.propTypes = {
  packageData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

export default memo(DraggableItem);
