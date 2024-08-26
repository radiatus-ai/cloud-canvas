import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';

const CreateProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [projectName, setProjectName] = useState('');

  const handleInputChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleSubmit = () => {
    if (projectName.trim()) {
      onSubmit({ name: projectName });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogContent>
        <TextField
          label="Project Name"
          value={projectName}
          onChange={handleInputChange}
          fullWidth
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button id="create-project-button" onClick={handleSubmit} disabled={!projectName.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectModal;
