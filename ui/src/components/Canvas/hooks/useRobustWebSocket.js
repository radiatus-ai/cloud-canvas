import { useCallback, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAuth } from '../../../contexts/Auth';

const getApiUrl = () => {
  switch (process.env.REACT_APP_ENV) {
    case 'production':
      return 'wss://canvas-api.dev.r7ai.net';
    case 'development':
    default:
      return 'ws://localhost:8000';
  }
};

const useCanvasWebSocket = (projectId, updateEdges) => {
  const { token } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState('Connecting');
  const [error, setError] = useState(null);
  const reconnectCount = useRef(0);

  const getWebSocketUrl = useCallback(() => {
    return `${getApiUrl()}/projects/${projectId}/canvas/ws?token=${token}`;
  }, [projectId, token]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    getWebSocketUrl,
    {
      reconnectAttempts: Infinity,
      reconnectInterval: (attemptNumber) =>
        Math.min(Math.pow(2, attemptNumber) * 1000, 30000),
      shouldReconnect: (closeEvent) => true,
      onOpen: () => {
        console.log(
          `Canvas WebSocket connection opened for project ${projectId}`
        );
        setError(null);
        reconnectCount.current = 0;
      },
      onClose: () => {
        console.log(
          `Canvas WebSocket connection closed for project ${projectId}`
        );
        reconnectCount.current += 1;
      },
      onError: (event) => {
        console.error(
          `Canvas WebSocket error for project ${projectId}:`,
          event
        );
        setError('WebSocket error occurred');
      },
    }
  );

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(
        `New canvas message received for project ${projectId}:`,
        lastMessage.data
      );
      try {
        const message = JSON.parse(lastMessage.data);
        if (message.type === 'edge_update') {
          setError(null);
          updateEdges(message.data);
        } else if (message.type === 'error') {
          console.error('WebSocket error:', message.message);
          setError(message.message);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
        setError('Error parsing WebSocket message');
      }
    }
  }, [lastMessage, projectId, updateEdges]);

  useEffect(() => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        setConnectionStatus('Connecting');
        break;
      case ReadyState.OPEN:
        setConnectionStatus('Open');
        console.log(
          `Canvas WebSocket connection open for project ${projectId}`
        );
        break;
      case ReadyState.CLOSING:
        setConnectionStatus('Closing');
        break;
      case ReadyState.CLOSED:
        setConnectionStatus('Closed');
        setError(
          `Canvas WebSocket connection closed for project ${projectId}. Reconnect attempt: ${reconnectCount.current}`
        );
        break;
      default:
        setConnectionStatus('Unknown');
    }
  }, [readyState, projectId]);

  const sendJsonMessage = useCallback(
    (message) => {
      console.log(
        `Sending Canvas WebSocket message for project ${projectId}:`,
        message
      );
      sendMessage(JSON.stringify(message));
    },
    [sendMessage, projectId]
  );

  return {
    sendJsonMessage,
    connectionStatus,
    error,
  };
};

export default useCanvasWebSocket;
