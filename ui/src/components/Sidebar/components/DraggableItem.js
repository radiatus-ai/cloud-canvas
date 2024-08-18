import { Paper, styled } from '@mui/material';

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

export default DraggableItem;
