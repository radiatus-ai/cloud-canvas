import React, { useCallback, useEffect, useState } from 'react';
import { Box, IconButton, Modal, Tooltip, Typography } from '@mui/material';
import { blue, grey, yellow, red } from '@mui/material/colors';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useAuth } from '../../contexts/Auth';
import useApi from '../../hooks/useAPI';

const successColor = '#0cc421';
const editColor = grey[500];

const stateColors = {
  destroying: yellow[500],
  deploying: blue[500],
  not_deployed: '#9e9e9e',
  deployed: successColor,
  failed: '#f44336',
};

const StatusDot = styled('div')(({ theme, status }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  marginLeft: '6px',
  cursor: 'pointer',
  backgroundColor: (() => {
    switch (status) {
      case 'NOT_DEPLOYED':
        return stateColors.not_deployed;
      case 'DEPLOYING':
        return stateColors.deploying;
      case 'DESTROYING':
        return stateColors.destroying;
      case 'DEPLOYED':
        return stateColors.deployed;
      case 'FAILED':
        return stateColors.failed;
      default:
        return stateColors.not_deployed;
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

const RotatingIcon = styled(AutorenewIcon)(({ theme, color }) => ({
  animation: 'spin 2s linear infinite',
  color: color, // Add this line
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
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

  const renderActionButton = () => {
    switch (data.deploy_status) {
      case 'NOT_DEPLOYED':
      case 'FAILED':
        return (
          <Tooltip title="Deploy">
            <IconButton
              size="small"
              onClick={handleDeploy}
              sx={{ ml: 0.5, p: 0.5, color: stateColors.deployed }}
            >
              <PlayArrowIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      case 'DEPLOYED':
        return (
          <Tooltip title="Destroy">
            <IconButton
              size="small"
              onClick={handleDestroy}
              sx={{ ml: 0.5, p: 0.5, color: stateColors.destroying }}
            >
              <StopIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      case 'DESTROYING':
        return (
          <Tooltip title="Destroying">
            <IconButton
              size="small"
              sx={{ ml: 0.5, p: 0.5, color: stateColors.destroying }}
              disabled
            >
              <RotatingIcon fontSize="small" color={stateColors.destroying} />
            </IconButton>
          </Tooltip>
        );
      case 'DEPLOYING':
        return (
          <Tooltip title="Deploying">
            <IconButton
              size="small"
              sx={{ ml: 0.5, p: 0.5, color: stateColors.deployed }}
              disabled
            >
              <RotatingIcon fontSize="small" color={stateColors.deployed} />
            </IconButton>
          </Tooltip>
        );
      default:
        return null;
    }
  };

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
        <Tooltip title="Logs">
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
              sx={{ ml: 0.5, p: 0.5, color: editColor }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        {renderActionButton()}
        <Tooltip
          title={
            data.deploy_status === 'DEPLOYED'
              ? 'Package must be destroyed before deletion'
              : 'Delete'
          }
        >
          <span>
            <IconButton
              size="small"
              onClick={onDeleteNode}
              sx={{ ml: 0.5, p: 0.5, color: red[500] }}
              disabled={data.deploy_status === 'DEPLOYED'}
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
