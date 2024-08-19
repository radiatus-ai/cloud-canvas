import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import CustomNode from '../../CustomNode';
import CustomConnectionLine from './CustomConnectionLine';
import CustomEdge from './CustomEdge';

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
  return (
    <div style={{ flexGrow: 1 }} ref={reactFlowWrapper}>
      <ReactFlow
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
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
