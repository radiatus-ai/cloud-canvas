import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';
import CreatePackageModal from '../../CreatePackageModal';
import DynamicModalForm from '../../DynamicModalForm';

const ModalsContainer = ({
  modalState,
  setModalState,
  nodes = [],
  onSubmitForm,
  handleNameSubmit,
  checkRequiredConnections,
  onDeploy,
}) => {
  const {
    isModalOpen,
    isNameModalOpen,
    missingConnectionsModalOpen,
    selectedNodeId,
    formData,
    // droppedPackageInfo,
    missingConnections,
    schema, // Added schema from modalState
  } = modalState;
  // debugger;

  const handleCloseModal = () => {
    setModalState((prev) => ({
      ...prev,
      isModalOpen: false,
      selectedNodeId: null,
      formData: {},
    }));
  };

  const handleSubmitForm = async (newFormData) => {
    if (selectedNodeId && onSubmitForm) {
      console.log('ModalsContainer - Submitting form data:', newFormData);
      console.log('ModalsContainer - Selected Node ID:', selectedNodeId);
      try {
        const result = await onSubmitForm(selectedNodeId, newFormData);
        console.log('ModalsContainer - Form submission result:', result);
        handleCloseModal();
      } catch (error) {
        console.error('ModalsContainer - Error submitting form:', error);
        // Optionally, you can display an error message to the user here
      }
    } else {
      console.warn(
        'ModalsContainer - Unable to submit form: missing selectedNodeId or onSubmitForm'
      );
    }
  };

  const handleDeployWithMissingConnections = async () => {
    if (selectedNodeId && onDeploy) {
      await onDeploy(selectedNodeId);
      setModalState((prev) => ({
        ...prev,
        missingConnectionsModalOpen: false,
      }));
    }
  };

  // Find the selected node
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  if (selectedNode) {
    console.log('selectedNode', selectedNode);
  }

  return (
    <>
      <DynamicModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        schema={schema}
        onSubmit={handleSubmitForm}
        initialData={formData}
        title={`Edit Parameters for ${selectedNode?.data?.label || 'Node'}`}
      />
      <CreatePackageModal
        open={isNameModalOpen}
        onClose={() => {
          setModalState((prev) => ({
            ...prev,
            isNameModalOpen: false,
            droppedPackageInfo: null,
          }));
        }}
        onSubmit={handleNameSubmit}
      />
      <Dialog
        open={missingConnectionsModalOpen}
        onClose={() =>
          setModalState((prev) => ({
            ...prev,
            missingConnectionsModalOpen: false,
          }))
        }
      >
        <DialogTitle>Missing Required Connections</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            The following required inputs are not connected:
          </Typography>
          <List>
            {missingConnections.map((input) => (
              <ListItem key={input}>
                <ListItemText primary={input} />
              </ListItem>
            ))}
          </List>
          <Typography variant="body1">
            Do you want to proceed with deployment anyway?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setModalState((prev) => ({
                ...prev,
                missingConnectionsModalOpen: false,
              }))
            }
          >
            Cancel
          </Button>
          <Button onClick={handleDeployWithMissingConnections} color="primary">
            Deploy Anyway
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalsContainer;
