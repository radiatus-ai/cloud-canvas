import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  createDefaultValue,
  createGetItemSchema,
} from '../../utils/schemaUtils';
import FieldRenderer from '../FieldRenderer'; // Ensure this component is created and imported

const ArrayField = ({ fieldSchema, value, onChange, error }) => {
  const [expanded, setExpanded] = useState(null);
  const arrayValue = useMemo(
    () => (Array.isArray(value) ? value : []),
    [value]
  );
  const getItemSchema = useMemo(
    () => createGetItemSchema(fieldSchema),
    [fieldSchema]
  );

  const fieldId = `field-${fieldSchema.title}`;
  const errorId = `${fieldId}-error`;

  const handleExpand = useCallback(
    (index) => (event, isExpanded) => {
      setExpanded(isExpanded ? index : false);
    },
    []
  );

  const handleItemChange = useCallback(
    (index, newValue) => {
      const newArrayValue = [...arrayValue];
      newArrayValue[index] = newValue;
      onChange(newArrayValue);
    },
    [arrayValue, onChange]
  );

  const handleAdd = useCallback(() => {
    const newItemSchema = getItemSchema(arrayValue.length);
    const newItem = createDefaultValue(newItemSchema);
    onChange([...arrayValue, newItem]);
  }, [arrayValue, getItemSchema, onChange]);

  const handleRemove = useCallback(
    (index) => {
      const newArrayValue = arrayValue.filter((_, i) => i !== index);
      onChange(newArrayValue);
    },
    [arrayValue, onChange]
  );

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const items = Array.from(arrayValue);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      onChange(items);
    },
    [arrayValue, onChange]
  );

  const getItemTitle = useCallback(
    (item, index) => {
      const itemSchema = getItemSchema(index);
      return itemSchema.title || `Item ${index + 1}`;
    },
    [getItemSchema]
  );

  const renderArrayItem = useCallback(
    (item, index) => {
      const itemSchema = getItemSchema(index);
      return (
        <FieldRenderer
          schema={itemSchema}
          value={item}
          onChange={(newValue) => handleItemChange(index, newValue)}
          // Add other necessary props like error handling, etc.
        />
      );
    },
    [getItemSchema, handleItemChange]
  );

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle1"
        sx={{ mb: 1, fontWeight: 'bold' }}
        id={`${fieldId}-label`}
      >
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="array-items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {arrayValue.map((item, index) => (
                <Draggable
                  key={index}
                  draggableId={`item-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <Accordion
                        expanded={expanded === index}
                        onChange={handleExpand(index)}
                        sx={{ mb: 1 }}
                        id={`${fieldId}-item-${index}`}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`${fieldId}-item-${index}-content`}
                          id={`${fieldId}-item-${index}-header`}
                          sx={{
                            '& .MuiAccordionSummary-content': {
                              alignItems: 'center',
                            },
                          }}
                        >
                          <IconButton
                            size="small"
                            {...provided.dragHandleProps}
                            aria-label={`Drag ${getItemTitle(item, index)}`}
                          >
                            <DragIndicatorIcon />
                          </IconButton>
                          <Typography sx={{ ml: 1 }}>
                            {getItemTitle(item, index)}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                          id={`${fieldId}-item-${index}-content`}
                        >
                          <Paper elevation={0} sx={{ p: 2 }}>
                            {renderArrayItem(item, index)}
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 2,
                              }}
                            >
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleRemove(index)}
                                aria-label={`Remove ${getItemTitle(
                                  item,
                                  index
                                )}`}
                              >
                                Remove
                              </Button>
                            </Box>
                          </Paper>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        sx={{ mt: 1 }}
        aria-label={`Add ${fieldSchema.title}`}
      >
        Add {fieldSchema.title}
      </Button>
      {error && (
        <Typography color="error" sx={{ mt: 1 }} id={errorId}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default React.memo(ArrayField);
