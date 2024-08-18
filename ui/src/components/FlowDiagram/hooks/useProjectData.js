import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';

const useProjectData = () => {
  const { projectId } = useParams();
  const { token } = useAuth();
  const { projects: projectsApi } = useApi();
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchRef = useRef(null); // Use a ref to track the current fetch

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [packagesResponse, connectionsResponse] = await Promise.all([
          projectsApi.listProjectPackages(projectId, token),
          projectsApi.listConnections(projectId, token),
        ]);

        // Check if the component is still interested in this fetch result
        if (fetchRef.current !== fetchData) return;

        setProjectData({
          packages: packagesResponse.body,
          connections: connectionsResponse.body,
        });
        setError(null);
      } catch (err) {
        setError('Failed to load project data');
        console.error('Error fetching project data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Assign the fetch function to the ref to track it
    fetchRef.current = fetchData;

    fetchData();

    // Cleanup function to reset the ref
    return () => {
      fetchRef.current = null;
    };
  }, [projectId, token, projectsApi]);

  return { projectData, isLoading, error };
};

export default useProjectData;
