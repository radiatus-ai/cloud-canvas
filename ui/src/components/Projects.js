import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  IconButton,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import apiService from '../apiService';
import DynamicModalForm from './DynamicModalForm';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
}));

const StyledLink = styled(Link)({
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.fetchProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async () => {
    const newProject = {
      name: `New Project ${projects.length + 1}`,
      created_at: new Date().toISOString(),
    };
    try {
      const createdProject = await apiService.createProject(newProject);
      setProjects([...projects, createdProject]);
    } catch (err) {
      setError('Failed to create project. Please try again.');
      console.error('Error creating project:', err);
    }
  };

  const openEditDialog = (project) => {
    setEditProject(project);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditProject(null);
  };

  const editProjectHandler = async (updatedData) => {
    try {
      const updatedProject = await apiService.updateProject(
        editProject.id,
        updatedData
      );
      setProjects(
        projects.map((project) =>
          project.id === editProject.id ? updatedProject : project
        )
      );
      closeEditDialog();
    } catch (err) {
      setError('Failed to update project. Please try again.');
      console.error('Error updating project:', err);
    }
  };

  const deleteProject = async (id) => {
    try {
      await apiService.deleteProject(id);
      setProjects(projects.filter((project) => project.id !== id));
    } catch (err) {
      setError('Failed to delete project. Please try again.');
      console.error('Error deleting project:', err);
    }
  };

  const formatDate = apiService.formatDate;

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

  const editSchema = {
    type: 'object',
    properties: {
      name: { type: 'string', title: 'Project Name' },
    },
  };

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
            variant="outlined"
            color="primary"
            onClick={createProject}
            size="small"
          >
            Create
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Created At</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <StyledTableRow key={project.id}>
                  <TableCell>
                    <StyledLink
                      component={RouterLink}
                      to={`/flow/${project.id}`}
                      color="primary"
                    >
                      {project && project.name}
                    </StyledLink>
                  </TableCell>
                  <TableCell>{formatDate(project.created_at)}</TableCell>
                  <TableCell align="right">
                    <ActionButton
                      onClick={() => openEditDialog(project)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </ActionButton>
                    <ActionButton
                      onClick={() => deleteProject(project.id)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </ActionButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <DynamicModalForm
        isOpen={editDialogOpen}
        onClose={closeEditDialog}
        schema={editSchema}
        onSubmit={editProjectHandler}
        initialData={editProject}
        title="Edit Project"
      />
    </Container>
  );
};

export default Projects;
