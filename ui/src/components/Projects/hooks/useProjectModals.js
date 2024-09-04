import { useCallback, useState } from 'react';

const useProjectModals = (fetchProject) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);

  const handleEditProject = useCallback(
    async (project) => {
      if (project && project.name) {
        const fullProject = await fetchProject(project.id);
        setEditProject(fullProject);
        setEditDialogOpen(true);
      }
    },
    [fetchProject]
  );

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
