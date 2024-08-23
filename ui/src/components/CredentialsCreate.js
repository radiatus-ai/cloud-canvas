import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const CredentialCreate = ({ isOpen, onClose, onSubmit, organizationId }) => {
  const [credentialName, setCredentialName] = useState('');
  const [credentialType, setCredentialType] = useState('');
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
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create New Credential</DialogTitle>
      <DialogContent>
        <TextField
          label="Credential Name"
          value={credentialName}
          onChange={handleNameChange}
          fullWidth
          required
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Credential Type</InputLabel>
          <Select value={credentialType} onChange={handleTypeChange} required>
            <MenuItem value="SERVICE_ACCOUNT_KEY">Service Account Key</MenuItem>
            <MenuItem value="SECRET">Secret</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Credential Value"
          value={credentialValue}
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
          disabled={
            !credentialName.trim() || !credentialType || !credentialValue.trim()
          }
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CredentialCreate;
