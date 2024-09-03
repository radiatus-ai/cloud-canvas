export const createGetItemSchema = (fieldSchema) => {
  if (Array.isArray(fieldSchema.items)) {
    // Handle tuple validation
    return (index) =>
      fieldSchema.items[index] || fieldSchema.additionalItems || {};
  }
  // Handle list validation
  return () => fieldSchema.items || {};
};

export const createDefaultValue = (schema) => {
  if (!schema) return null;

  if (schema.default !== undefined) {
    return schema.default;
  }

  switch (schema.type) {
    case 'string':
      return '';
    case 'number':
    case 'integer':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      if (schema.minItems && schema.items) {
        return Array(schema.minItems).fill(createDefaultValue(schema.items));
      }
      return [];
    case 'object':
      if (schema.properties) {
        const obj = {};
        for (const [key, propSchema] of Object.entries(schema.properties)) {
          if (schema.required && schema.required.includes(key)) {
            obj[key] = createDefaultValue(propSchema);
          }
        }
        return obj;
      }
      return {};
    default:
      return null;
  }
};
