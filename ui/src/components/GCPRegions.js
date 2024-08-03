import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

const GCPRegionsComponent = ({ label, value, onChange, error, helperText }) => {
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    // For this example, we'll use mock data
    const mockRegions = [
      'us-central1',
      'us-east1',
      'us-west1',
      'europe-west1',
      'asia-east1',
    ];
    setRegions(mockRegions);
  }, []);

  return (
    <FormControl fullWidth error={error}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        {regions.map((region) => (
          <MenuItem key={region} value={region}>
            {region}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default GCPRegionsComponent;
