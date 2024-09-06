import { Button } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import JsonSchemaForm from 'react-json-schema-form';
import RadDialog from '../../RadDialog';

const EditProjectModal = ({ isOpen, onClose, onSubmit, project }) => {
  const formRef = useRef(null);
  const [credentialOptions, setCredentialOptions] = useState([]);

  useEffect(() => {
    if (project && project.credentials) {
      const options = project.credentials.map((cred) => ({
        value: cred.id,
        label: cred.name,
      }));
      setCredentialOptions(options);
    }
  }, [project]);

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
          enum: credentialOptions.map((option) => option.value),
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
        labels: credentialOptions.reduce((acc, option) => {
          acc[option.value] = option.label;
          return acc;
        }, {}),
      },
    },
  };

  const initialData = {
    name: project.name,
    credentials: project.credentials
      ? project.credentials.map((cred) => cred.id)
      : [],
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
        initialData={initialData}
        onSubmit={handleSubmit}
        hideSubmitButton={true}
      />
    </RadDialog>
  );
};

export default EditProjectModal;
