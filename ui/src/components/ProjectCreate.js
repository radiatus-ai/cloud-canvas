import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import React from 'react';
import JsonSchemaForm from './JsonSchemaForm';

const CreateProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string', title: 'Project Name' },
    },
    required: ['name'],
  };

  const handleSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogContent>
        <JsonSchemaForm schema={schema} onSubmit={handleSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectModal;
