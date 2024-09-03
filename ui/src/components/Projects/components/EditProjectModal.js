import React from 'react';
import DynamicModalForm from '../../DynamicModalForm';

const EditProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  project,
}) => {
  if (!project) {
    return null; // Return null if project is not loaded yet
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

  const handleSubmit = (formData) => {
    onSubmit({
      id: project.id,
      name: formData.name,
      credentials: formData.credentials || [],
    });
    onClose();
  };

  return (
    <DynamicModalForm
      isOpen={isOpen}
      onClose={onClose}
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={handleSubmit}
      initialData={{
        name: project.name,
        credentials: project.credentials || [],
      }}
      title="Edit Project"
    />
  );
};

export default EditProjectModal;
