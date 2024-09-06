import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import JsonSchemaForm from 'react-json-schema-form';
import LoadingButton from '../LoadingButton';
import RadDialog from '../RadDialog';
import CreateSecretModal from './components/CreateSecretModal';
import UpdateSecretModal from './components/UpdateSecretModal';
import useCredentialModals from './hooks/useCredentialModals';
import useCredentialOperations from './hooks/useCredentialOperations';
import useCredentialsFetch from './hooks/useCredentialsFetch';

const Secrets = () => {
  const { credentials, setCredentials, isLoading, error, setError } =
    useCredentialsFetch();
  const {
    creatingCredentials,
    deletingCredentials,
    handleCreateCredential,
    handleUpdateCredential,
    handleDeleteCredential,
  } = useCredentialOperations(credentials, setCredentials, setError);
  const {
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
  } = useCredentialModals();

  const [isCreating, setIsCreating] = useState(false);

  const createSecretFormRef = useRef(null);
  const editFormRef = useRef(null);
  const deleteFormRef = useRef(null);

  const handleCreateCredentialSubmit = useCallback(
    async (formData) => {
      setIsCreating(true);
      try {
        await handleCreateCredential(formData);
      } catch (error) {
        console.error('Error creating credential:', error);
        setError('Failed to create credential. Please try again.');
      } finally {
        setIsCreating(false);
      }
    },
    [handleCreateCredential, setError]
  );

  const handleDeleteSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log('Delete submit triggered');
      if (deleteFormRef.current) {
        const isValid = await deleteFormRef.current.submit();
        if (isValid) {
          const { confirm } = deleteFormRef.current.getData();
          if (confirm) {
            try {
              await handleDeleteCredential(credentialToDelete.id);
              handleDeleteDialogClose();
            } catch (error) {
              console.error('Error deleting credential:', error);
              setError('Failed to delete credential. Please try again.');
            }
          } else {
            setError('You must confirm the deletion.');
          }
        }
      }
    },
    [
      handleDeleteCredential,
      credentialToDelete,
      handleDeleteDialogClose,
      setError,
    ]
  );

  useEffect(() => {
    if (!createCredentialModalOpen && createSecretFormRef.current) {
      createSecretFormRef.current.reset();
    }
  }, [createCredentialModalOpen]);

  if (isLoading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h1">
            SECRETS
          </Typography>
          <LoadingButton
            variant="contained"
            color="primary"
            data-cy="create-secret-button"
            onClick={() => setCreateCredentialModalOpen(true)}
            loading={isCreating}
          >
            CREATE
          </LoadingButton>
        </Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Grid container spacing={3}>
          {credentials.map((credential) => (
            <Grid item xs={12} sm={6} md={4} key={credential.id}>
              <Card
                sx={{
                  opacity: deletingCredentials.includes(credential.id)
                    ? 0.5
                    : 1,
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {credential.name}
                  </Typography>
                  <Typography color="textSecondary">
                    Type: {credential.credential_type}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => handleEditCredential(credential)}
                    size="small"
                    color="primary"
                    disabled={deletingCredentials.includes(credential.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteDialogOpen(credential)}
                    size="small"
                    disabled={deletingCredentials.includes(credential.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {creatingCredentials.map((credential) => (
            <Grid item xs={12} sm={6} md={4} key={credential.id}>
              <Card sx={{ opacity: 0.5 }}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {credential.name}
                  </Typography>
                  <Typography color="textSecondary">
                    Type: {credential.credential_type}
                  </Typography>
                  <CircularProgress size={24} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <CreateSecretModal
        ref={createSecretFormRef}
        isOpen={createCredentialModalOpen}
        onClose={() => setCreateCredentialModalOpen(false)}
        onSubmit={handleCreateCredentialSubmit}
        isLoading={isCreating}
      />

      <UpdateSecretModal
        ref={editFormRef}
        isOpen={editDialogOpen}
        onClose={handleCloseEditDialog}
        onSubmit={handleUpdateCredential}
        credential={editCredential}
      />

      <RadDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        title="Delete Credential"
        actions={
          <>
            <LoadingButton onClick={handleDeleteDialogClose} color="primary">
              Cancel
            </LoadingButton>
            <LoadingButton
              onClick={handleDeleteSubmit}
              color="primary"
              variant="contained"
              loading={deletingCredentials.includes(credentialToDelete?.id)}
            >
              Delete
            </LoadingButton>
          </>
        }
      >
        <JsonSchemaForm
          ref={deleteFormRef}
          schema={{
            type: 'object',
            properties: {
              confirm: {
                type: 'boolean',
                title: 'Are you sure you want to delete this credential?',
                default: false,
              },
            },
            required: ['confirm'],
          }}
          initialData={{ confirm: false }}
          hideSubmitButton={true}
        />
      </RadDialog>
    </Container>
  );
};

export default Secrets;
