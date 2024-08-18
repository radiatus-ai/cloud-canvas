import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesResponse, connectionsResponse] = await Promise.all([
          projectsApi.listPackages(projectId, token),
          projectsApi.listConnections(projectId, token),
        ]);
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

    fetchData();
  }, [projectId, token, projectsApi]);

  return { projectData, isLoading, error };
};

export default useProjectData;
