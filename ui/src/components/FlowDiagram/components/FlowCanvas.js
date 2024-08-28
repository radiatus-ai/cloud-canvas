import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import CustomNode from '../../CustomNode';
import CustomConnectionLine from './CustomConnectionLine';
import CustomEdge from './CustomEdge';
import { Box } from '@mui/material';

const nodeTypes = {
  custom: CustomNode,
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
          connectionLineComponent={CustomConnectionLine}
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
