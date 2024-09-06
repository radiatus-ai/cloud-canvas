import { Box } from '@mui/material';
import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import ProjectPackage from '../../ProjectPackage';
import CustomEdge from './CustomEdge';

const nodeTypes = {
  custom: (props) => <ProjectPackage {...props} isConnectable={false} />,
};

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

  const styledNodes = nodes.map((node) => ({
    ...node,
    style: node.data.isTemp
      ? {
          opacity: 0.5,
          pointerEvents: 'none',
        }
      : {},
  }));

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 64px)',
        width: '100%',
        position: 'relative',
      }}
    >
      <div style={{ flexGrow: 1 }} ref={reactFlowWrapper}>
        <ReactFlow
          defaultViewport={defaultViewport}
          nodes={styledNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onInit={onInit}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
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
