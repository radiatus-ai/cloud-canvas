import { Button } from '@mui/material';
import React, { forwardRef, useCallback } from 'react';
import JsonSchemaForm from 'react-json-schema-form';
import RadDialog from '../../RadDialog';

const UpdateSecretModal = forwardRef(
  ({ isOpen, onClose, onSubmit, credential }, ref) => {
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Credential Name',
          readOnly: true,
        },
        credential_type: {
          type: 'string',
          title: 'Credential Type',
          readOnly: true,
        },
        secret: { type: 'string', title: 'New Secret Value' },
      },
      required: ['secret'],
    };

    const handleSubmit = useCallback(
      async (formData) => {
        await onSubmit(credential.id, formData);
        onClose();
      },
      [onSubmit, onClose, credential]
    );

    return (
      <RadDialog
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Credential"
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
              Save
            </Button>
          </>
        }
      >
        <JsonSchemaForm
          ref={ref}
          schema={schema}
          initialData={credential || {}}
          onSubmit={handleSubmit}
          hideSubmitButton={true}
        />
      </RadDialog>
    );
  }
);

export default UpdateSecretModal;
