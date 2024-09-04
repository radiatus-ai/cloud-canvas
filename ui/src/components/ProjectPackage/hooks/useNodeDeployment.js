// useNodeDeployment.js
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';

const useNodeDeployment = (nodeId, initialStatus) => {
  const [deployStatus, setDeployStatus] = useState(initialStatus);
  const [error, setError] = useState(null);
  const { projectId } = useParams();
  const { token } = useAuth();
  const { projects: projectsApi } = useApi();

  const handleDeploy = useCallback(async () => {
    setDeployStatus('DEPLOYING');
    try {
      await projectsApi.deployPackage(projectId, nodeId, token);
    } catch (error) {
      console.error('Deployment failed:', error);
      setDeployStatus('FAILED');
      setError(
        'Deployment failed. Please check the logs for more information.'
      );
    }
  }, [projectId, nodeId, projectsApi, token]);

  const handleDestroy = useCallback(async () => {
    setDeployStatus('DESTROYING');
    try {
      await projectsApi.destroyPackage(projectId, nodeId, token);
    } catch (error) {
      console.error('Destruction failed:', error);
      setDeployStatus('FAILED');
      setError(
        'Destruction failed. Please check the logs for more information.'
      );
    }
  }, [projectId, nodeId, projectsApi, token]);

  return { deployStatus, error, handleDeploy, handleDestroy };
};

export default useNodeDeployment;
