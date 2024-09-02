import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { blue, grey, red, yellow } from '@mui/material/colors';
import { styled } from '@mui/system';
import React, { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import DeploymentLogsModal from './DeploymentLogsModal';
import { validateConnections } from './utils/validate';

const successColor = '#0cc421';
const editColor = grey[500];

const stateColors = {
  destroying: yellow[500],
  deploying: blue[500],
  not_deployed: '#9e9e9e',
  deployed: successColor,
  failed: '#f44336',
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
  edges,
  handleDeploy,
  handleDestroy,
}) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [commandOutputs, setCommandOutputs] = useState(data.output_data || '');
  const [validationResult, setValidationResult] = useState(null);

  const handleOpenStatusModal = () => {
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
  };

  const handleDeployClick = async () => {
    const result = validateConnections(data, edges);
    setValidationResult(result);

    if (result.valid) {
      await handleDeploy();
    } else {
      setIsConfirmDialogOpen(true);
    }
  };

  const handleConfirmDeploy = async () => {
    setIsConfirmDialogOpen(false);
    await handleDeploy();
  };

  const renderActionButton = () => {
    switch (data.deploy_status) {
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
              onClick={handleDestroy}
              sx={{ ml: 0.5, p: 0.5, color: stateColors.destroying }}
            >
              <StopIcon fontSize="small" />
            </StyledIconButton>
          </Tooltip>
        );
      case 'DESTROYING':
      case 'DEPLOYING':
        return (
          <Tooltip
            title={
              data.deploy_status === 'DESTROYING' ? 'Destroying' : 'Deploying'
            }
          >
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
              status={data.deploy_status}
              onClick={handleOpenStatusModal}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <StyledIconButton
              size="small"
              onClick={onOpenModal}
              sx={{ ml: 0.5, p: 0.5, color: editColor }}
            >
              <EditIcon fontSize="small" />
            </StyledIconButton>
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
              <StyledIconButton
                size="small"
                onClick={onDeleteNode}
                sx={{ ml: 0.5, p: 0.5, color: red[500] }}
                disabled={data.deploy_status === 'DEPLOYED'}
              >
                <DeleteIcon fontSize="small" />
              </StyledIconButton>
            </span>
          </Tooltip>
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
    </NodeContainer>
  );
};

export default React.memo(NodeHeader);
