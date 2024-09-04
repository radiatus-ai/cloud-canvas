import { useState, useCallback } from 'react';

const useLocalDeployStatus = (initialStatus) => {
  const [localDeployStatus, setLocalDeployStatus] = useState(initialStatus);

  const updateLocalDeployStatus = useCallback((newStatus) => {
    setLocalDeployStatus(newStatus);
  }, []);

  return [localDeployStatus, updateLocalDeployStatus];
};

export default useLocalDeployStatus;
