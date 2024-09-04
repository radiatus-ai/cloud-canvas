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
import { useNavigate } from 'react-router-dom';
import DynamicModalForm from '../DynamicModalForm';
import CreateProjectModal from './components/CreateProjectModal';
import EditProjectModal from './components/EditProjectModal';
import useProjectModals from './hooks/useProjectModals';
import useProjectOperations from './hooks/useProjectOperations';
import useProjectsFetch from './hooks/useProjectsFetch';

const Projects = () => {
  const navigate = useNavigate();
  const { projects, setProjects, isLoading, error, setError, fetchProject } =
    useProjectsFetch();
  const {
    creatingProjects,
    deletingProjects,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
  } = useProjectOperations(projects, setProjects, setError);
  const {
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
  } = useProjectModals(fetchProject);

  const handleProjectClick = (projectId) => {
    navigate(`/canvas/${projectId}`);
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
            PROJECTS
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateProjectModalOpen(true)}
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
          {creatingProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card sx={{ opacity: 0.7 }}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {project.name}
                  </Typography>
                  <CircularProgress size={24} />
                </CardContent>
              </Card>
            </Grid>
          ))}
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card
                onClick={() => handleProjectClick(project.id)}
                sx={{
                  opacity: deletingProjects.includes(project.id) ? 0.7 : 1,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ cursor: 'pointer' }}
                  >
                    {project.name}
                  </Typography>
                  {deletingProjects.includes(project.id) && (
                    <CircularProgress size={24} />
                  )}
                </CardContent>
                <CardActions onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    onClick={() => handleEditProject(project)}
                    size="small"
                    color="primary"
                    disabled={deletingProjects.includes(project.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteDialogOpen(project)}
                    size="small"
                    color="default"
                    disabled={deletingProjects.includes(project.id)}
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

      <EditProjectModal
        isOpen={editDialogOpen}
        onClose={handleCloseEditDialog}
        onSubmit={(updatedData) => {
          return handleUpdateProject(editProject.id, updatedData);
        }}
        project={editProject}
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
            handleDeleteProject(projectToDelete.id);
          } else {
            setError('You must confirm the deletion.');
          }
        }}
        initialData={{ confirm: false }}
        title="Delete Project"
      />
    </Container>
  );
};

export default Projects;
