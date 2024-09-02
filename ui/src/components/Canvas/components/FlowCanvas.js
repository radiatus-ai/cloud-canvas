import { Box } from '@mui/material';
import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import ProjectPackage from '../../ProjectPackage';
import CustomEdge from './CustomEdge';

const nodeTypes = {
  // custom: (props) => <CustomNode {...props} isConnectable={isConnectable} />,
  custom: (props) => <ProjectPackage {...props} isConnectable={false} />,
};

// const nodeTypes = {
//   custom: CustomNode,
// };

const edgeTypes = {
  custom: CustomEdge,
};

const FlowCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onConnectStart,
  onConnectEnd,
  onConnectCheck,
  onInit,
  onDrop,
  onDragOver,
  reactFlowWrapper,
}) => {
  const defaultViewport = { x: 0, y: 0, zoom: 0.5 };

  // const onDeleteConnection = useCallback(
  //   async (connectionId) => {
  //     try {
  //       await projectsApi.deleteConnection(projectId, connectionId, token);
  //       setEdges((eds) => eds.filter((edge) => edge.id !== connectionId));
  //       sendJsonMessage({
  //         type: 'connection_update',
  //         action: 'delete',
  //         connectionId,
  //       });
  //       setError(null);
  //     } catch (error) {
  //       console.error('Failed to delete connection:', error);
  //       setError('Failed to delete connection. Please try again.');
  //     }
  //   },
  //   [projectId, token, projectsApi, setEdges, sendJsonMessage]
  // );

  // const onDeleteNode = useCallback(
  //   async (nodeId) => {
  //     try {
  //       await projectsApi.deletePackage(projectId, nodeId, token);
  //       setNodes((nds) => nds.filter((node) => node.id !== nodeId));
  //       setEdges((eds) =>
  //         eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
  //       );
  //       sendJsonMessage({
  //         type: 'package_update',
  //         action: 'delete',
  //         packageId: nodeId,
  //       });
  //       setError(null);
  //     } catch (error) {
  //       console.error('Failed to delete node:', error);
  //       setError('Failed to delete node. Please try again.');
  //     }
  //   },
  //   [projectId, token, projectsApi, setNodes, setEdges, sendJsonMessage]
  // );

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', width: '100%' }}>
      <div style={{ flexGrow: 1 }} ref={reactFlowWrapper}>
        <ReactFlow
          defaultViewport={defaultViewport}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          // not a part of the API
          // onConnectCheck={onConnectCheck}
          onInit={onInit}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          // connectionLineComponent={CustomConnectionLine}
          connectionLineStyle={{ stroke: '#ddd', strokeWidth: 2 }}
          connectionMode="loose"
          fitView
          maxZoom={1.0}
        >
          <Controls />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </Box>
  );
};

export default FlowCanvas;
