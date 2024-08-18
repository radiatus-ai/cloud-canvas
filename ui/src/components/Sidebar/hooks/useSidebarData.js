import { useEffect, useState } from 'react';
import useApi from '../../../hooks/useAPI';

const useSidebarData = () => {
  const { projects } = useApi();
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      try {
        const token = 'foobar';
        const data = await projects.listPackages(token); // Ensure `projectId` and `token` are available
        setPackages(data.body); // Assuming data is in `body`
        setError(null);
      } catch (err) {
        setError('Failed to load packages. Please try again later.');
        console.error('Error fetching packages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, [projects]);

  return { packages, isLoading, error };
};

export default useSidebarData;
