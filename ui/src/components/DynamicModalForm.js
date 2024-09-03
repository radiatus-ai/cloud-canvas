import { Button } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import JsonSchemaForm, { GCPRegionsComponent } from './JsonSchemaForm';
import RadDialog from './RadDialog';

const DynamicModalForm = ({
  isOpen,
  onClose,
  schema,
  uiSchema,
  onSubmit,
  initialData = {},
  title,
}) => {
  const [formData, setFormData] = useState(initialData);
  const formRef = useRef();
  const memoizedInitialData = useMemo(() => initialData, [initialData]);

  useEffect(() => {
    if (isOpen) {
      setFormData(memoizedInitialData);
    }
  }, [isOpen, memoizedInitialData]);

  const handleSubmit = async () => {
    if (formRef.current) {
      const { isValid, errors } = await formRef.current.validate();
      if (isValid) {
        const data = formRef.current.getData();
        onSubmit(data);
      } else {
        console.log('Form validation failed:', errors);
      }
    }
  };

  const handleChange = (newData) => {
    setFormData(newData);
  };

  const customComponents = useMemo(
    () => ({
      region: GCPRegionsComponent,
    }),
    []
  );

  const actions = (
    <>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={handleSubmit} color="primary" variant="contained">
        Submit
      </Button>
    </>
  );

  return (
    <RadDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actions={actions}
    >
      <JsonSchemaForm
        ref={formRef}
        schema={schema}
        uiSchema={uiSchema}
        initialData={formData}
        onChange={handleChange}
        customComponents={customComponents}
      />
    </RadDialog>
  );
};

export default React.memo(DynamicModalForm);
