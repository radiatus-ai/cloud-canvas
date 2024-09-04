import { Button } from '@mui/material';
import React, { forwardRef, useCallback } from 'react';
import JsonSchemaForm from 'react-json-schema-form';
import RadDialog from '../../RadDialog';

const CreateProjectModal = forwardRef(({ isOpen, onClose, onSubmit }, ref) => {
  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        minLength: 1,
      },
    },
    required: ['name'],
  };

  const uiSchema = {
    name: {
      'ui:autofocus': true,
      'ui:placeholder': 'Project Name',
    },
  };

  const handleSubmit = useCallback(
    async (formData) => {
      await onSubmit(formData);
      onClose();
    },
    [onSubmit, onClose]
  );

  return (
    <RadDialog
      isOpen={isOpen}
      onClose={onClose}
      title="New Project"
      actions={
        <>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => ref.current?.submit()}
            color="primary"
            variant="contained"
          >
            Create
          </Button>
        </>
      }
    >
      <JsonSchemaForm
        ref={ref}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={handleSubmit}
        hideSubmitButton={true}
      />
    </RadDialog>
  );
});

export default CreateProjectModal;
