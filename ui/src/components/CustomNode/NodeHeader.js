import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { Box, IconButton, Modal, Tooltip, Typography } from '@mui/material';
import { blue, yellow } from '@mui/material/colors';
import { styled } from '@mui/system';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/Auth';
import useApi from '../../hooks/useAPI';

const StatusDot = styled('div')(({ theme, status }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  marginLeft: '4px',
  cursor: 'pointer',
  backgroundColor: (() => {
    switch (status) {
      case 'NOT_DEPLOYED':
        return theme?.palette?.grey?.[500] || '#9e9e9e';
      case 'DEPLOYING':
        return blue[500];
      case 'DESTROYING':
        return yellow[500];
      case 'DEPLOYED':
        return theme?.palette?.success?.main || '#4caf50';
      case 'FAILED':
        return theme?.palette?.error?.main || '#f44336';
      default:
        return theme?.palette?.grey?.[500] || '#9e9e9e';
    }
  })(),
}));

const StyledModal = styled(Modal)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme?.palette?.background?.paper || '#ffffff',
  boxShadow:
    theme?.shadows?.[5] ||
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
  borderRadius: theme?.shape?.borderRadius || '4px',
  maxWidth: '90%',
  maxHeight: '90%',
  display: 'flex',
  flexDirection: 'column',
}));

const ModalTitle = styled(Typography)(({ theme }) => ({
  padding: theme?.spacing?.(2, 2, 1) || '16px 16px 8px',
  fontWeight: 'bold',
}));

const ModalDescription = styled(Box)(({ theme }) => ({
  padding: theme?.spacing?.(1, 2, 2) || '8px 16px 16px',
  overflowY: 'auto',
  flexGrow: 1,
}));

const NodeHeader = ({ data, projectId, onOpenModal, onDeleteNode }) => {
  const { token } = useAuth();
  const { projects: projectsApi } = useApi();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [commandOutputs, setCommandOutputs] = useState(
    data.command_outputs || ''
  );

  useEffect(() => {
    setCommandOutputs(data.command_outputs || '');
  }, [data.command_outputs]);

  const handleOpenStatusModal = useCallback(() => {
    setIsStatusModalOpen(true);
  }, []);

  const handleCloseStatusModal = useCallback(() => {
    setIsStatusModalOpen(false);
  }, []);

  const handleDeploy = useCallback(async () => {
    try {
      const result = await projectsApi.deployPackage(projectId, data.id, token);
      setCommandOutputs(result.command_outputs || '');
    } catch (error) {
      console.error('Deployment failed:', error);
      setCommandOutputs(
        'Deployment failed. Please check the logs for more information.'
      );
    }
  }, [projectId, data.id, projectsApi, token]);

  const handleDestroy = useCallback(async () => {
    try {
      const result = await projectsApi.destroyPackage(
        projectId,
        data.id,
        token
      );
      setCommandOutputs(result.command_outputs || '');
    } catch (error) {
      console.error('Destruction failed:', error);
      setCommandOutputs(
        'Destruction failed. Please check the logs for more information.'
      );
    }
  }, [projectId, data.id, projectsApi, token]);

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
              sx={{ ml: 0.5, p: 0.5 }}
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        {data.deploy_status !== 'DEPLOYED' ? (
          <Tooltip title="Deploy">
            <IconButton
              size="small"
              onClick={handleDeploy}
              sx={{ ml: 0.5, p: 0.5, color: '#0cc421' }}
            >
              <PlayArrowIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Destroy">
            <IconButton
              size="small"
              onClick={handleDestroy}
              sx={{ ml: 0.5, p: 0.5 }}
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
              sx={{ ml: 0.5, p: 0.5 }}
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
