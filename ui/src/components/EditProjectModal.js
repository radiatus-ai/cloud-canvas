import React, { useEffect, useState } from 'react';
import DynamicModalForm from './DynamicModalForm';
import { useAuth } from '../contexts/Auth';
import useApi from '../hooks/useAPI';

const EditProjectModal = ({ isOpen, onClose, onSubmit, project }) => {
  const [orgSecrets, setOrgSecrets] = useState([]);
  const { credentials: secretsApi } = useApi();
  const { token } = useAuth();

  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const response = await secretsApi.list(token);
        if (Array.isArray(response.body)) {
          setOrgSecrets(response.body);
          console.log('Secrets fetched:', response.body);
        } else {
          console.error('Invalid secrets response format');
        }
      } catch (error) {
        console.error('Error fetching secrets:', error);
      }
    };

    if (isOpen) {
      fetchSecrets();
    }
  }, [isOpen, secretsApi, token]);

  if (!project) {
    console.error('Project is null or undefined in EditProjectModal');
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
          enum: orgSecrets.map((secret) => secret.id),
        },
        uniqueItems: true,
      },
    },
  };

  const uiSchema = {
    credentials: {
      'ui:options': {
        enumNames: orgSecrets.map((secret) => secret.name),
      },
    },
  };

  return (
    <DynamicModalForm
      isOpen={isOpen}
      onClose={onClose}
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={onSubmit}
      initialData={project}
      title="Edit Project"
    />
  );
};

export default EditProjectModal;
