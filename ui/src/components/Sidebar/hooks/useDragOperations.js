import { useCallback } from 'react';

const useDragOperations = () => {
  const handleDragStart = useCallback(
    (packageData) => (event) => {
      event.dataTransfer.setData(
        'application/reactflow',
        JSON.stringify(packageData)
      );
      event.dataTransfer.setData('text/plain', JSON.stringify(packageData));
    },
    []
  );

  return { handleDragStart };
};

export default useDragOperations;
