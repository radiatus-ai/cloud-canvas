import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import RadDialog from '../../RadDialog';
const CreateSecretModal = ({ isOpen, onClose, onSubmit, organizationId }) => {
  const [credentialName, setCredentialName] = useState('');
  const [credentialType, setCredentialType] = useState('SERVICE_ACCOUNT_KEY');
  const [credentialValue, setCredentialValue] = useState('');

  const handleNameChange = (event) => {
    setCredentialName(event.target.value);
  };

  const handleTypeChange = (event) => {
    setCredentialType(event.target.value);
  };

  const handleValueChange = (event) => {
    setCredentialValue(event.target.value);
  };

  const handleSubmit = () => {
    if (credentialName.trim() && credentialType && credentialValue.trim()) {
      onSubmit({
        name: credentialName,
        credential_type: credentialType,
        credential_value: credentialValue,
        organization_id: organizationId,
      });
      onClose();
      // Reset form
      setCredentialName('');
      setCredentialType('');
      setCredentialValue('');
    }
  };

  return (
    <RadDialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create Secret</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={credentialName}
          data-cy="credential-name-input"
          onChange={handleNameChange}
          fullWidth
          required
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={credentialType}
            data-cy="credential-type-input"
            onChange={handleTypeChange}
            required
          >
            <MenuItem value="SERVICE_ACCOUNT_KEY">Service Account Key</MenuItem>
            <MenuItem value="SECRET">Secret</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Value"
          value={credentialValue}
          data-cy="credential-value-input"
          onChange={handleValueChange}
          fullWidth
          required
          margin="normal"
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          data-cy="submit-secret-button"
          disabled={
            !credentialName.trim() || !credentialType || !credentialValue.trim()
          }
        >
          Create
        </Button>
      </DialogActions>
    </RadDialog>
  );
};

export default CreateSecretModal;
