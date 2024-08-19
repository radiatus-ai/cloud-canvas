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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Auth';
import useApi from '../hooks/useAPI';
import DynamicModalForm from './DynamicModalForm';
import CreateProjectModal from './ProjectCreate';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const { projects: projectsApi } = useApi();
  const { token } = useAuth();
  const navigate = useNavigate();

  const projectsApiRef = useRef(projectsApi);
  const tokenRef = useRef(token);

  useEffect(() => {
    projectsApiRef.current = projectsApi;
    tokenRef.current = token;
  }, [projectsApi, token]);

  const fetchProjects = useCallback(async () => {
    const currentToken = tokenRef.current;
    if (!currentToken) return;
    setIsLoading(true);
    try {
      const response = await projectsApiRef.current.list(currentToken);
      setProjects(response.body);
      setError(null);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (projectData) => {
    try {
      const response = await projectsApi.create(
        {
          ...projectData,
          organization_id: '2320a0d6-8cbb-4727-8f33-6573d017d980',
        },
        token
      );
      setProjects([...projects, response.body]);
    } catch (err) {
      setError('Failed to create project. Please try again.');
      console.error('Error creating project:', err);
    }
  };

  const handleEditProject = (project) => {
    setEditProject(project);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditProject(null);
  };

  const handleUpdateProject = async (updatedData) => {
    try {
      const response = await projectsApi.update(
        editProject.id,
        updatedData,
        token
      );
      setProjects(
        projects.map((p) => (p.id === response.body.id ? response.body : p))
      );
      handleCloseEditDialog();
    } catch (err) {
      setError('Failed to update project. Please try again.');
      console.error('Error updating project:', err);
    }
  };

  const handleDeleteDialogOpen = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await projectsApi.delete(projectToDelete.id, token);
      setProjects(projects.filter((p) => p.id !== projectToDelete.id));
      handleDeleteDialogClose();
    } catch (err) {
      setError('Failed to delete project. Please try again.');
      console.error('Error deleting project:', err);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/flow/${projectId}`);
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
            Projects
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateProjectModalOpen(true)}
          >
            Create Project
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card
                onClick={() => handleProjectClick(project.id)}
                sx={{ cursor: 'pointer' }}
              >
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {project.name}
                  </Typography>
                </CardContent>
                <CardActions onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    onClick={() => handleEditProject(project)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteDialogOpen(project)}
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

      <CreateProjectModal
        isOpen={createProjectModalOpen}
        onClose={() => setCreateProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      <DynamicModalForm
        isOpen={editDialogOpen}
        onClose={handleCloseEditDialog}
        schema={{
          type: 'object',
          properties: {
            name: { type: 'string', title: 'Project Name' },
          },
        }}
        onSubmit={handleUpdateProject}
        initialData={editProject}
        title="Edit Project"
      />

      <DynamicModalForm
        isOpen={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        schema={{
          type: 'object',
          properties: {
            confirm: {
              type: 'boolean',
              title: 'Are you sure you want to delete this project?',
              default: false,
            },
          },
        }}
        onSubmit={({ confirm }) => {
          if (confirm) {
            handleDeleteProject();
          } else {
            setError('You must confirm the deletion.');
          }
        }}
        initialData={{ confirm: false }} // Ensure the switch is initially off
        title="Delete Project"
      />
    </Container>
  );
};

export default Projects;
