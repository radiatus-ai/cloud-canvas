import { useEffect, useRef, useState, useCallback } from 'react';
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

  // const setupWebSocket = useCallback(() => {
  //   if (wsRef.current) {
  //     wsRef.current.close();
  //   }

  //   const ws = new WebSocket(`ws://${getApiUrl()}/projects/${projectId}/packages/53af8da2-dfcb-45e4-98ab-d8cf244c0850/ws`);

  //   ws.onopen = () => {
  //     console.log('WebSocket connected');
  //     // Request initial update
  //     ws.send(JSON.stringify({ type: 'request_update' }));
  //   };

  //   ws.onmessage = (event) => {
  //     try {
  //       console.log('WebSocket message:', event);
  //       const message = JSON.parse(event.data);
  //       // this only has id in it
  //       if (message.type === 'package_update') {
  //         setProjectData((prevData) => ({
  //           ...prevData,
  //           packages: prevData?.packages?.map((pkg) =>
  //             pkg.id === message.data.id ? { ...pkg, ...message.data } : pkg
  //           ),
  //         }));
  //       } else if (message.type === 'error') {
  //         console.error('WebSocket error:', message.message);
  //         setError(message.message);
  //       }
  //     } catch (err) {
  //       console.error('Error parsing WebSocket message:', err);
  //       setError('Error parsing WebSocket message');
  //     }
  //   };

  //   ws.onclose = (event) => {
  //     if (event.wasClean) {
  //       console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
  //     } else {
  //       console.error('WebSocket connection died');
  //       // Attempt to reconnect after a delay
  //       setTimeout(setupWebSocket, 5000);
  //     }
  //   };

  //   ws.onerror = (error) => {
  //     console.error('WebSocket error:', error);
  //     setError('WebSocket error occurred');
  //   };

  //   wsRef.current = ws;

  //   return () => {
  //     if (wsRef.current) {
  //       wsRef.current.close();
  //     }
  //   };
  // }, [projectId]);

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
