import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { styled } from '@mui/system';
import apiService from '../../apiService';
import { blue } from '@mui/material/colors';

const StatusDot = styled('div')(({ theme, status }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: (() => {
    switch (status) {
      case 'undeployed':
        return theme.palette.grey[500];
      case 'deploying':
        return blue[500];
      case 'destroying':
        return blue[500];
      case 'deployed':
        return theme.palette.success.main;
      case 'failed':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  })(),
}));

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  maxWidth: '90%',
  maxHeight: '90%',
  display: 'flex',
  flexDirection: 'column',
}));

const ModalTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2, 2, 1),
  fontWeight: 'bold',
}));

const ModalDescription = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2, 2),
  overflowY: 'auto',
  flexGrow: 1,
}));

const NodeHeader = ({ data, projectId, updateNodeData, onOpenModal }) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleOpenStatusModal = () => {
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
  };

  const handleDeploy = async () => {
    try {
      updateNodeData({ deploy_status: 'deploying' });
      const result = await apiService.deployPackage(projectId, data.id);
      updateNodeData({ deploy_status: 'deployed', ...result });
    } catch (error) {
      console.error('Deployment failed:', error);
      updateNodeData({ deploy_status: 'failed' });
    }
  };

  const handleDestroy = async () => {
    try {
      updateNodeData({ deploy_status: 'destroying' });
      await apiService.destroyPackage(projectId, data.id);
      updateNodeData({ deploy_status: 'undeployed' });
    } catch (error) {
      console.error('Destruction failed:', error);
      updateNodeData({ deploy_status: 'failed' });
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.deletePackage(projectId, data.id);
      updateNodeData(null);
    } catch (error) {
      console.error('Deletion failed:', error);
    }
  };

  const isDeployingOrDestroying = data.deploy_status === 'deploying' || data.deploy_status === 'destroying';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 1,
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold">
        {data.label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title={`Status: ${data.deploy_status}`}>
          <StatusDot
            status={data.deploy_status}
            onClick={handleOpenStatusModal}
          />
        </Tooltip>
        <Tooltip title="Edit">
          <span>
            <IconButton
              size="small"
              onClick={onOpenModal}
              disabled={isDeployingOrDestroying}
              sx={{ ml: 0.5, p: 0.5, opacity: isDeployingOrDestroying ? 0.5 : 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        {data.deploy_status !== 'deployed' ? (
          <Tooltip title="Deploy">
            <IconButton
              size="small"
              onClick={handleDeploy}
              disabled={isDeployingOrDestroying}
              sx={{ ml: 0.5, p: 0.5, opacity: isDeployingOrDestroying ? 0.5 : 1 }}
            >
              <PlayArrowIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Destroy">
            <IconButton
              size="small"
              onClick={handleDestroy}
              disabled={isDeployingOrDestroying}
              sx={{ ml: 0.5, p: 0.5, opacity: isDeployingOrDestroying ? 0.5 : 1 }}
            >
              <StopIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Delete">
          <span>
            <IconButton
              size="small"
              onClick={handleDelete}
              disabled={isDeployingOrDestroying}
              sx={{ ml: 0.5, p: 0.5, opacity: isDeployingOrDestroying ? 0.5 : 1 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <StyledModal
        open={isStatusModalOpen}
        onClose={handleCloseStatusModal}
        aria-labelledby="status-modal-title"
        aria-describedby="status-modal-description"
      >
        <ModalContent>
          <ModalTitle variant="h6" id="status-modal-title">
            Deployment Logs
          </ModalTitle>
          <ModalDescription>
            <Typography id="status-modal-description">
              {data.command_outputs || 'No logs available.'}
            </Typography>
          </ModalDescription>
        </ModalContent>
      </StyledModal>
    </Box>
  );
};

export default NodeHeader;
