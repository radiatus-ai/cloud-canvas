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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import JsonSchemaForm, { GCPRegionsComponent } from './JsonSchemaForm';

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

  const memoizedInitialData = useMemo(() => initialData, [initialData]);

  useEffect(() => {
    if (isOpen) {
      setFormData(memoizedInitialData);
    }
  }, [isOpen, memoizedInitialData]);

  const handleSubmit = async () => {
    if (formRef.current) {
      const { isValid, errors } = await formRef.current.validate();
      if (isValid) {
        const data = formRef.current.getData();
        onSubmit(data);
        onClose();
      } else {
        console.log('Form validation failed:', errors);
        // Optionally, you can display these errors to the user
      }
    }
  };

  const customComponents = useMemo(
    () => ({
      region: GCPRegionsComponent,
    }),
    []
  );

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
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default React.memo(DynamicModalForm);
