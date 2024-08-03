import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

const StyledForm = styled('form')(({ theme }) => ({
  '& .MuiFormControl-root': {
    marginBottom: theme.spacing(2),
  },
}));

const JsonSchemaForm = forwardRef(
  ({ schema, initialData = {}, onSubmit, onClose }, ref) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [arrayInputs, setArrayInputs] = useState({});

    const getFieldError = useCallback(
      (fieldSchema, value, name) => {
        if (
          schema.required &&
          schema.required.includes(name) &&
          (value === undefined || value === '')
        ) {
          return 'This field is required';
        }
        if (value === undefined || value === '') return '';

        if (fieldSchema.type === 'string') {
          if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
            return `Minimum length is ${fieldSchema.minLength}`;
          }
          if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
            return `Maximum length is ${fieldSchema.maxLength}`;
          }
          if (
            fieldSchema.pattern &&
            !new RegExp(fieldSchema.pattern).test(value)
          ) {
            return `Value does not match the required pattern`;
          }
        }
        if (fieldSchema.type === 'number' || fieldSchema.type === 'integer') {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            return 'Must be a number';
          }
          if (fieldSchema.type === 'integer' && !Number.isInteger(numValue)) {
            return 'Must be an integer';
          }
          if (
            fieldSchema.minimum !== undefined &&
            numValue < fieldSchema.minimum
          ) {
            return `Minimum value is ${fieldSchema.minimum}`;
          }
          if (
            fieldSchema.maximum !== undefined &&
            numValue > fieldSchema.maximum
          ) {
            return `Maximum value is ${fieldSchema.maximum}`;
          }
        }
        if (fieldSchema.type === 'array') {
          if (fieldSchema.minItems && value.length < fieldSchema.minItems) {
            return `Minimum ${fieldSchema.minItems} items required`;
          }
          if (fieldSchema.maxItems && value.length > fieldSchema.maxItems) {
            return `Maximum ${fieldSchema.maxItems} items allowed`;
          }
          if (fieldSchema.uniqueItems && new Set(value).size !== value.length) {
            return 'All items must be unique';
          }
        }
        return '';
      },
      [schema]
    );

    const validateField = useCallback(
      (name, value) => {
        const fieldSchema = schema.properties[name];
        const fieldError = getFieldError(fieldSchema, value, name);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: fieldError,
        }));
      },
      [getFieldError, schema.properties]
    );

    useEffect(() => {
      const newFormData = { ...initialData };
      if (schema) {
        Object.entries(schema.properties).forEach(([key, fieldSchema]) => {
          if (
            fieldSchema.default !== undefined &&
            initialData[key] === undefined
          ) {
            newFormData[key] = fieldSchema.default;
          }
        });
      }
      setFormData(newFormData);
      setErrors({});
      setTouched({});
    }, [initialData, schema]);

    const handleChange = useCallback(
      (name, value, index = null) => {
        setFormData((prevData) => {
          if (index !== null) {
            const newArray = [...prevData[name]];
            newArray[index] = { ...newArray[index], ...value };
            return { ...prevData, [name]: newArray };
          }
          return { ...prevData, [name]: value };
        });
        setTouched((prevTouched) => ({
          ...prevTouched,
          [name]: true,
        }));
        validateField(name, value);
      },
      [validateField]
    );

    const handleArrayInputChange = useCallback((name, value) => {
      setArrayInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value,
      }));
    }, []);

    const handleAddArrayItem = useCallback((key, schema) => {
      setFormData((prevData) => {
        const newItem = Object.keys(schema.items.properties).reduce(
          (acc, prop) => {
            acc[prop] = '';
            return acc;
          },
          {}
        );
        return {
          ...prevData,
          [key]: [...(prevData[key] || []), newItem],
        };
      });
    }, []);

    const handleDeleteArrayItem = useCallback(
      (key, index) => {
        setFormData((prevData) => {
          const updatedArray = prevData[key].filter((_, i) => i !== index);
          const updatedData = {
            ...prevData,
            [key]: updatedArray,
          };
          validateField(key, updatedArray);
          return updatedData;
        });
      },
      [validateField]
    );

    const handleBlur = (name) => {
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));
      validateField(name, formData[name]);
    };

    const handleSubmit = (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      const touchedAll = Object.keys(schema.properties).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(touchedAll);

      const validationErrors = validateForm(schema, formData);
      if (Object.keys(validationErrors).length === 0) {
        onSubmit(formData);
      } else {
        setErrors(validationErrors);
      }
    };

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    const validateForm = (schema, data) => {
      const errors = {};
      Object.entries(schema.properties).forEach(([key, fieldSchema]) => {
        const error = getFieldError(fieldSchema, data[key], key);
        if (error) {
          errors[key] = error;
        }
      });
      return errors;
    };

    const renderField = useCallback(
      (key, fieldSchema) => {
        const value = formData[key] !== undefined ? formData[key] : '';
        const error = touched[key] ? errors[key] : undefined;
        const isRequired = schema.required && schema.required.includes(key);
        const isReadOnly = fieldSchema.readOnly === true;

        const commonProps = {
          fullWidth: true,
          key,
          label: `${fieldSchema.title || key}${isRequired ? ' *' : ''}`,
          value,
          onChange: (e) => handleChange(key, e.target.value),
          onBlur: () => handleBlur(key),
          error: !!error,
          helperText: error || fieldSchema.description,
          required: isRequired,
        };

        // Check for custom component
      if (fieldSchema.custom && fieldSchema.custom.component === 'ApiAutocomplete') {
        return (
          <ApiAutocomplete
            {...commonProps}
            apiEndpoint={fieldSchema.custom.apiEndpoint}
            onChange={(newValue) => handleChange(key, newValue)}
          />
        );
      }

        if (fieldSchema.enum) {
          return (
            <FormControl {...commonProps}>
              <InputLabel error={!!error}>{commonProps.label}</InputLabel>
              <Select {...commonProps} label={commonProps.label}>
                {fieldSchema.enum.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }

        switch (fieldSchema.type) {
          case 'string':
            if (fieldSchema.format === 'date') {
              return (
                <TextField
                  {...commonProps}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              );
            }
            if (fieldSchema.format === 'date-time') {
              return (
                <TextField
                  {...commonProps}
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                />
              );
            }
            return <TextField {...commonProps} />;
          case 'number':
          case 'integer':
            return <TextField {...commonProps} type="number" />;
          case 'boolean':
            return (
              <FormControlLabel
                control={
                  <Switch
                    checked={!!value}
                    onChange={(e) => handleChange(key, e.target.checked)}
                    onBlur={() => handleBlur(key)}
                    disabled={isReadOnly}
                  />
                }
                label={commonProps.label}
              />
            );
          case 'array':
            if (
              fieldSchema.type === 'array' &&
              fieldSchema.items &&
              fieldSchema.items.type === 'string'
            ) {
              const arrayValue = Array.isArray(value)
                ? value
                : value
                ? [value]
                : [];
              const inputValue = arrayInputs[key] || '';
              return (
                <FormControl {...commonProps} error={!!error}>
                  <InputLabel shrink error={!!error}>
                    {commonProps.label}
                  </InputLabel>
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}
                  >
                    {arrayValue.map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        onDelete={() => handleDeleteArrayItem(key, index)}
                      />
                    ))}
                  </Box>
                  <TextField
                    {...commonProps}
                    value={inputValue}
                    onChange={(e) =>
                      handleArrayInputChange(key, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddArrayItem(key, inputValue);
                      }
                    }}
                    placeholder="Type and press Enter to add"
                  />
                  {error && <Typography color="error">{error}</Typography>}
                </FormControl>
              );
            }
            if (
              fieldSchema.type === 'array' &&
              fieldSchema.items &&
              fieldSchema.items.type === 'object'
            ) {
              return renderArrayField(key, fieldSchema);
            }
            return null;
          default:
            return (
              <Typography color="error">
                Unsupported field type: {fieldSchema.type}
              </Typography>
            );
        }
      },
      [
        formData,
        arrayInputs,
        errors,
        touched,
        handleChange,
        handleArrayInputChange,
        handleAddArrayItem,
        handleDeleteArrayItem,
        handleBlur,
        schema.required,
      ]
    );

    const renderArrayField = useCallback(
      (key, fieldSchema) => {
        const value = formData[key] || [];
        const error = touched[key] ? errors[key] : undefined;

        return (
          <FormControl fullWidth error={!!error} key={key}>
            <InputLabel shrink>{fieldSchema.title}</InputLabel>
            <Box sx={{ mb: 2 }}>
              {value.map((item, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', mb: 1, alignItems: 'flex-start' }}
                >
                  {Object.entries(fieldSchema.items.properties).map(
                    ([propKey, propSchema]) => (
                      <TextField
                        key={propKey}
                        label={propSchema.title || propKey}
                        value={item[propKey] || ''}
                        onChange={(e) =>
                          handleChange(
                            key,
                            { [propKey]: e.target.value },
                            index
                          )
                        }
                        sx={{ mr: 1, flexGrow: 1 }}
                      />
                    )
                  )}
                  <IconButton
                    onClick={() => handleDeleteArrayItem(key, index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleAddArrayItem(key, fieldSchema)}
              variant="outlined"
            >
              Add {fieldSchema.title}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </FormControl>
        );
      },
      [
        formData,
        touched,
        errors,
        handleChange,
        handleDeleteArrayItem,
        handleAddArrayItem,
      ]
    );

    return (
      <Container maxWidth="sm">
        <StyledForm onSubmit={(e) => e.preventDefault()}>
          <Stack spacing={2}>
            {schema &&
              Object.entries(schema.properties).map(([key, fieldSchema]) =>
                renderField(key, fieldSchema)
              )}
          </Stack>
        </StyledForm>
      </Container>
    );
  }
);

export default JsonSchemaForm;
