import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/system';

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0.5, 0),
}));

const NodeStatistics = ({ data }) => {
  const { uptime, resourceUsage, cost } = data.statistics || {};

  return (
    <Box sx={{ mt: 2, fontSize: '0.75rem' }}>
      <Typography variant="subtitle2" gutterBottom>
        Statistics
      </Typography>
      <StatItem>
        <Tooltip title="Time since last deployment">
          <Typography variant="body2">Uptime:</Typography>
        </Tooltip>
        <Typography variant="body2">{uptime || 'N/A'}</Typography>
      </StatItem>
      <StatItem>
        <Tooltip title="Current resource consumption">
          <Typography variant="body2">Resource Usage:</Typography>
        </Tooltip>
        <Typography variant="body2">{resourceUsage || 'N/A'}</Typography>
      </StatItem>
      <StatItem>
        <Tooltip title="Estimated cost since deployment">
          <Typography variant="body2">Cost:</Typography>
        </Tooltip>
        <Typography variant="body2">{cost || 'N/A'}</Typography>
      </StatItem>
    </Box>
  );
};

export default NodeStatistics;
