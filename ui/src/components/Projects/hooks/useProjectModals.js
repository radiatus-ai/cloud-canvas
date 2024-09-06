import { useCallback, useState } from 'react';

const useProjectModals = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);

  const handleEditProject = useCallback((project) => {
    console.log('handleEditProject called with project:', project);
    if (project && project.name) {
      // Ensure the project has a credentials array
      const projectWithCredentials = {
        ...project,
        credentials: Array.isArray(project.credentials)
          ? project.credentials
          : [],
      };
      console.log('Setting editProject:', projectWithCredentials);
      setEditProject(projectWithCredentials);
      setEditDialogOpen(true);
    } else {
      console.error('Invalid project data:', project);
    }
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setEditProject(null);
  }, []);

  const handleDeleteDialogOpen = useCallback((project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  }, []);

  return {
    editDialogOpen,
    editProject,
    deleteDialogOpen,
    projectToDelete,
    createProjectModalOpen,
    setCreateProjectModalOpen,
    handleEditProject,
    handleCloseEditDialog,
    handleDeleteDialogOpen,
    handleDeleteDialogClose,
  };
};

export default useProjectModals;
