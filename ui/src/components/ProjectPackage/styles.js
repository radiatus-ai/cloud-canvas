import { Box } from '@mui/material';
import { styled } from '@mui/system';
import 'reactflow/dist/style.css';

export const NodeContainer = styled(Box)(({ theme, isTemp }) => ({
  padding: theme?.spacing?.(1.5) || '12px',
  border: `1px solid ${theme.palette.nodeBorder}`,
  borderRadius: theme.shape.borderRadius,
  minWidth: '180px',
  minHeight: '80px',
  position: 'relative',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  background: isTemp ? 'transparent' : theme.palette.background.paper,
}));

export const StatusContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginTop: '8px',
});
