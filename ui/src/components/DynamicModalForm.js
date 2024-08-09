import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import GCPRegionsComponent from './JsonSchema/CustomComponents/GCPRegions';
import JsonSchemaForm from './JsonSchema/JsonSchemaForm';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
    overflowY: 'visible',
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2, 3),
  },
}));

const DynamicModalForm = ({
  isOpen,
  onClose,
  schema,
  onSubmit,
  initialData = {},
  title,
}) => {
  const [formData, setFormData] = useState(initialData);
  const formRef = useRef();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData, schema, isOpen]);

  const handleSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  const customComponents = {
    gcpRegions: GCPRegionsComponent,
    // uncomment to test region dropdown
    // region: GCPRegionsComponent,
  };

  return (
    <StyledDialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{title}</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <JsonSchemaForm
          ref={formRef}
          schema={schema}
          initialData={formData}
          onSubmit={handleSubmit}
          customComponents={customComponents}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => formRef.current && formRef.current.submit()}
          color="primary"
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default DynamicModalForm;
