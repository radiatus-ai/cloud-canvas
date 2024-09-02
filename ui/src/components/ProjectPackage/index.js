import { Box, Collapse, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { memo, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import HandleComponent from './HandleComponent';
import useConnectionEffect from './hooks/useConnectionEffect';
import useDeploymentActions from './hooks/useDeploymentActions';
import useLocalDeployStatus from './hooks/useLocalDeployStatus';
import useNodeData from './hooks/useNodeData';
import useNodeInteractions from './hooks/useNodeInteractions';
import useRobustWebSocket from './hooks/useRobustWebSocket';
import useWebSocketEffect from './hooks/useWebSocketEffect';
import NodeHeader from './NodeHeader';
import NodeStatistics from './NodeStatistics';

const NodeContainer = styled(Box)(({ theme }) => ({
  padding: theme?.spacing?.(1.5) || '12px',
  border: `1px solid ${theme.palette.nodeBorder}`,
  borderRadius: theme.shape.borderRadius,
  minWidth: '180px',
  minHeight: '80px',
  position: 'relative',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  background: theme.palette.background.paper,
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

const ProjectPackage = memo(({ data, isConnectable }) => {
  const { projectId } = useParams();
  const [error, setError] = useState(null);
  const [nodeData, updateNodeData] = useNodeData(data);
  const [localDeployStatus, updateLocalDeployStatus] = useLocalDeployStatus(
    data.deploy_status
  );
  const { sendJsonMessage, messageHistory, connectionStatus } =
    useRobustWebSocket(projectId, nodeData.id);

  const { handleDeploy, handleDestroy } = useDeploymentActions(
    nodeData.id,
    updateLocalDeployStatus,
    setError
  );

  const handleDeleteConnection = useCallback((connectionId) => {
    nodeData.onDeleteEdge(connectionId);
    updateNodeData((prevData) => ({
      ...prevData,
      edges: prevData.edges.filter((edge) => edge.id !== connectionId),
    }));
    // You might also want to trigger a refresh of the entire graph here
    // or emit an event to a parent component to update the overall graph state
  }, []);

  const { isDebugMode, isExpanded, toggleExpand, toggleDebugMode } =
    useNodeInteractions();

  useWebSocketEffect(messageHistory, updateNodeData, setError);
  useConnectionEffect(connectionStatus, sendJsonMessage, setError);

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
        packageType={nodeData.type}
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
        packageType={nodeData.type}
      />
    )
  );

  // todo: bring this back as part of the dev view
  // const renderConnectionStatus = () => {
  //   if (isDebugMode) {
  //     return (
  //       <Typography variant="caption" color="text.secondary">
  //         Connection: {connectionStatus}
  //       </Typography>
  //     );
  //   } else {
  //     return connectionStatus === 'Open' ? (
  //       <WbSunnyIcon color="primary" fontSize="small" />
  //     ) : (
  //       <CloudIcon color="disabled" fontSize="small" />
  //     );
  //   }
  // };

  return (
    <NodeContainer>
      <NodeHeader
        data={{ ...nodeData, deploy_status: localDeployStatus }}
        projectId={projectId}
        updateNodeData={updateNodeData}
        onOpenModal={nodeData.onOpenModal}
        onDeleteNode={nodeData.onDelete}
        handleDeploy={handleDeploy}
        handleDestroy={handleDestroy}
        edges={data.edges}
        onDeleteConnection={handleDeleteConnection}
      />
      <StatusContainer>
        <Typography variant="caption" color="text.secondary">
          {nodeData.type}
        </Typography>
        {/* todo: bring this back as part of the dev view */}
        {/* {renderConnectionStatus()} */}
        {/* todo: bring this back as part of feature/metricscd   */}
        {/* <Typography
          variant="caption"
          color="text.secondary"
          sx={{ marginLeft: '8px', cursor: 'pointer' }}
          onClick={toggleDebugMode}
        >
          {isDebugMode ? 'Switch to Icon Mode' : ''}
        </Typography>
        <ExpandButton onClick={toggleExpand} size="small">
          {isExpanded ? (
            <ExpandLessIcon color="primary" />
          ) : (
            <ExpandMoreIcon color="primary" />
          )}
        </ExpandButton> */}
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

export default ProjectPackage;
