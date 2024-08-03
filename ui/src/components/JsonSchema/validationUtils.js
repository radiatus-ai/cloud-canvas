import { createAjvInstance } from './utils';

const ajv = createAjvInstance();

export const validateForm = (schema, data) => {
  const validate = ajv.compile(schema);
  const isValid = validate(data);
  if (!isValid) {
    const validationErrors = validate.errors.reduce((acc, error) => {
      acc[error.dataPath.slice(1)] = error.message;
      return acc;
    }, {});
    return { isValid: false, errors: validationErrors };
  }
  return { isValid: true, errors: {} };
};

export const validateField = (schema, name, value) => {
  const fieldSchema = {
    ...schema,
    properties: { [name]: schema.properties[name] },
  };
  const validate = ajv.compile(fieldSchema);
  const isValid = validate({ [name]: value });

  if (!isValid) {
    return validate.errors[0].message;
  }
  return null;
};
