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
  return localStorage.getItem('authToken');
};

const CustomNode = memo(({ data, isConnectable }) => {
  const { projectId } = useParams();
  const wsRef = useRef(null);
  const [error, setError] = useState(null);
  const [nodeData, setNodeData] = useState(data);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  const updateNodeData = useCallback((updater) => {
    setNodeData((prevData) => {
      const newData =
        typeof updater === 'function' ? updater(prevData) : updater;
      return { ...prevData, ...newData };
    });
  }, []);

  const setupWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const authToken = getAuthToken();
    const ws = new WebSocket(
      `${getApiUrl()}/projects/${projectId}/packages/${
        nodeData.id
      }/ws?token=${authToken}`
    );

    console.log(
      'WebSocket connecting to:',
      `${getApiUrl()}/projects/${projectId}/packages/${
        nodeData.id
      }/ws?token=${authToken}`
    );

    let pingTimeout;
    const heartbeatInterval = 30000;
    const pingInterval = 5000;

    const heartbeat = () => {
      clearTimeout(pingTimeout);

      pingTimeout = setTimeout(() => {
        console.log('WebSocket connection is dead. Closing socket.');
        ws.close();
      }, pingInterval + 1000);
    };

    ws.onopen = () => {
      console.log('WebSocket connected');
      setError(null); // Clear any previous errors
      ws.send(JSON.stringify({ type: 'request_initial' }));
      heartbeat();
    };

    ws.onmessage = (event) => {
      try {
        console.log('WebSocket message:', event);
        const message = JSON.parse(event.data);
        console.log('Parsed WebSocket message:', message);
        if (message.type === 'package_update') {
          setError(null); // Clear any previous errors
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

    const intervalId = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, heartbeatInterval);

    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log(
          `WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`
        );
        setReconnectAttempts(0); // Reset attempts on clean close
      } else {
        console.error('WebSocket connection died', event);
        if (event.code === 1008) {
          setError('Authentication failed. Please log in again.');
        } else if (reconnectAttempts < maxReconnectAttempts) {
          const backoffTime = getBackoffTime(reconnectAttempts);
          console.log(`Attempting to reconnect in ${backoffTime}ms...`);
          setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            setupWebSocket();
          }, backoffTime);
        } else {
          setError(
            'Failed to reconnect after multiple attempts. Please refresh the page.'
          );
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
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (pingTimeout) {
        clearTimeout(pingTimeout);
      }
    };
  }, [projectId, nodeData.id, updateNodeData, reconnectAttempts]);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Network is back online. Reconnecting WebSocket...');
      setupWebSocket();
    };

    const handleOffline = () => {
      console.log(
        'Network is offline. WebSocket will attempt to reconnect when online.'
      );
      setError('Network is offline. Reconnecting when online...');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setupWebSocket]);

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
    </NodeContainer>
  );
});

export default CustomNode;

const getBackoffTime = (attempt) => {
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  const jitter = Math.random() * 1000; // Random delay between 0-1000ms
  return Math.min(Math.pow(2, attempt) * baseDelay + jitter, maxDelay);
};
