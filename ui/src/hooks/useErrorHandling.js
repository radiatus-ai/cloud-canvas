import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';

const useErrorHandling = () => {
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleError = useCallback(
    (error) => {
      console.error('An error occurred:', error);
      setError(error);
      enqueueSnackbar(error.message || 'An unexpected error occurred', {
        variant: 'error',
      });
    },
    [enqueueSnackbar]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};

export default useErrorHandling;
