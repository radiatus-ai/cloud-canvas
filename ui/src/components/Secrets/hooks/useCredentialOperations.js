import { useCallback } from 'react';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';

const useCredentialOperations = (credentials, setCredentials, setError) => {
  const { credentials: credentialsApi } = useApi();
  const { token } = useAuth();

  const handleCreateCredential = useCallback(
    async (credentialData) => {
      try {
        const response = await credentialsApi.create(credentialData, token);
        setCredentials((prev) => [...prev, response.body]);
      } catch (err) {
        setError('Failed to create credential. Please try again.');
        console.error('Error creating credential:', err);
      }
    },
    [credentialsApi, token, setCredentials, setError]
  );

  const handleUpdateCredential = useCallback(
    async (credentialId, updatedData) => {
      try {
        const response = await credentialsApi.update(
          credentialId,
          { secret: updatedData.secret },
          token
        );
        setCredentials((prev) =>
          prev.map((c) => (c.id === response.body.id ? response.body : c))
        );
      } catch (err) {
        setError('Failed to update credential. Please try again.');
        console.error('Error updating credential:', err);
      }
    },
    [credentialsApi, token, setCredentials, setError]
  );

  const handleDeleteCredential = useCallback(
    async (credentialId) => {
      try {
        await credentialsApi.delete(credentialId, token);
        setCredentials((prev) => prev.filter((c) => c.id !== credentialId));
      } catch (err) {
        setError('Failed to delete credential. Please try again.');
        console.error('Error deleting credential:', err);
      }
    },
    [credentialsApi, token, setCredentials, setError]
  );

  return {
    handleCreateCredential,
    handleUpdateCredential,
    handleDeleteCredential,
  };
};

export default useCredentialOperations;
