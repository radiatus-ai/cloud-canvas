import { Button } from '@mui/material';
import React, { forwardRef, useCallback } from 'react';
import JsonSchemaForm from 'react-json-schema-form';
import LoadingButton from '../../LoadingButton';
import RadDialog from '../../RadDialog';

const CreateSecretModal = forwardRef(
  ({ isOpen, onClose, onSubmit, isLoading }, ref) => {
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
          minLength: 1,
        },
        credential_type: {
          type: 'string',
          title: 'Type',
          enum: ['SERVICE_ACCOUNT_KEY', 'SECRET'],
          default: 'SERVICE_ACCOUNT_KEY',
        },
        credential_value: {
          type: 'string',
          title: 'Value',
          minLength: 1,
        },
      },
      required: ['name', 'credential_type', 'credential_value'],
    };

    const uiSchema = {
      name: {
        'ui:autofocus': true,
        'ui:placeholder': 'Secret Name',
      },
      credential_type: {
        'ui:widget': 'select',
      },
      credential_value: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 4,
        },
      },
    };

    const handleSubmit = useCallback(
      async (formData) => {
        onClose(); // Close the modal immediately
        await onSubmit({
          ...formData,
          organization_id: 'foo', // You might want to get this from a context or prop
        });
      },
      [onSubmit, onClose]
    );

    return (
      <RadDialog
        isOpen={isOpen}
        onClose={onClose}
        title="New Secret"
        actions={
          <>
            <Button onClick={onClose} color="primary" disabled={isLoading}>
              Cancel
            </Button>
            <LoadingButton
              onClick={() => ref.current?.submit()}
              color="primary"
              variant="contained"
              loading={isLoading}
              data-cy="submit-secret-button"
            >
              Create
            </LoadingButton>
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
  }
);

export default CreateSecretModal;
