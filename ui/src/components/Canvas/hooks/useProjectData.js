import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';

const getApiUrl = () => {
  switch (process.env.REACT_APP_ENV) {
    case 'production':
      return 'canvas-api.dev.r7ai.net';
    case 'development':
    default:
      return process.env.REACT_APP_API_URL || 'localhost:8000';
  }
};

const useProjectData = () => {
  const { projectId } = useParams();
  const { token } = useAuth();
  const { projects: projectsApi } = useApi();
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchRef = useRef(null);
  const wsRef = useRef(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [packagesResponse, connectionsResponse] = await Promise.all([
        projectsApi.listProjectPackages(projectId, token),
        projectsApi.listConnections(projectId, token),
      ]);

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
  }, [projectId, token, projectsApi]);

  useEffect(() => {
    fetchRef.current = fetchData;
    fetchData();

    // const cleanup = setupWebSocket();

    return () => {
      fetchRef.current = null;
      // cleanup();
    };
  }, [fetchData]);

  const refreshData = useCallback(() => {
    // if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    //   wsRef.current.send(JSON.stringify({ type: 'request_update' }));
    // } else {
    //   fetchData();
    // }
    fetchData();
  }, [fetchData]);

  return { projectData, isLoading, error, refreshData };
};

export default useProjectData;
