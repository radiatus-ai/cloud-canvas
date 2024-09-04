import { Button } from '@mui/material';
import React, { useCallback, useRef } from 'react';
import JsonSchemaForm from 'react-json-schema-form';
import RadDialog from '../../RadDialog';

const EditProjectModal = ({ isOpen, onClose, onSubmit, project }) => {
  const formRef = useRef(null);

  const handleSubmit = useCallback(async () => {
    if (formRef.current && project) {
      const isValid = await formRef.current.submit();
      if (isValid) {
        const formData = formRef.current.getData();
        onSubmit({
          id: project.id,
          name: formData.name,
          credentials: formData.credentials || [],
        });
        onClose();
      }
    }
  }, [onSubmit, onClose, project]);

  if (!project) {
    return null;
  }

  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string', title: 'Project Name' },
      credentials: {
        type: 'array',
        title: 'Project Credentials',
        items: {
          type: 'string',
          enum: ['SERVICE_ACCOUNT_KEY', 'SECRET'],
        },
        uniqueItems: true,
      },
    },
  };

  const uiSchema = {
    credentials: {
      'ui:widget': 'checkboxes',
      'ui:options': {
        inline: true,
      },
    },
  };

  return (
    <RadDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project"
      actions={
        <>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Save
          </Button>
        </>
      }
    >
      <JsonSchemaForm
        ref={formRef}
        schema={schema}
        uiSchema={uiSchema}
        initialData={{
          name: project.name,
          credentials: project.credentials || [],
        }}
        onSubmit={handleSubmit}
        hideSubmitButton={true}
      />
    </RadDialog>
  );
};

export default EditProjectModal;
