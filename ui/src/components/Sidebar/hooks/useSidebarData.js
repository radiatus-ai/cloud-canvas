import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';

const useSidebarData = () => {
  const { projects } = useApi();
  const { token } = useAuth();
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackages = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await projects.listPackages(token);
      setPackages(data.body);
      setError(null);
    } catch (err) {
      setError('Failed to load packages. Please try again later.');
      console.error('Error fetching packages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projects, token]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return { packages, isLoading, error, refetchPackages: fetchPackages };
};

export default useSidebarData;
