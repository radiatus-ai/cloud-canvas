import { useState } from 'react';
import { validateConnections } from '../../../utils/validate';

export const useValidation = () => {
  const [validationResult, setValidationResult] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const validateNode = (data, edges) => {
    const result = validateConnections(data, edges);
    setValidationResult(result);
    return result.valid;
  };

  const openConfirmDialog = () => setIsConfirmDialogOpen(true);
  const closeConfirmDialog = () => setIsConfirmDialogOpen(false);

  return {
    validationResult,
    isConfirmDialogOpen,
    validateNode,
    openConfirmDialog,
    closeConfirmDialog,
  };
};
