import { useState } from 'react';

export const useNodeStatus = (initialStatus) => {
  const [status, setStatus] = useState(initialStatus);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeploy = () => {
    setStatus('DEPLOYING');
    // Add deployment logic here
  };

  const handleDestroy = () => {
    setStatus('DESTROYING');
    // Add destruction logic here
  };

  const handleDelete = async (onDeleteNode, nodeId) => {
    try {
      setIsDeleting(true);
      await onDeleteNode(nodeId);
    } catch (error) {
      setIsDeleting(false);
      throw error;
    }
  };

  return {
    status,
    isDeleting,
    handleDeploy,
    handleDestroy,
    handleDelete,
  };
};
