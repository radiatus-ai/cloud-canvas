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

const useRobustWebSocket = (projectId, packageId, updateNodeData) => {
  const { token } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState('Connecting');
  const [error, setError] = useState(null);
  const reconnectCount = useRef(0);

  const getWebSocketUrl = useCallback(() => {
    return `${getApiUrl()}/projects/${projectId}/packages/${packageId}/ws?token=${token}`;
  }, [projectId, packageId, token]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    getWebSocketUrl,
    {
      reconnectAttempts: Infinity,
      reconnectInterval: (attemptNumber) =>
        Math.min(Math.pow(2, attemptNumber) * 1000, 30000),
      shouldReconnect: (closeEvent) => true,
      onOpen: () => {
        console.log(`WebSocket connection opened for package ${packageId}`);
        setError(null);
        reconnectCount.current = 0;
      },
      onClose: () => {
        console.log(`WebSocket connection closed for package ${packageId}`);
        reconnectCount.current += 1;
      },
      onError: (event) => {
        console.error(`WebSocket error for package ${packageId}:`, event);
        setError('WebSocket error occurred');
      },
    }
  );

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(
        `New message received for package ${packageId}:`,
        lastMessage.data
      );
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
  }, [lastMessage, packageId, updateNodeData]);

  useEffect(() => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        setConnectionStatus('Connecting');
        break;
      case ReadyState.OPEN:
        setConnectionStatus('Open');
        console.log(`WebSocket connection open for package ${packageId}`);
        break;
      case ReadyState.CLOSING:
        setConnectionStatus('Closing');
        break;
      case ReadyState.CLOSED:
        setConnectionStatus('Closed');
        setError(
          `WebSocket connection closed for package ${packageId}. Reconnect attempt: ${reconnectCount.current}`
        );
        break;
      default:
        setConnectionStatus('Unknown');
    }
  }, [readyState, packageId]);

  const sendJsonMessage = useCallback(
    (message) => {
      console.log(
        `Sending WebSocket message for package ${packageId}:`,
        message
      );
      sendMessage(JSON.stringify(message));
    },
    [sendMessage, packageId]
  );

  return {
    sendJsonMessage,
    connectionStatus,
    error,
  };
};

export default useRobustWebSocket;
