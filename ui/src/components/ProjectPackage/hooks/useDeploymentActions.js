import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';

const useDeploymentActions = (nodeId, updateLocalDeployStatus, setError) => {
  const { projectId } = useParams();
  const { token } = useAuth();
  const { projects: projectsApi } = useApi();

  const handleDeploy = useCallback(async () => {
    updateLocalDeployStatus('DEPLOYING');
    try {
      await projectsApi.deployPackage(projectId, nodeId, token);
    } catch (error) {
      console.error('Deployment failed:', error);
      updateLocalDeployStatus('FAILED');
      setError(
        'Deployment failed. Please check the logs for more information.'
      );
    }
  }, [
    projectId,
    nodeId,
    updateLocalDeployStatus,
    projectsApi,
    token,
    setError,
  ]);

  const handleDestroy = useCallback(async () => {
    updateLocalDeployStatus('DESTROYING');
    try {
      await projectsApi.destroyPackage(projectId, nodeId, token);
    } catch (error) {
      console.error('Destruction failed:', error);
      updateLocalDeployStatus('FAILED');
      setError(
        'Destruction failed. Please check the logs for more information.'
      );
    }
  }, [
    projectId,
    nodeId,
    updateLocalDeployStatus,
    projectsApi,
    token,
    setError,
  ]);

  return { handleDeploy, handleDestroy };
};

export default useDeploymentActions;
