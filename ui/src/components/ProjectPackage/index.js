import { Collapse, Typography } from '@mui/material';
import React, { memo, useCallback, useState } from 'react';
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
import { NodeContainer, StatusContainer } from './styles';

const ProjectPackage = memo(({ data, isConnectable }) => {
  const { isTemp, inputs, outputs } = data;
  const { projectId } = useParams();
  const [nodeData, updateNodeData] = useNodeData(data);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deployStatus, error, handleDeploy, handleDestroy } =
    useNodeDeployment(nodeData.id, data.deploy_status);
  const {
    sendJsonMessage,
    connectionStatus,
    error: wsError,
  } = useRobustWebSocket(projectId, nodeData.id, updateNodeData);
  const { isDebugMode, isExpanded, toggleExpand, toggleDebugMode } =
    useNodeInteractions();

  useConnectionEffect(connectionStatus, sendJsonMessage);

  const handleDeleteConnection = useCallback(
    (connectionId) => {
      nodeData.onDeleteEdge(connectionId);
      updateNodeData((prevData) => ({
        ...prevData,
        edges: prevData.edges.filter((edge) => edge.id !== connectionId),
      }));
    },
    [nodeData, updateNodeData]
  );

  const handleUpdateStart = useCallback(() => {
    setIsUpdating(true);
  }, []);

  const handleUpdateComplete = useCallback(() => {
    setIsUpdating(false);
  }, []);

  const handleDeleteNode = useCallback(
    async (nodeId) => {
      setIsDeleting(true);
      try {
        await nodeData.onDelete(nodeId);
      } catch (error) {
        console.error('Error deleting node:', error);
        setIsDeleting(false);
        throw error;
      }
    },
    [nodeData]
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
            data={{
              ...nodeData,
              deploy_status: deployStatus,
              isUpdating,
              isDeleting,
            }}
            projectId={projectId}
            updateNodeData={updateNodeData}
            onOpenModal={nodeData.onOpenModal}
            onDeleteNode={handleDeleteNode}
            handleDeploy={handleDeploy}
            handleDestroy={handleDestroy}
            edges={data.edges}
            onDeleteConnection={handleDeleteConnection}
            onUpdateStart={handleUpdateStart}
            onUpdateComplete={handleUpdateComplete}
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
          {/* {(isUpdating || isDeleting) && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '10px',
              }}
            >
              <CircularProgress size={24} />
            </div>
          )} */}
          <Collapse in={isExpanded && !isUpdating && !isDeleting}>
            <NodeStatistics data={nodeData} />
          </Collapse>
        </>
      )}
    </NodeContainer>
  );
});

export default ProjectPackage;
