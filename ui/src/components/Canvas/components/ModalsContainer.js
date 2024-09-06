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
import React, { useCallback, useMemo, useRef, useState } from 'react';
import JsonSchemaForm from 'react-json-schema-form';
import RadDialog from '../../RadDialog';

const ModalsContainer = ({
  modalState,
  setModalState,
  nodes,
  onSubmitForm,
  onDeploy,
}) => {
  const {
    isModalOpen,
    missingConnectionsModalOpen,
    selectedNodeId,
    formData,
    missingConnections,
    schema,
  } = modalState;

  const formRef = useRef(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
          setIsUpdating(true);
          const node = nodes.find((n) => n.id === selectedNodeId);
          if (node && node.data.updateNodeData) {
            node.data.updateNodeData({ isUpdating: true });
          }
          handleCloseModal();
          await onSubmitForm(selectedNodeId, formData);
        } catch (error) {
          console.error('Error submitting form:', error);
        } finally {
          setIsUpdating(false);
          const node = nodes.find((n) => n.id === selectedNodeId);
          if (node && node.data.updateNodeData) {
            node.data.updateNodeData({ isUpdating: false });
          }
        }
      }
    },
    [selectedNodeId, onSubmitForm, handleCloseModal, nodes]
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

  // const closeNameModal = useCallback(() => {
  //   setModalState((prev) => ({
  //     ...prev,
  //     // isNameModalOpen: false,
  //     droppedPackageInfo: null,
  //   }));
  // }, [setModalState]);

  const closeMissingConnectionsModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      missingConnectionsModalOpen: false,
    }));
  }, [setModalState]);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

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
              onClick={() => formRef.current?.submit()}
              color="primary"
              variant="contained"
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Submit'}
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
      {/* <CreatePackageModal
        open={isNameModalOpen}
        onClose={closeNameModal}
        onSubmit={handleNameSubmit}
      /> */}
      <RadDialog
        open={missingConnectionsModalOpen}
        onClose={closeMissingConnectionsModal}
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
          <Button onClick={closeMissingConnectionsModal}>Cancel</Button>
          <Button onClick={handleDeployWithMissingConnections} color="primary">
            Deploy Anyway
          </Button>
        </DialogActions>
      </RadDialog>
    </>
  );
};

export default React.memo(ModalsContainer);
