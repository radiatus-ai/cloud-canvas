import { useCallback, useState } from 'react';

const useCredentialModals = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCredential, setEditCredential] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [credentialToDelete, setCredentialToDelete] = useState(null);
  const [createCredentialModalOpen, setCreateCredentialModalOpen] =
    useState(false);

  const handleEditCredential = useCallback((credential) => {
    setEditCredential({
      ...credential,
      secret: '',
    });
    setEditDialogOpen(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setEditCredential(null);
  }, []);

  const handleDeleteDialogOpen = useCallback((credential) => {
    setCredentialToDelete(credential);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDeleteDialogOpen(false);
    setCredentialToDelete(null);
  }, []);

  return {
    editDialogOpen,
    editCredential,
    deleteDialogOpen,
    credentialToDelete,
    createCredentialModalOpen,
    setCreateCredentialModalOpen,
    handleEditCredential,
    handleCloseEditDialog,
    handleDeleteDialogOpen,
    handleDeleteDialogClose,
  };
};

export default useCredentialModals;
