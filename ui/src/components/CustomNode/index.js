import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { memo, useCallback, useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import HandleComponent from './HandleComponent';
import NodeHeader from './NodeHeader';
import { grey } from '@mui/material/colors';

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

const getApiUrl = () => {
  switch (process.env.REACT_APP_ENV) {
    case 'production':
      return 'wss://canvas-api.dev.r7ai.net';
    case 'development':
    default:
      return 'ws://localhost:8000';
  }
};

const getAuthToken = () => {
  // Return the authentication token
  return localStorage.getItem('authToken'); // Example implementation
};

const CustomNode = memo(({ data, updateNodeData }) => {
  const { projectId } = useParams();
  const wsRef = useRef(null);
  const [error, setError] = useState(null);

  const setupWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const authToken = getAuthToken();
    const ws = new WebSocket(`${getApiUrl()}/projects/${projectId}/packages/${data.id}/ws?token=${authToken}`);

    console.log('WebSocket connecting to:', `${getApiUrl()}/projects/${projectId}/packages/${data.id}/ws?token=${authToken}`);

    let heartbeatInterval;

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Request initial update
      ws.send(JSON.stringify({ type: 'request_update' }));

      // Start heartbeat
      heartbeatInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'heartbeat' }));
        }
      }, 30000); // Send heartbeat every 30 seconds
    };

    ws.onmessage = (event) => {
      try {
        console.log('WebSocket message:', event);
        const message = JSON.parse(event.data);
        console.log('WebSocket message:', message);
        // this only has id in it
        if (message.type === 'package_update') {
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
    };

    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.error('WebSocket connection died');
        if (event.code === 1008) { // Policy violation, often used for auth failures
          setError('Authentication failed. Please log in again.');
          // Implement logic to redirect to login or refresh auth token
        } else {
          // Attempt to reconnect after a delay
          setTimeout(setupWebSocket, 5000);
        }
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket error occurred');
    };

    wsRef.current = ws;

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };
  }, [projectId, data.id, updateNodeData]);

  useEffect(() => {
    const cleanup = setupWebSocket();
    return cleanup;
  }, [setupWebSocket]);

  if (data.inputs.properties === undefined) {
    data.inputs.properties = {};
    data.outputs.properties = {};
  }

  const inputHandles = Object.entries(data.inputs.properties).map(
    ([input, schema], index, array) => (
      <HandleComponent
        key={`input-${input}`}
        type="target"
        position="left"
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
        position="right"
        id={output}
        schema={schema}
        index={index}
        total={array.length}
      />
    )
  );

  return (
    <NodeContainer>
      <NodeHeader
        data={data}
        projectId={projectId}
        updateNodeData={data.updateNodeData}
        onOpenModal={data.onOpenModal}
        onDeleteNode={data.onDelete}
      />
      <Typography variant="caption" color="text.secondary">
        {data.type}
      </Typography>
      {inputHandles}
      {outputHandles}
    </NodeContainer>
  );
});

export default CustomNode;
