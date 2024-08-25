import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/Auth';
import useApi from '../hooks/useAPI';
import DynamicModalForm from './DynamicModalForm';

const EditProjectModal = ({ isOpen, onClose, onSubmit, project }) => {
  const [orgSecrets, setOrgSecrets] = useState([]);
  const { credentials: credentialsApi } = useApi();
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrgSecrets = async () => {
      if (project && project.organization_id) {
        try {
          const response = await credentialsApi.listByOrganization(
            project.organization_id,
            token
          );
          setOrgSecrets(response.body);
        } catch (error) {
          console.error('Error fetching organization secrets:', error);
        }
      }
    };

    fetchOrgSecrets();
  }, [project, credentialsApi, token]);

  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string', title: 'Project Name' },
      credentials: {
        type: 'array',
        title: 'Project Credentials',
        items: {
          type: 'string',
          enum: orgSecrets?.map((secret) => secret.id) || [],
          enumNames: orgSecrets?.map((secret) => secret.name) || [],
        },
        uniqueItems: true,
      },
    },
  };

  return (
    <DynamicModalForm
      isOpen={isOpen}
      onClose={onClose}
      schema={schema}
      onSubmit={onSubmit}
      initialData={project}
      title="Edit Project"
    />
  );
};

export default EditProjectModal;
