import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import JsonSchemaForm from './JsonSchemaForm';

const ArrayField = ({ fieldSchema, value, onChange, error }) => {
  const [expanded, setExpanded] = useState(null);

  // Ensure value is always an array
  const arrayValue = Array.isArray(value) ? value : [];

  const handleAdd = () => {
    let newItem = {};

    // Check if fieldSchema.items exists and is an object
    if (fieldSchema && typeof fieldSchema.items === 'object') {
      // If it has properties, use them to create the new item
      if (fieldSchema.items.properties) {
        Object.keys(fieldSchema.items.properties).forEach((key) => {
          const property = fieldSchema.items.properties[key];
          newItem[key] =
            property.default !== undefined ? property.default : null;
        });
      }
      // If it doesn't have properties but has a type, create a basic item based on the type
      else if (fieldSchema.items.type) {
        switch (fieldSchema.items.type) {
          case 'string':
            newItem = '';
            break;
          case 'number':
          case 'integer':
            newItem = 0;
            break;
          case 'boolean':
            newItem = false;
            break;
          case 'object':
            newItem = {};
            break;
          case 'array':
            newItem = [];
            break;
          default:
            newItem = null;
        }
      }
    }

    // If we couldn't determine the structure, just add an empty object
    onChange([...arrayValue, newItem]);
    setExpanded(arrayValue.length);
  };

  const handleRemove = (index) => {
    const newValue = [...arrayValue];
    newValue.splice(index, 1);
    onChange(newValue);
    if (expanded === index) {
      setExpanded(null);
    } else if (expanded > index) {
      setExpanded(expanded - 1);
    }
  };

  const handleItemChange = (index, itemValue) => {
    const newValue = [...arrayValue];
    newValue[index] = itemValue;
    onChange(newValue);
  };

  const handleExpand = (index) => (event, isExpanded) => {
    setExpanded(isExpanded ? index : null);
  };

  const getItemTitle = (item, index) => {
    if (item && item.name) {
      return `${fieldSchema.title} - ${item.name}`;
    }
    return `${fieldSchema.title} ${index + 1}`;
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        {fieldSchema.title}
        {fieldSchema.description && (
          <Tooltip title={fieldSchema.description} arrow>
            <InfoIcon
              fontSize="small"
              sx={{ ml: 1, verticalAlign: 'middle' }}
            />
          </Tooltip>
        )}
      </Typography>
      {arrayValue.map((item, index) => (
        <Accordion
          key={index}
          expanded={expanded === index}
          onChange={handleExpand(index)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{getItemTitle(item, index)}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper elevation={0} sx={{ p: 2 }}>
              <JsonSchemaForm
                schema={fieldSchema.items || {}}
                initialData={item}
                onSubmit={(data) => handleItemChange(index, data)}
                onChange={(data) => handleItemChange(index, data)}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </Box>
            </Paper>
          </AccordionDetails>
        </Accordion>
      ))}
      <Button
        variant="outlined"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        sx={{ mt: 1 }}
      >
        Add {fieldSchema.title}
      </Button>
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ArrayField;
