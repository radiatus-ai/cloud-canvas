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
import React from 'react';
import DynamicModalForm from '../DynamicModalForm';
import CreateSecretModal from './components/CreateSecretModal';
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
        isOpen={createCredentialModalOpen}
        onClose={() => setCreateCredentialModalOpen(false)}
        onSubmit={handleCreateCredential}
      />

      <DynamicModalForm
        isOpen={editDialogOpen && editCredential !== null}
        onClose={handleCloseEditDialog}
        schema={{
          type: 'object',
          properties: {
            name: { type: 'string', title: 'Credential Name', readOnly: true },
            credential_type: {
              type: 'string',
              title: 'Credential Type',
              readOnly: true,
            },
            secret: { type: 'string', title: 'New Secret Value' },
          },
          required: ['secret'],
        }}
        onSubmit={(updatedData) =>
          handleUpdateCredential(editCredential.id, updatedData)
        }
        initialData={editCredential || {}}
        title="Edit Credential"
      />

      <DynamicModalForm
        isOpen={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
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
        onSubmit={({ confirm }) => {
          if (confirm) {
            handleDeleteCredential(credentialToDelete.id);
          } else {
            setError('You must confirm the deletion.');
          }
        }}
        initialData={{ confirm: false }}
        title="Delete Credential"
      />
    </Container>
  );
};

export default Secrets;
