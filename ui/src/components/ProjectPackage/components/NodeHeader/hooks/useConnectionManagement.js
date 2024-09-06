import { useCallback } from 'react';

export const useConnectionManagement = (
  projectId,
  token,
  projectsApi,
  onDeleteConnection
) => {
  const handleDeleteConnection = useCallback(
    async (connectionId) => {
      try {
        const idParts = connectionId.split('-');
        const sourcePackageId = idParts.slice(0, 5).join('-');
        const targetPackageId = idParts.slice(-5).join('-');
        await projectsApi.deleteConnection(
          projectId,
          sourcePackageId,
          targetPackageId,
          token
        );
        onDeleteConnection(connectionId);
      } catch (error) {
        console.error('Failed to delete connection:', error);
        throw new Error('Failed to delete connection. Please try again.');
      }
    },
    [projectId, token, projectsApi, onDeleteConnection]
  );

  return { handleDeleteConnection };
};
