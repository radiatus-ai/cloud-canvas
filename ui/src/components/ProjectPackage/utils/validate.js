import Ajv from 'ajv';

const ajv = new Ajv();

export const validateConnections = (nodeData, edges = []) => {
  const { inputs, outputs } = nodeData;
  const connectedInputs = edges
    .filter((edge) => edge.target === nodeData.id)
    .map((edge) => edge.targetHandle);
  const connectedOutputs = edges
    .filter((edge) => edge.source === nodeData.id)
    .map((edge) => edge.sourceHandle);

  const inputSchema = {
    type: 'object',
    properties: inputs.properties,
    required: inputs.required || [],
  };

  const outputSchema = {
    type: 'object',
    properties: outputs.properties,
    required: outputs.required || [],
  };

  const inputsValid = ajv.validate(
    inputSchema,
    Object.fromEntries(connectedInputs.map((input) => [input, true]))
  );
  const outputsValid = ajv.validate(
    outputSchema,
    Object.fromEntries(connectedOutputs.map((output) => [output, true]))
  );

  return {
    valid: inputsValid && outputsValid,
    missingInputs: inputsValid
      ? []
      : inputSchema.required.filter((req) => !connectedInputs.includes(req)),
    missingOutputs: outputsValid
      ? []
      : outputSchema.required.filter((req) => !connectedOutputs.includes(req)),
  };
};
