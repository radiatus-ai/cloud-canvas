import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import React, { useEffect, useState } from 'react';

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  width: '80%',
  maxWidth: 800,
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ModalBody = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  overflowY: 'auto',
  minHeight: 300,
}));

const LogContent = styled(Typography)(({ theme }) => ({
  whiteSpace: 'pre-wrap',
  fontFamily: 'monospace',
  fontSize: '0.875rem',
}));

const LoadingWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
}));

const DeploymentLogsModal = ({ isOpen, onClose, logs, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate loading delay
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, logs]);

  const handleRefresh = () => {
    setIsLoading(true);
    onRefresh();
  };

  return (
    <StyledModal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="deployment-logs-modal-title"
    >
      <ModalContent>
        <ModalHeader>
          <Typography variant="h6" id="deployment-logs-modal-title">
            Deployment Logs
          </Typography>
          <Box>
            <IconButton onClick={handleRefresh} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <LoadingWrapper>
              <CircularProgress />
            </LoadingWrapper>
          ) : logs ? (
            <LogContent>{logs}</LogContent>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No logs available.
            </Typography>
          )}
        </ModalBody>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </Box>
      </ModalContent>
    </StyledModal>
  );
};

export default DeploymentLogsModal;
