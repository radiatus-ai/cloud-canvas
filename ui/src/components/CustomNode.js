import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { styled } from '@mui/system';
import apiService from '../apiService';
import StopIcon from '@mui/icons-material/Stop';

const NodeContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.background.paper,
  minWidth: '180px',
  minHeight: '80px',
  position: 'relative',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const StatusDot = styled('div')(({ theme, status }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: (() => {
    switch (status) {
      case 'undeployed':
        return theme.palette.grey[500];
      case 'deploying':
        return theme.palette.warning.main;
      case 'deployed':
        return theme.palette.success.main;
      case 'failed':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  })(),
}));

const HandleWrapper = styled('div')(({ theme, position, index, total }) => ({
  position: 'absolute',
  [position === Position.Left ? 'left' : 'right']: -8,
  top: `${((index + 1) / (total + 1)) * 100}%`,
}));

const HandleTooltip = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -20,
  background: theme.palette.grey[900],
  color: theme.palette.common.white,
  padding: theme.spacing(0.25, 0.5),
  borderRadius: theme.shape.borderRadius,
  fontSize: 9,
  whiteSpace: 'nowrap',
}));

const CustomNode = ({ data }) => {
  const [hoveredHandle, setHoveredHandle] = useState(null);
  const { projectId } = useParams();

  const handleDeploy = async () => {
    try {
      await apiService.deployPackage(projectId, data.id);
      // You might want to update the node's status after successful deployment
    } catch (error) {
      console.error('Deployment failed:', error);
      // Handle deployment error (e.g., show an error message)
    }
  };

  const handleDestroy = async () => {
    try {
      await apiService.destroyPackage(projectId, data.id);
      // You might want to update the node's status after successful destruction
    } catch (error) {
      console.error('Destruction failed:', error);
      // Handle destruction error (e.g., show an error message)
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.deletePackage(projectId, data.id);
      // You might want to remove the node from the graph after successful deletion
    } catch (error) {
      console.error('Deletion failed:', error);
      // Handle deletion error (e.g., show an error message)
    }
  };

  const HandleComponent = ({ type, position, id, schema, index, total }) => (
    <HandleWrapper
      position={position}
      index={index}
      total={total}
      onMouseEnter={() => setHoveredHandle(id)}
      onMouseLeave={() => setHoveredHandle(null)}
    >
      <Handle
        type={type}
        position={position}
        id={id}
        style={{ background: '#555', width: 6, height: 6 }}
      />
      {hoveredHandle === id && (
        <HandleTooltip
          right={position === Position.Left ? 'auto' : 0}
          left={position === Position.Left ? 0 : 'auto'}
        >
          {schema.type}
        </HandleTooltip>
      )}
    </HandleWrapper>
  );

  if (data.inputs.properties === undefined) {
    data.inputs.properties = {};
    data.outputs.properties = {};
  }

  const inputHandles = Object.entries(data.inputs.properties).map(
    ([input, schema], index, array) => (
      <HandleComponent
        key={`input-${input}`}
        type="target"
        position={Position.Left}
        id={input}
        schema={schema}
        index={index}
        total={array.length}
      />
    )
  );

  const outputHandles = Object.entries(data.outputs.properties).map(
    ([output, schema], index, array) => (
      <HandleComponent
        key={`output-${output}`}
        type="source"
        position={Position.Right}
        id={output}
        schema={schema}
        index={index}
        total={array.length}
      />
    )
  );

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
        <Typography variant="subtitle2" fontWeight="bold">
          {data.label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={`Status: ${data.deploy_status}`}>
            <StatusDot status={data.deploy_status} />
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={data.onOpenModal}
              sx={{ ml: 0.5, p: 0.5 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={data.deploy_status === 'deployed' ? 'Destroy' : 'Deploy'}
          >
            <IconButton
              size="small"
              onClick={
                data.deploy_status === 'deployed' ? handleDestroy : handleDeploy
              }
              sx={{ ml: 0.5, p: 0.5 }}
            >
              {data.deploy_status === 'deployed' ? (
                <StopIcon fontSize="small" />
              ) : (
                <PlayArrowIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <span>
              <IconButton
                size="small"
                onClick={handleDelete}
                disabled={
                  data.deploy_status === 'deploying' ||
                  data.deploy_status === 'destroying'
                }
                sx={{
                  ml: 0.5,
                  p: 0.5,
                  opacity:
                    data.deploy_status === 'deploying' ||
                    data.deploy_status === 'destroying'
                      ? 0.5
                      : 1,
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {data.type}
      </Typography>
      {inputHandles}
      {outputHandles}
    </NodeContainer>
  );
};

export default CustomNode;
