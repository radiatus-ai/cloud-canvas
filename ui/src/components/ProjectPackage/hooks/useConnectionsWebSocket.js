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

const useConnectionsWebSocket = (projectId) => {
  const { token } = useAuth();
  const [messageHistory, setMessageHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting');
  const [lastError, setLastError] = useState(null);
  const reconnectCount = useRef(0);

  const getWebSocketUrl = useCallback(() => {
    return `${getApiUrl()}/projects/${projectId}/connections/ws?token=${token}`;
  }, [projectId, token]);

  const { sendMessage, lastMessage, lastJsonMessage, readyState } =
    useWebSocket(getWebSocketUrl, {
      reconnectAttempts: Infinity,
      reconnectInterval: (attemptNumber) =>
        Math.min(Math.pow(2, attemptNumber) * 1000, 30000),
      shouldReconnect: (closeEvent) => true,
      onOpen: () => {
        console.log(
          `Connections WebSocket connection opened for project ${projectId}`
        );
        setLastError(null);
        reconnectCount.current = 0;
      },
      onClose: () => {
        console.log(
          `Connections WebSocket connection closed for project ${projectId}`
        );
        reconnectCount.current += 1;
      },
      onMessage: (event) => {
        console.log(
          `Connections WebSocket message received for project ${projectId}:`,
          event.data
        );
      },
      onError: (event) => {
        console.error(
          `Connections WebSocket error for project ${projectId}:`,
          event
        );
        setLastError('WebSocket error occurred');
      },
    });

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(
        `New connections message received for project ${projectId}:`,
        lastMessage.data
      );
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, projectId]);

  useEffect(() => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        setConnectionStatus('Connecting');
        break;
      case ReadyState.OPEN:
        setConnectionStatus('Open');
        console.log(
          `Connections WebSocket connection open for project ${projectId}`
        );
        break;
      case ReadyState.CLOSING:
        setConnectionStatus('Closing');
        break;
      case ReadyState.CLOSED:
        setConnectionStatus('Closed');
        setLastError(
          `Connections WebSocket connection closed for project ${projectId}. Reconnect attempt: ${reconnectCount.current}`
        );
        break;
      default:
        setConnectionStatus('Unknown');
    }
  }, [readyState, projectId]);

  const sendJsonMessage = useCallback(
    (message) => {
      console.log(
        `Sending Connections WebSocket message for project ${projectId}:`,
        message
      );
      sendMessage(JSON.stringify(message));
    },
    [sendMessage, projectId]
  );

  return {
    sendJsonMessage,
    messageHistory,
    connectionStatus,
    lastError,
  };
};

export default useConnectionsWebSocket;
