import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';

const useProjectsFetch = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projects: projectsApi } = useApi();
  const { token } = useAuth();
  const projectsApiRef = useRef(projectsApi);

  useEffect(() => {
    projectsApiRef.current = projectsApi;
  }, [projectsApi, token]);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await projectsApiRef.current.list(token);
      setProjects(response.body);
      console.log('Projects:', response.body);
      setError(null);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchProject = useCallback(
    async (projectId) => {
      try {
        const response = await projectsApiRef.current.get(projectId, token);
        console.log('Project:', response.body);
        return response.body;
      } catch (err) {
        setError('Failed to load project details. Please try again later.');
        console.error('Error fetching project details:', err);
        return null;
      }
    },
    [token]
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    setProjects,
    isLoading,
    error,
    setError,
    fetchProjects,
    fetchProject,
  };
};

export default useProjectsFetch;
