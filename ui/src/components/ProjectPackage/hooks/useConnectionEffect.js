import { useEffect } from 'react';

const useConnectionEffect = (connectionStatus, sendJsonMessage, setError) => {
  useEffect(() => {
    if (connectionStatus === 'Open') {
      sendJsonMessage({ type: 'request_initial' });
    }
  }, [connectionStatus, sendJsonMessage]);

  // figure out good UX later, if we even
  // useEffect(() => {
  //   if (connectionStatus === 'Closed') {
  //     setError('WebSocket connection closed. Please refresh the page.');
  //   } else {
  //     setError(null);
  //   }
  // }, [connectionStatus, setError]);
};

export default useConnectionEffect;
