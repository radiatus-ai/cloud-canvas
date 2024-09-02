import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import PaperComponent from './PaperComponent';

const CreatePackageModal = ({ open, onClose, onSubmit }) => {
  const [packageName, setPackageName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setPackageName('');
      setError('');
    }
  }, [open]);

  const handleSubmit = () => {
    if (packageName.trim()) {
      onSubmit(packageName.trim());
      onClose();
    } else {
      setError('Package name cannot be empty');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperComponent={PaperComponent}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          Create New Package
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter a name for your new package. This name should be unique and
          descriptive.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Package Name"
          type="text"
          fullWidth
          value={packageName}
          onChange={(e) => {
            setPackageName(e.target.value);
            setError('');
          }}
          onKeyPress={handleKeyPress}
          error={!!error}
          helperText={error}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!packageName.trim()}
        >
          Create Package
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePackageModal;
