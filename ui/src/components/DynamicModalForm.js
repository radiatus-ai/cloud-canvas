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

  // Memoize the schema and initialData
  const memoizedSchema = useMemo(() => schema, [schema]);
  const memoizedInitialData = useMemo(() => initialData, [initialData]);

  useEffect(() => {
    if (isOpen) {
      setFormData(memoizedInitialData);
    }
  }, [isOpen, memoizedInitialData]);

  const handleSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  const customComponents = useMemo(
    () => ({
      gcpRegions: GCPRegionsComponent,
      // uncomment to test region dropdown
      // region: GCPRegionsComponent,
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

export default React.memo(DynamicModalForm);

// const onSubmitForm = useCallback(
//   async (newFormData) => {
//     if (!selectedNodeId) return;
//     console.log('submitting form');

//     try {
//       const updatedPackage = await apiService.updatePackage(
//         projectId,
//         selectedNodeId,
//         { parameter_data: newFormData }
//       );

//       setNodes((nds) =>
//         nds.map((node) =>
//           node.id === selectedNodeId
//             ? {
//                 ...node,
//                 data: {
//                   ...node.data,
//                   parameter_data: updatedPackage.parameter_data,
//                   parameters: updatedPackage.parameters,
//                 },
//               }
//             : node
//         )
//       );

//       setFormData(updatedPackage.parameter_data);
//       onCloseModal();
//     } catch (error) {
//       console.error('Error updating package:', error);
//       // You might want to show an error message to the user here
//     }
//   },
//   [selectedNodeId, projectId, setNodes, onCloseModal]
// );
