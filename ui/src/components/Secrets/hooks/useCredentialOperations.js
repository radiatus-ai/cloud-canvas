import { useCallback, useState } from 'react';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';

const useCredentialOperations = (credentials, setCredentials, setError) => {
  const { credentials: credentialsApi } = useApi();
  const { token } = useAuth();
  const [creatingCredentials, setCreatingCredentials] = useState([]);
  const [deletingCredentials, setDeletingCredentials] = useState([]);

  const handleCreateCredential = useCallback(
    async (credentialData) => {
      const tempId = Date.now().toString();
      setCreatingCredentials((prev) => [
        ...prev,
        { ...credentialData, id: tempId },
      ]);
      try {
        const response = await credentialsApi.create(credentialData, token);
        setCredentials((prev) =>
          prev.filter((c) => c.id !== tempId).concat([response.body])
        );
      } catch (err) {
        setError('Failed to create credential. Please try again.');
        console.error('Error creating credential:', err);
      } finally {
        setCreatingCredentials((prev) => prev.filter((c) => c.id !== tempId));
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
      console.log('Deleting credential:', credentialId);
      setDeletingCredentials((prev) => [...prev, credentialId]);
      try {
        console.log('Calling delete API...');
        await credentialsApi.delete(credentialId, token);
        console.log('Delete API call successful');
        setCredentials((prev) => prev.filter((c) => c.id !== credentialId));
      } catch (err) {
        console.error('Error in delete API call:', err);
        setError('Failed to delete credential. Please try again.');
        throw err; // Re-throw the error so it can be caught in the component
      } finally {
        setDeletingCredentials((prev) =>
          prev.filter((id) => id !== credentialId)
        );
      }
    },
    [credentialsApi, token, setCredentials, setError]
  );

  return {
    creatingCredentials,
    deletingCredentials,
    handleCreateCredential,
    handleUpdateCredential,
    handleDeleteCredential,
  };
};

export default useCredentialOperations;
