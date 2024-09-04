import React from 'react';
import DynamicModalForm from '../../DynamicModalForm';

const CreateProjectModal = ({ isOpen, onClose, onSubmit }) => {
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

  const handleSubmit = (formData) => {
    onSubmit({ name: formData.name });
    onClose();
  };

  return (
    <DynamicModalForm
      isOpen={isOpen}
      onClose={onClose}
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={handleSubmit}
      initialData={{ name: '' }}
      title="New Project"
    />
  );
};

export default CreateProjectModal;
