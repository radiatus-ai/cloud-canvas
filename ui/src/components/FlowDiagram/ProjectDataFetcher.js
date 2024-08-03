import { useEffect, useState } from 'react';
import apiService from '../../apiService';

const ProjectDataFetcher = ({ projectId, setNodes, setEdges, children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        const [infraData, edgesData] = await Promise.all([
          apiService.fetchPackages(projectId),
          apiService.fetchConnections(projectId),
        ]);
        const newNodes = apiService.transformToNodes(infraData);
        setNodes(newNodes);
        setEdges(edgesData);
        setError(null);
      } catch (err) {
        setError('Failed to load project data. Please try again later.');
        console.error('Error fetching project data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, setNodes, setEdges]);

  if (isLoading) {
    return <div>Loading project data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return children;
};

export default ProjectDataFetcher;
