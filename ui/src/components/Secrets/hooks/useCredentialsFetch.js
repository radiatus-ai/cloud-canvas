import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';

const useCredentialsFetch = () => {
  const [credentials, setCredentials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { credentials: credentialsApi } = useApi();
  const { token } = useAuth();
  const credentialsApiRef = useRef(credentialsApi);
  const tokenRef = useRef(token);

  useEffect(() => {
    credentialsApiRef.current = credentialsApi;
    tokenRef.current = token;
  }, [credentialsApi, token]);

  const fetchCredentials = useCallback(async () => {
    const currentToken = tokenRef.current;
    if (!currentToken) return;
    setIsLoading(true);
    try {
      const response = await credentialsApiRef.current.list(currentToken);
      setCredentials(response.body);
      setError(null);
    } catch (err) {
      setError('Failed to load credentials. Please try again later.');
      console.error('Error fetching credentials:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  return {
    credentials,
    setCredentials,
    isLoading,
    error,
    setError,
    fetchCredentials,
  };
};

export default useCredentialsFetch;
