import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export const createAjvInstance = () => {
  const ajv = new Ajv({ allErrors: true, useDefaults: true });
  addFormats(ajv);
  return ajv;
};

// Add other utility functions here as needed
