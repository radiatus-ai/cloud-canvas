import { useEffect } from 'react';

const useWebSocketEffect = (messageHistory, updateNodeData, setError) => {
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
  }, [messageHistory, updateNodeData, setError]);
};

export default useWebSocketEffect;
