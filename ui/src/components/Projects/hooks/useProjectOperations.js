import { useCallback, useState } from 'react';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';

const useProjectOperations = (projects, setProjects, setError) => {
  const [creatingProjects, setCreatingProjects] = useState([]);
  const [deletingProjects, setDeletingProjects] = useState([]);
  const { projects: projectsApi } = useApi();
  const { token } = useAuth();

  const handleCreateProject = useCallback(
    async (projectData) => {
      const tempId = Date.now().toString();
      setCreatingProjects((prev) => [...prev, { ...projectData, id: tempId }]);
      try {
        const response = await projectsApi.create(projectData, token);
        setProjects((prev) => [...prev, response.body]);
        setCreatingProjects((prev) => prev.filter((p) => p.id !== tempId));
      } catch (err) {
        setError('Failed to create project. Please try again.');
        console.error('Error creating project:', err);
        setCreatingProjects((prev) => prev.filter((p) => p.id !== tempId));
      }
    },
    [projectsApi, token, setProjects, setError]
  );

  const handleUpdateProject = useCallback(
    async (projectId, updatedData) => {
      try {
        const response = await projectsApi.update(
          projectId,
          {
            name: updatedData.name,
            credential_ids: updatedData.credentials,
          },
          token
        );
        setProjects((prev) =>
          prev.map((p) => (p.id === response.body.id ? response.body : p))
        );
      } catch (err) {
        setError('Failed to update project. Please try again.');
        console.error('Error updating project:', err);
      }
    },
    [projectsApi, token, setProjects, setError]
  );

  const handleDeleteProject = useCallback(
    async (projectId) => {
      setDeletingProjects((prev) => [...prev, projectId]);
      try {
        await projectsApi.delete(projectId, token);
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
      } catch (err) {
        setError('Failed to delete project. Please try again.');
        console.error('Error deleting project:', err);
      } finally {
        setDeletingProjects((prev) => prev.filter((id) => id !== projectId));
      }
    },
    [projectsApi, token, setProjects, setError]
  );

  return {
    creatingProjects,
    deletingProjects,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
  };
};

export default useProjectOperations;
