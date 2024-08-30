import { useState, useCallback } from 'react';

const useNodeData = (initialData) => {
  const [nodeData, setNodeData] = useState(initialData);

  const updateNodeData = useCallback((updater) => {
    setNodeData((prevData) => {
      const newData =
        typeof updater === 'function' ? updater(prevData) : updater;
      return { ...prevData, ...newData };
    });
  }, []);

  return [nodeData, updateNodeData];
};

export default useNodeData;
