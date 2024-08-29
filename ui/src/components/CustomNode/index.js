import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { memo, useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import HandleComponent from './HandleComponent';
import NodeHeader from './NodeHeader';
import { grey } from '@mui/material/colors';
import useRobustWebSocket from './hooks/useRobustWebSocket';

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

const CustomNode = memo(({ data, isConnectable }) => {
  const { projectId } = useParams();
  const [error, setError] = useState(null);
  const [nodeData, setNodeData] = useState(data);
  const { sendJsonMessage, messageHistory, connectionStatus } =
    useRobustWebSocket(projectId, nodeData.id);

  const updateNodeData = useCallback((updater) => {
    setNodeData((prevData) => {
      const newData =
        typeof updater === 'function' ? updater(prevData) : updater;
      return { ...prevData, ...newData };
    });
  }, []);

  useEffect(() => {
    if (messageHistory.length > 0) {
      const lastMessage = messageHistory[messageHistory.length - 1];
      try {
        const message = JSON.parse(lastMessage.data);
        if (
          message.type === 'package_update' ||
          message.type === 'request_update' ||
          message.type === 'request_initial'
        ) {
          setError(null);
          updateNodeData((prevData) => ({
            ...prevData,
            deploy_status: message.data.deploy_status,
          }));
        } else if (message.type === 'error') {
          console.error('WebSocket error:', message.message);
          setError(message.message);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
        setError('Error parsing WebSocket message');
      }
    }
  }, [messageHistory, updateNodeData]);

  useEffect(() => {
    if (connectionStatus === 'Open') {
      sendJsonMessage({ type: 'request_initial' });
    }
  }, [connectionStatus, sendJsonMessage]);

  useEffect(() => {
    if (connectionStatus === 'Closed') {
      setError('WebSocket connection closed. Please refresh the page.');
    } else {
      setError(null);
    }
  }, [connectionStatus]);

  if (nodeData.inputs.properties === undefined) {
    nodeData.inputs.properties = {};
    nodeData.outputs.properties = {};
  }

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

  return (
    <NodeContainer>
      <NodeHeader
        data={nodeData}
        projectId={projectId}
        updateNodeData={updateNodeData}
        onOpenModal={nodeData.onOpenModal}
        onDeleteNode={nodeData.onDelete}
      />
      <Typography variant="caption" color="text.secondary">
        {nodeData.type}
      </Typography>
      {inputHandles}
      {outputHandles}
      {error && <Typography color="error">{error}</Typography>}
      <Typography variant="caption" color="text.secondary">
        Connection: {connectionStatus}
      </Typography>
    </NodeContainer>
  );
});

export default CustomNode;
