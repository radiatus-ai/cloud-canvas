import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { Box, IconButton, Modal, Tooltip, Typography } from '@mui/material';
import { blue, yellow } from '@mui/material/colors';
import { styled } from '@mui/system';
import React, { useCallback, useEffect, useState } from 'react';
import apiService from '../../apiService';

const StatusDot = styled('div')(({ theme, status }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  marginLeft: '4px',
  cursor: 'pointer',
  backgroundColor: (() => {
    switch (status) {
      case 'undeployed':
        return theme.palette.grey[500];
      case 'deploying':
        return blue[500];
      case 'destroying':
        return yellow[500];
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

const NodeHeader = ({ data, projectId, onOpenModal, onDeleteNode }) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [localDeployStatus, setLocalDeployStatus] = useState(
    data.deploy_status
  );
  const [commandOutputs, setCommandOutputs] = useState(
    data.command_outputs || ''
  );

  useEffect(() => {
    setLocalDeployStatus(data.deploy_status);
    setCommandOutputs(data.command_outputs || '');
  }, [data.deploy_status, data.command_outputs]);

  const handleOpenStatusModal = useCallback(() => {
    setIsStatusModalOpen(true);
  }, []);

  const handleCloseStatusModal = useCallback(() => {
    setIsStatusModalOpen(false);
  }, []);

  const handleDeploy = useCallback(async () => {
    setLocalDeployStatus('deploying');
    try {
      const result = await apiService.deployPackage(projectId, data.id);
      setLocalDeployStatus('deployed');
      setCommandOutputs(result.command_outputs || '');
    } catch (error) {
      console.error('Deployment failed:', error);
      setLocalDeployStatus('failed');
      setCommandOutputs(
        'Deployment failed. Please check the logs for more information.'
      );
    }
  }, [projectId, data.id]);

  const handleDestroy = useCallback(async () => {
    setLocalDeployStatus('destroying');
    try {
      await apiService.destroyPackage(projectId, data.id);
      setLocalDeployStatus('undeployed');
      setCommandOutputs('Package successfully destroyed.');
    } catch (error) {
      console.error('Destruction failed:', error);
      setLocalDeployStatus('failed');
      setCommandOutputs(
        'Destruction failed. Please check the logs for more information.'
      );
    }
  }, [projectId, data.id]);

  // const handleDelete = useCallback(async () => {
  //   try {
  //     await apiService.deletePackage(projectId, data.id);
  //     // The parent component should handle removing the node from the state
  //     // Call the onDeleteNode callback to remove the node from the parent component
  //     // todo: redo when moving to real backend
  //     onDeleteNode(data.id);
  //   } catch (error) {
  //     console.error('Deletion failed:', error);
  //     setCommandOutputs(
  //       'Deletion failed. Please check the logs for more information.'
  //     );
  //   }
  // }, [projectId, data.id]);

  const isDeployingOrDestroying =
    localDeployStatus === 'deploying' || localDeployStatus === 'destroying';

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
        <Tooltip title={`Status: ${localDeployStatus}`}>
          <StatusDot
            status={localDeployStatus}
            onClick={handleOpenStatusModal}
          />
        </Tooltip>
        <Tooltip title="Edit">
          <span>
            <IconButton
              size="small"
              onClick={onOpenModal}
              disabled={isDeployingOrDestroying}
              sx={{
                ml: 0.5,
                p: 0.5,
                opacity: isDeployingOrDestroying ? 0.5 : 1,
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        {localDeployStatus !== 'deployed' ? (
          <Tooltip title="Deploy">
            <IconButton
              size="small"
              onClick={handleDeploy}
              disabled={isDeployingOrDestroying}
              sx={{
                ml: 0.5,
                p: 0.5,
                opacity: isDeployingOrDestroying ? 0.5 : 1,
              }}
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
              sx={{
                ml: 0.5,
                p: 0.5,
                opacity: isDeployingOrDestroying ? 0.5 : 1,
              }}
            >
              <StopIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Delete">
          <span>
            <IconButton
              size="small"
              onClick={onDeleteNode}
              disabled={isDeployingOrDestroying}
              sx={{
                ml: 0.5,
                p: 0.5,
                opacity: isDeployingOrDestroying ? 0.5 : 1,
              }}
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
              {commandOutputs || 'No logs available.'}
            </Typography>
          </ModalDescription>
        </ModalContent>
      </StyledModal>
    </Box>
  );
};

export default React.memo(NodeHeader);
