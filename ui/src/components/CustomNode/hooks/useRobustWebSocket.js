import { useEffect, useCallback, useState, useRef } from 'react';
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

const useRobustWebSocket = (projectId, packageId) => {
  const { token } = useAuth();
  const [messageHistory, setMessageHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting');
  const [lastError, setLastError] = useState(null);
  const reconnectCount = useRef(0);

  const getWebSocketUrl = useCallback(() => {
    return `${getApiUrl()}/projects/${projectId}/packages/${packageId}/ws?token=${token}`;
  }, [projectId, packageId, token]);

  const { sendMessage, lastMessage, lastJsonMessage, readyState } =
    useWebSocket(getWebSocketUrl, {
      reconnectAttempts: Infinity,
      reconnectInterval: (attemptNumber) =>
        Math.min(Math.pow(2, attemptNumber) * 1000, 30000),
      shouldReconnect: (closeEvent) => true,
      onOpen: () => {
        console.log(`WebSocket connection opened for package ${packageId}`);
        setLastError(null);
        reconnectCount.current = 0;
      },
      onClose: () => {
        console.log(`WebSocket connection closed for package ${packageId}`);
        reconnectCount.current += 1;
      },
      onMessage: (event) => {
        console.log(
          `WebSocket message received for package ${packageId}:`,
          event.data
        );
      },
      onError: (event) => {
        console.error(`WebSocket error for package ${packageId}:`, event);
        setLastError('WebSocket error occurred');
      },
    });

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(
        `New message received for package ${packageId}:`,
        lastMessage.data
      );
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, packageId]);

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
        setLastError(
          `WebSocket connection closed for package ${packageId}. Reconnect attempt: ${reconnectCount.current}`
        );
        break;
      default:
        setConnectionStatus('Unknown');
    }
  }, [readyState, packageId]);

  useEffect(() => {
    if (lastJsonMessage) {
      console.log(
        `Parsed JSON message for package ${packageId}:`,
        lastJsonMessage
      );
    }
  }, [lastJsonMessage, packageId]);

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
    messageHistory,
    connectionStatus,
    lastError,
  };
};

export default useRobustWebSocket;
