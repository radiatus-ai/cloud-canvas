import { Button } from '@mui/material';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import JsonSchemaForm from 'react-json-schema-form';
import RadDialog from '../../RadDialog';

const CreateSecretModal = forwardRef(({ isOpen, onClose, onSubmit }, ref) => {
  const formRef = useRef(null);

  useImperativeHandle(ref, () => ({
    submit: () => formRef.current && formRef.current.submit(),
    getData: () => formRef.current && formRef.current.getData(),
    reset: () => formRef.current && formRef.current.reset(),
  }));

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
      console.log('handleSubmit in CreateSecretModal', formData);
      await onSubmit({
        ...formData,
        organization_id: 'foo',
      });
    },
    [onSubmit]
  );

  const handleCreateClick = useCallback(async () => {
    if (formRef.current) {
      const isValid = await formRef.current.submit();
      if (isValid) {
        const formData = formRef.current.getData();
        await handleSubmit(formData);
      }
    }
  }, [handleSubmit]);

  return (
    <RadDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create Secret"
      actions={
        <>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleCreateClick}
            color="primary"
            variant="contained"
            data-cy="submit-secret-button"
          >
            Create
          </Button>
        </>
      }
    >
      <JsonSchemaForm
        // it has a problem with this ref
        ref={formRef}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={handleSubmit}
        hideSubmitButton={true}
      />
    </RadDialog>
  );
});

export default CreateSecretModal;
