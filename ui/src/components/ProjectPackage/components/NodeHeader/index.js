import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { blue, grey, red, yellow } from '@mui/material/colors';
import { styled } from '@mui/system';
import React, { useCallback, useState } from 'react';
import { useAuth } from '../../../../contexts/Auth';
import useApi from '../../../../hooks/useAPI';
import ConfirmationDialog from '../ConfirmationDialog';
import DeploymentLogsModal from '../DeploymentLogsModal';
import { useConnectionManagement } from './hooks/useConnectionManagement';
import { useNodeStatus } from './hooks/useNodeStatus';
import { useValidation } from './hooks/useValidation';

const successColor = '#0cc421';
const editColor = grey[500];

const stateColors = {
  destroying: yellow[500],
  deploying: blue[500],
  not_deployed: '#9e9e9e',
  deployed: successColor,
  failed: '#f44336',
  deleting: yellow[500],
};

const NodeContainer = styled(Box)({
  cursor: 'grab',
  '&:active': {
    cursor: 'grabbing',
  },
});

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
      case 'DELETING':
        return stateColors.deleting;
      default:
        return stateColors.not_deployed;
    }
  })(),
}));

const StyledIconButton = styled(IconButton)({
  cursor: 'pointer',
});

const RotatingIcon = styled(AutorenewIcon)(({ theme, color }) => ({
  animation: 'spin 2s linear infinite',
  color: color,
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
}));

const NodeHeader = ({
  data,
  projectId,
  onOpenModal,
  onDeleteNode,
  edges = [],
  handleDeploy: parentHandleDeploy,
  handleDestroy: parentHandleDestroy,
  onDeleteConnection,
}) => {
  const { token } = useAuth();
  const { projects: projectsApi } = useApi();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [commandOutputs, setCommandOutputs] = useState(data.output_data || '');
  const [error, setError] = useState(null);

  const { status, isDeleting, handleDeploy, handleDestroy, handleDelete } =
    useNodeStatus(data.deploy_status);

  const {
    validationResult,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    validateNode,
    openConfirmDialog,
    closeConfirmDialog,
  } = useValidation();

  const { handleDeleteConnection } = useConnectionManagement(
    projectId,
    token,
    projectsApi,
    onDeleteConnection
  );

  const handleOpenStatusModal = () => setIsStatusModalOpen(true);
  const handleCloseStatusModal = () => setIsStatusModalOpen(false);

  const handleDeployClick = useCallback(async () => {
    const isValid = validateNode(data, edges);
    if (isValid) {
      try {
        await parentHandleDeploy();
      } catch (error) {
        setError('Failed to deploy. Please try again.');
        console.error('Deployment failed:', error);
      }
    } else {
      openConfirmDialog();
    }
  }, [data, edges, validateNode, parentHandleDeploy, openConfirmDialog]);

  const handleConfirmDeploy = useCallback(async () => {
    closeConfirmDialog();
    try {
      await parentHandleDeploy();
    } catch (error) {
      setError('Failed to deploy. Please try again.');
      console.error('Deployment failed:', error);
    }
  }, [closeConfirmDialog, parentHandleDeploy]);

  const handleDestroyClick = useCallback(async () => {
    try {
      await parentHandleDestroy();
    } catch (error) {
      setError('Failed to destroy. Please try again.');
      console.error('Destruction failed:', error);
    }
  }, [parentHandleDestroy]);

  const handleDeleteClick = useCallback(async () => {
    try {
      await handleDelete(onDeleteNode, data.id);
    } catch (error) {
      setError('Failed to delete. Please try again.');
      console.error('Deletion failed:', error);
    }
  }, [handleDelete, onDeleteNode, data.id]);

  const renderActionButton = () => {
    if (isDeleting) {
      return (
        <Tooltip title="Deleting">
          <StyledIconButton
            size="small"
            sx={{ ml: 0.5, p: 0.5, color: red[500] }}
            disabled
          >
            <RotatingIcon fontSize="small" color={red[500]} />
          </StyledIconButton>
        </Tooltip>
      );
    }

    switch (status) {
      case 'NOT_DEPLOYED':
      case 'FAILED':
        return (
          <Tooltip title="Deploy">
            <StyledIconButton
              size="small"
              onClick={handleDeployClick}
              sx={{ ml: 0.5, p: 0.5, color: stateColors.deployed }}
            >
              <PlayArrowIcon fontSize="small" />
            </StyledIconButton>
          </Tooltip>
        );
      case 'DEPLOYED':
        return (
          <Tooltip title="Destroy">
            <StyledIconButton
              size="small"
              onClick={handleDestroyClick}
              sx={{ ml: 0.5, p: 0.5, color: stateColors.destroying }}
            >
              <StopIcon fontSize="small" />
            </StyledIconButton>
          </Tooltip>
        );
      case 'DESTROYING':
      case 'DEPLOYING':
        return (
          <Tooltip title={status === 'DESTROYING' ? 'Destroying' : 'Deploying'}>
            <StyledIconButton
              size="small"
              sx={{ ml: 0.5, p: 0.5, color: stateColors.deployed }}
              disabled
            >
              <RotatingIcon fontSize="small" color={stateColors.deployed} />
            </StyledIconButton>
          </Tooltip>
        );
      default:
        return null;
    }
  };

  const renderConnectionDeleteButtons = () => {
    return edges.map((edge) => (
      <Tooltip
        key={edge.id}
        title={`Delete connection: ${edge.sourceHandle} to ${edge.targetHandle}`}
      >
        <IconButton
          size="small"
          onClick={() => handleDeleteConnection(edge.id)}
          sx={{ ml: 0.5, p: 0.5, color: red[500] }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ));
  };

  return (
    <NodeContainer>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" key={data.label}>
          {data.label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Logs">
            <StatusDot
              status={isDeleting ? 'DELETING' : status}
              onClick={handleOpenStatusModal}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <StyledIconButton
              size="small"
              onClick={onOpenModal}
              sx={{ ml: 0.5, p: 0.5, color: editColor }}
              disabled={isDeleting}
            >
              <EditIcon fontSize="small" />
            </StyledIconButton>
          </Tooltip>
          {renderActionButton()}
          <Tooltip
            title={
              status === 'DEPLOYED'
                ? 'Package must be destroyed before deletion'
                : 'Delete'
            }
          >
            <span>
              <StyledIconButton
                size="small"
                onClick={handleDeleteClick}
                sx={{ ml: 0.5, p: 0.5, color: red[500] }}
                disabled={status === 'DEPLOYED' || isDeleting}
              >
                <DeleteIcon fontSize="small" />
              </StyledIconButton>
            </span>
          </Tooltip>
          {renderConnectionDeleteButtons()}
        </Box>
      </Box>

      <DeploymentLogsModal
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
        logs={commandOutputs}
      />
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        title="Warning: Missing Connections"
        content={`This package is missing the following connections:
          ${
            validationResult?.missingInputs.length
              ? `\nInputs: ${validationResult.missingInputs.join(', ')}`
              : ''
          }
          ${
            validationResult?.missingOutputs.length
              ? `\nOutputs: ${validationResult.missingOutputs.join(', ')}`
              : ''
          }
          \nDo you want to proceed with deployment anyway?`}
        onConfirm={handleConfirmDeploy}
        onCancel={() => setIsConfirmDialogOpen(false)}
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </NodeContainer>
  );
};

export default React.memo(NodeHeader);
