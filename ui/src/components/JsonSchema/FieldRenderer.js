import React from 'react';
import {
  TextField,
  FormControlLabel,
  Switch,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ArrayField from './ArrayField';

const FieldRenderer = ({
  name,
  schema,
  fieldSchema,
  value,
  error,
  onChange,
  onBlur,
  customComponents,
}) => {
  const isRequired = schema.required && schema.required.includes(name);

  const commonProps = {
    fullWidth: true,
    name,
    label: (
      <span>
        {fieldSchema.title || name}
        {isRequired && <span style={{ color: 'red' }}> *</span>}
        {fieldSchema.description && (
          <Tooltip title={fieldSchema.description} arrow>
            <InfoIcon
              fontSize="small"
              sx={{ ml: 1, verticalAlign: 'middle' }}
            />
          </Tooltip>
        )}
      </span>
    ),
    value: value !== undefined ? value : '',
    onChange: (e) => onChange(name, e.target.value),
    onBlur: onBlur,
    error: !!error,
    helperText: error,
    required: isRequired,
  };

  if (customComponents[name]) {
    const CustomComponent = customComponents[name];
    return (
      <CustomComponent
        {...commonProps}
        schema={fieldSchema}
        onChange={(value) => onChange(name, value)}
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
      if (fieldSchema.format === 'email') {
        return <TextField {...commonProps} type="email" />;
      }
      if (fieldSchema.format === 'uri') {
        return <TextField {...commonProps} type="url" />;
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
              onChange={(e) => onChange(name, e.target.checked)}
            />
          }
          label={commonProps.label}
        />
      );
    case 'array':
      return (
        <ArrayField
          fieldSchema={fieldSchema}
          value={value}
          onChange={(newValue) => onChange(name, newValue)}
          error={error}
        />
      );
    default:
      return (
        <Typography color="error">
          Unsupported field type: {fieldSchema.type}
        </Typography>
      );
  }
};

export default FieldRenderer;
