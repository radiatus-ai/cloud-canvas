import { Button } from '@mui/material';
import React, { forwardRef, useCallback, useRef } from 'react';
import JsonSchemaForm from 'react-json-schema-form';
import RadDialog from '../../RadDialog';

const CreateProjectModal = forwardRef(({ isOpen, onClose, onSubmit }, ref) => {
  const formRef = useRef(null);

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
      'ui:placeholder': 'Name',
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
            onClick={() => formRef.current && formRef.current.submit()}
            color="primary"
            variant="contained"
          >
            Create
          </Button>
        </>
      }
    >
      <JsonSchemaForm
        ref={formRef}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={handleSubmit}
        hideSubmitButton={true}
      />
    </RadDialog>
  );
});

export default CreateProjectModal;
