import { Button, DialogContentText } from '@mui/material';
import React from 'react';
import RadDialog from './RadDialog';

const ConfirmationDialog = ({ open, title, content, onConfirm, onCancel }) => {
  const actions = (
    <>
      <Button onClick={onCancel}>Cancel</Button>
      <Button onClick={onConfirm} color="primary" autoFocus>
        Confirm
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
