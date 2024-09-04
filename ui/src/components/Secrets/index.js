import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import JsonSchemaForm from 'react-json-schema-form';
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

  const createSecretFormRef = useRef(null);
  const editFormRef = useRef(null);
  const deleteFormRef = useRef(null);

  const handleCreateCredentialSubmit = useCallback(
    async (formData) => {
      try {
        await handleCreateCredential(formData);
        setCreateCredentialModalOpen(false);
      } catch (error) {
        console.error('Error creating credential:', error);
        setError('Failed to create credential. Please try again.');
      }
    },
    [handleCreateCredential, setCreateCredentialModalOpen, setError]
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
          <Button
            variant="contained"
            color="primary"
            data-cy="create-secret-button"
            onClick={() => setCreateCredentialModalOpen(true)}
          >
            CREATE
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Grid container spacing={3}>
          {credentials.map((credential) => (
            <Grid item xs={12} sm={6} md={4} key={credential.id}>
              <Card>
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
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteDialogOpen(credential)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
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
            <Button onClick={handleDeleteDialogClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (deleteFormRef.current) {
                  const isValid = await deleteFormRef.current.submit();
                  if (isValid) {
                    const { confirm } = deleteFormRef.current.getData();
                    if (confirm) {
                      handleDeleteCredential(credentialToDelete.id);
                    } else {
                      setError('You must confirm the deletion.');
                    }
                  }
                }
              }}
              color="primary"
              variant="contained"
            >
              Delete
            </Button>
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
          }}
          initialData={{ confirm: false }}
          hideSubmitButton={true}
        />
      </RadDialog>
    </Container>
  );
};

export default Secrets;
