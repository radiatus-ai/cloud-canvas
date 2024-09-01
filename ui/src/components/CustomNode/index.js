import CloudIcon from '@mui/icons-material/Cloud';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { Box, Collapse, IconButton, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/system';
import React, { memo, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import { useAuth } from '../../contexts/Auth';
import useApi from '../../hooks/useAPI';
import HandleComponent from './HandleComponent';
import useConnectionEffect from './hooks/useConnectionEffect';
import useLocalDeployStatus from './hooks/useLocalDeployStatus';
import useNodeData from './hooks/useNodeData';
import useRobustWebSocket from './hooks/useRobustWebSocket';
import useWebSocketEffect from './hooks/useWebSocketEffect';
import NodeHeader from './NodeHeader';
import NodeStatistics from './NodeStatistics';

const NodeContainer = styled(Box)(({ theme }) => ({
  padding: theme?.spacing?.(1.5) || '12px',
  border: `1px solid ${grey[300]}`,
  borderRadius: theme?.shape?.borderRadius || '4px',
  background: theme?.palette?.background?.paper || '#ffffff',
  minWidth: '180px',
  minHeight: '80px',
  position: 'relative',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const StatusContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginTop: '8px',
});

const ExpandButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  marginLeft: 'auto',
}));

const CustomNode = memo(({ data, isConnectable }) => {
  const { projects: projectsApi } = useApi();
  const { projectId } = useParams();
  const { token } = useAuth();
  const [error, setError] = useState(null);
  const [nodeData, updateNodeData] = useNodeData(data);
  const [localDeployStatus, updateLocalDeployStatus] = useLocalDeployStatus(
    data.deploy_status
  );
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { sendJsonMessage, messageHistory, connectionStatus } =
    useRobustWebSocket(projectId, nodeData.id);

  useWebSocketEffect(messageHistory, updateNodeData, setError);
  useConnectionEffect(connectionStatus, sendJsonMessage, setError);

  const handleDeploy = useCallback(async () => {
    updateLocalDeployStatus('DEPLOYING');
    try {
      await projectsApi.deployPackage(projectId, nodeData.id, token);
      // The actual status update will come through the WebSocket
    } catch (error) {
      console.error('Deployment failed:', error);
      updateLocalDeployStatus('FAILED');
      setError(
        'Deployment failed. Please check the logs for more information.'
      );
    }
  }, [projectId, nodeData.id, updateLocalDeployStatus, projectsApi, token]);

  const handleDestroy = useCallback(async () => {
    updateLocalDeployStatus('DESTROYING');
    try {
      await projectsApi.destroyPackage(projectId, nodeData.id, token);
      // The actual status update will come through the WebSocket
    } catch (error) {
      console.error('Destruction failed:', error);
      updateLocalDeployStatus('FAILED');
      setError(
        'Destruction failed. Please check the logs for more information.'
      );
    }
  }, [projectId, nodeData.id, updateLocalDeployStatus, projectsApi, token]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const inputHandles = Object.entries(nodeData.inputs.properties).map(
    ([input, schema], index, array) => (
      <HandleComponent
        key={`input-${input}`}
        type="target"
        position="left"
        id={input}
        schema={schema}
        index={index}
        total={array.length}
        isConnectable={isConnectable}
      />
    )
  );

  const outputHandles = Object.entries(nodeData.outputs.properties).map(
    ([output, schema], index, array) => (
      <HandleComponent
        key={`output-${output}`}
        type="source"
        position="right"
        id={output}
        schema={schema}
        index={index}
        total={array.length}
        isConnectable={isConnectable}
      />
    )
  );

  // todo: bring this back later in developer mode. Displays wether the websocket is open or closed.
  const renderConnectionStatus = () => {
    if (isDebugMode) {
      return (
        <Typography variant="caption" color="text.secondary">
          Connection: {connectionStatus}
        </Typography>
      );
    } else {
      return connectionStatus === 'Open' ? (
        <WbSunnyIcon color="primary" fontSize="small" />
      ) : (
        <CloudIcon color="disabled" fontSize="small" />
      );
    }
  };

  return (
    <NodeContainer>
      <NodeHeader
        data={{ ...nodeData, deploy_status: localDeployStatus }}
        projectId={projectId}
        updateNodeData={updateNodeData}
        onOpenModal={nodeData.onOpenModal}
        onDeleteNode={nodeData.onDelete}
        onDeploy={handleDeploy}
        onDestroy={handleDestroy}
      />
      <StatusContainer>
        <Typography variant="caption" color="text.secondary">
          {nodeData.type}
        </Typography>
        {/* {renderConnectionStatus()}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ marginLeft: '8px', cursor: 'pointer' }}
          onClick={() => setIsDebugMode(!isDebugMode)}
        >
          {isDebugMode ? 'Switch to Icon Mode' : ''}
        </Typography> */}
        <ExpandButton onClick={toggleExpand} size="small">
          {isExpanded ? (
            <ExpandLessIcon color="primary" />
          ) : (
            <ExpandMoreIcon color="primary" />
          )}
        </ExpandButton>
      </StatusContainer>

      {inputHandles}
      {outputHandles}
      {error && <Typography color="error">{error}</Typography>}
      <Collapse in={isExpanded}>
        <NodeStatistics data={nodeData} />
      </Collapse>
    </NodeContainer>
  );
});

export default CustomNode;
