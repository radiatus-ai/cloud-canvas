import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/Auth';
import useApi from '../hooks/useAPI';

const useEdgeInteractions = (setEdges) => {
  const { projectId } = useParams();
  const { token } = useAuth();
  const { projects: projectsApi } = useApi();

  const handleEdgeDelete = useCallback(
    async (edgeId) => {
      try {
        const [sourceId, targetId] = edgeId.split('-');
        await projectsApi.deleteConnection(
          projectId,
          sourceId,
          targetId,
          token
        );
        setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
      } catch (error) {
        console.error('Failed to delete connection:', error);
        // Here you might want to show an error message to the user
      }
    },
    [projectId, token, projectsApi, setEdges]
  );

  return { handleEdgeDelete };
};

export default useEdgeInteractions;
