import { Collapse, Typography } from '@mui/material';
import React, { memo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import NodeHandles from './components/NodeHandles';
import NodeHeader from './components/NodeHeader';
import NodeStatistics from './components/NodeStatistics';
import useConnectionEffect from './hooks/useConnectionEffect';
import useNodeData from './hooks/useNodeData';
import useNodeDeployment from './hooks/useNodeDeployment';
import useNodeInteractions from './hooks/useNodeInteractions';
import useRobustWebSocket from './hooks/useRobustWebSocket';
// import useWebSocketEffect from './hooks/useWebSocketEffect';
import { NodeContainer, StatusContainer } from './styles';

const ProjectPackage = memo(({ data, isConnectable }) => {
  const { isTemp, inputs, outputs } = data;
  const { projectId } = useParams();
  const [nodeData, updateNodeData] = useNodeData(data);
  const { deployStatus, error, handleDeploy, handleDestroy } =
    useNodeDeployment(nodeData.id, data.deploy_status);
  const {
    sendJsonMessage,
    connectionStatus,
    error: wsError,
  } = useRobustWebSocket(projectId, nodeData.id, updateNodeData);
  const { isDebugMode, isExpanded, toggleExpand, toggleDebugMode } =
    useNodeInteractions();

  // useWebSocketEffect(messageHistory, updateNodeData);
  useConnectionEffect(connectionStatus, sendJsonMessage);

  const handleDeleteConnection = useCallback(
    (connectionId) => {
      nodeData.onDeleteEdge(connectionId);
      updateNodeData((prevData) => ({
        ...prevData,
        edges: prevData.edges.filter((edge) => edge.id !== connectionId),
      }));
      // You might also want to trigger a refresh of the entire graph here
      // or emit an event to a parent component to update the overall graph state
    },
    [nodeData, updateNodeData]
  );

  return (
    <NodeContainer isTemp={isTemp}>
      {isTemp ? (
        <Typography variant="body2" color="textSecondary">
          Creating {nodeData.label}...
        </Typography>
      ) : (
        <>
          <NodeHeader
            data={{ ...nodeData, deploy_status: deployStatus }}
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
          </StatusContainer>
          <NodeHandles
            inputs={nodeData.inputs}
            outputs={nodeData.outputs}
            isConnectable={isConnectable}
            isTemp={isTemp}
            packageType={nodeData.type}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Collapse in={isExpanded}>
            <NodeStatistics data={nodeData} />
          </Collapse>
        </>
      )}
    </NodeContainer>
  );
});

export default ProjectPackage;
