import { Button, CircularProgress, DialogContentText } from '@mui/material';
import React from 'react';
import RadDialog from './RadDialog';

const ConfirmationDialog = ({
  open,
  title,
  content,
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  const actions = (
    <>
      <Button onClick={onCancel} disabled={isDeleting}>
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        color="primary"
        autoFocus
        disabled={isDeleting}
      >
        {isDeleting ? <CircularProgress size={24} /> : 'Confirm'}
      </Button>
    </>
  );

  return (
    <RadDialog isOpen={open} onClose={onCancel} title={title} actions={actions}>
      <DialogContentText>{content}</DialogContentText>
    </RadDialog>
  );
};

export default ConfirmationDialog;
