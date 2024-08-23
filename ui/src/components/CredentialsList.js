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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/Auth';
import useApi from '../hooks/useAPI';
import DynamicModalForm from './DynamicModalForm';
import CredentialCreate from './CredentialsCreate';

const CredentialsList = () => {
  const [credentials, setCredentials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCredential, setEditCredential] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [credentialToDelete, setCredentialToDelete] = useState(null);
  const [createCredentialModalOpen, setCreateCredentialModalOpen] =
    useState(false);
  const { credentials: credentialsApi } = useApi();
  const { token } = useAuth();

  const credentialsApiRef = useRef(credentialsApi);
  const tokenRef = useRef(token);

  useEffect(() => {
    credentialsApiRef.current = credentialsApi;
    tokenRef.current = token;
  }, [credentialsApi, token]);

  const fetchCredentials = useCallback(async () => {
    const currentToken = tokenRef.current;
    if (!currentToken) return;
    setIsLoading(true);
    try {
      const response = await credentialsApiRef.current.list(currentToken);
      setCredentials(response.body);
      setError(null);
    } catch (err) {
      setError('Failed to load credentials. Please try again later.');
      console.error('Error fetching credentials:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const handleCreateCredential = async (credentialData) => {
    try {
      const response = await credentialsApi.create(credentialData, token);
      setCredentials([...credentials, response.body]);
    } catch (err) {
      setError('Failed to create credential. Please try again.');
      console.error('Error creating credential:', err);
    }
  };

  const handleEditCredential = (credential) => {
    setEditCredential(credential);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditCredential(null);
  };

  const handleUpdateCredential = async (updatedData) => {
    try {
      const response = await credentialsApi.update(
        editCredential.id,
        updatedData,
        token
      );
      setCredentials(
        credentials.map((c) => (c.id === response.body.id ? response.body : c))
      );
      handleCloseEditDialog();
    } catch (err) {
      setError('Failed to update credential. Please try again.');
      console.error('Error updating credential:', err);
    }
  };

  const handleDeleteDialogOpen = (credential) => {
    setCredentialToDelete(credential);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setCredentialToDelete(null);
  };

  const handleDeleteCredential = async () => {
    if (!credentialToDelete) return;
    try {
      await credentialsApi.delete(credentialToDelete.id, token);
      setCredentials(credentials.filter((c) => c.id !== credentialToDelete.id));
      handleDeleteDialogClose();
    } catch (err) {
      setError('Failed to delete credential. Please try again.');
      console.error('Error deleting credential:', err);
    }
  };

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
            Credentials
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateCredentialModalOpen(true)}
          >
            Create Credential
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

      <CredentialCreate
        isOpen={createCredentialModalOpen}
        onClose={() => setCreateCredentialModalOpen(false)}
        onSubmit={handleCreateCredential}
      />

      <DynamicModalForm
        isOpen={editDialogOpen}
        onClose={handleCloseEditDialog}
        schema={{
          type: 'object',
          properties: {
            name: { type: 'string', title: 'Credential Name' },
            credential_type: {
              type: 'string',
              title: 'Credential Type',
              enum: ['API_KEY', 'GITHUB_PAT', 'GCP_SERVICE_ACCOUNT'],
            },
          },
        }}
        onSubmit={handleUpdateCredential}
        initialData={editCredential}
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
            handleDeleteCredential();
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

export default CredentialsList;
