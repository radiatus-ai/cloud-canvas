import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import FieldRenderer from './FieldRenderer';
import { validateField, validateForm } from './utils/validationUtils';

const StyledForm = styled('form')(({ theme }) => ({
  '& .MuiFormControl-root': {
    marginBottom: theme.spacing(2),
  },
}));

const JsonSchemaForm = forwardRef(
  (
    {
      schema,
      initialData = {},
      onSubmit,
      onChange,
      onClose,
      customComponents = {},
      isLoading = false,
    },
    ref
  ) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      severity: 'success',
    });

    const memoizedSchema = useMemo(() => schema, [schema]);
    const memoizedInitialData = useMemo(() => initialData, [initialData]);

    const defaultValues = useMemo(() => {
      const newFormData = { ...memoizedInitialData };
      if (memoizedSchema) {
        Object.entries(memoizedSchema.properties).forEach(
          ([key, fieldSchema]) => {
            if (
              fieldSchema.default !== undefined &&
              memoizedInitialData[key] === undefined
            ) {
              newFormData[key] = fieldSchema.default;
            }
            if (fieldSchema.type === 'array' && !newFormData[key]) {
              newFormData[key] = [];
            }
          }
        );
      }
      return newFormData;
    }, [memoizedSchema, memoizedInitialData]);

    useEffect(() => {
      setFormData(defaultValues);
      setErrors({});
      setTouched({});
    }, [defaultValues]);

    const handleChange = useCallback(
      (name, value) => {
        setFormData((prevData) => {
          const newData = { ...prevData, [name]: value };
          if (onChange) {
            onChange(newData);
          }
          return newData;
        });
      },
      [onChange]
    );

    const handleBlur = useCallback(
      (name) => {
        setTouched((prevTouched) => ({
          ...prevTouched,
          [name]: true,
        }));
        const error = validateField(memoizedSchema, name, formData[name]);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error,
        }));
      },
      [memoizedSchema, formData]
    );

    const handleSubmit = async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      const touchedAll = Object.keys(memoizedSchema.properties).reduce(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {}
      );
      setTouched(touchedAll);

      const validationResult = validateForm(memoizedSchema, formData);
      if (validationResult.isValid) {
        setIsSubmitting(true);
        try {
          await onSubmit(formData);
          setSnackbar({
            open: true,
            message: 'Form submitted successfully!',
            severity: 'success',
          });
        } catch (error) {
          setSnackbar({
            open: true,
            message: 'Error submitting form. Please try again.',
            severity: 'error',
          });
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setErrors(validationResult.errors);
        setSnackbar({
          open: true,
          message: 'Please correct the errors in the form.',
          severity: 'error',
        });
      }
    };

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
      validate: () => {
        const validationResult = validateForm(memoizedSchema, formData);
        setErrors(validationResult.errors);
        return validationResult;
      },
      getData: () => formData,
    }));

    return (
      <StyledForm onSubmit={(e) => e.preventDefault()}>
        <Stack spacing={2}>
          {memoizedSchema &&
            Object.entries(memoizedSchema.properties).map(
              ([key, fieldSchema]) => (
                <FieldRenderer
                  key={key}
                  name={key}
                  schema={memoizedSchema}
                  fieldSchema={fieldSchema}
                  value={formData[key]}
                  error={errors[key]}
                  touched={touched[key]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  customComponents={customComponents}
                />
              )
            )}
        </Stack>
        {!ref && (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
            startIcon={
              isSubmitting || isLoading ? <CircularProgress size={20} /> : null
            }
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </StyledForm>
    );
  }
);

export default React.memo(JsonSchemaForm);
