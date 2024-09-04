import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import React, { useCallback, useRef } from 'react';
import JsonSchemaForm from 'react-json-schema-form';
import RadDialog from '../../RadDialog';
import CreatePackageModal from './CreatePackageModal';

const ModalsContainer = ({
  modalState,
  setModalState,
  nodes = [],
  onSubmitForm,
  handleNameSubmit,
  onDeploy,
}) => {
  const {
    isModalOpen,
    isNameModalOpen,
    missingConnectionsModalOpen,
    selectedNodeId,
    formData,
    missingConnections,
    schema,
  } = modalState;

  const formRef = useRef(null);

  const handleCloseModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isModalOpen: false,
      selectedNodeId: null,
      formData: {},
    }));
  }, [setModalState]);

  const handleSubmitForm = useCallback(
    async (formData) => {
      if (selectedNodeId && onSubmitForm) {
        try {
          await onSubmitForm(selectedNodeId, formData);
          handleCloseModal();
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      }
    },
    [selectedNodeId, onSubmitForm, handleCloseModal]
  );

  const handleDeployWithMissingConnections = useCallback(async () => {
    if (selectedNodeId && onDeploy) {
      await onDeploy(selectedNodeId);
      setModalState((prev) => ({
        ...prev,
        missingConnectionsModalOpen: false,
      }));
    }
  }, [selectedNodeId, onDeploy, setModalState]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <>
      <RadDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedNode ? selectedNode.data.label : ''}
        actions={
          <>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => formRef.current && formRef.current.submit()}
              color="primary"
              variant="contained"
            >
              Submit
            </Button>
          </>
        }
      >
        <JsonSchemaForm
          ref={formRef}
          schema={schema}
          initialData={formData}
          onSubmit={handleSubmitForm}
          hideSubmitButton={true}
        />
      </RadDialog>
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
      <RadDialog
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
      </RadDialog>
    </>
  );
};

export default React.memo(ModalsContainer);
