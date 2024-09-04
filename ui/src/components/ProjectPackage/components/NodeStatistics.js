import { Box, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0.5, 0),
}));

const SparklineContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 20,
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
}));

const NodeStatistics = ({ data }) => {
  // Fake data for the sparkline
  const cpuUsage = [30, 35, 40, 32, 38, 42, 45, 40, 38, 35];
  const memoryUsage = [60, 62, 58, 65, 70, 68, 72, 75, 70, 68];

  return (
    <Box sx={{ mt: 1, fontSize: '0.75rem' }}>
      <Typography variant="subtitle2" gutterBottom>
        Metrics
      </Typography>
      <StatItem>
        <Tooltip title="Current CPU usage">
          <Typography variant="body2">CPU Usage:</Typography>
        </Tooltip>
        <Typography variant="body2">
          {cpuUsage[cpuUsage.length - 1]}%
        </Typography>
      </StatItem>
      <SparklineContainer>
        <Sparklines
          data={cpuUsage}
          limit={10}
          width={100}
          height={20}
          margin={2}
        >
          <SparklinesLine
            style={{ stroke: '#2196f3', strokeWidth: 1, fill: 'none' }}
          />
          <SparklinesSpots
            size={1}
            style={{ stroke: '#2196f3', strokeWidth: 1, fill: 'white' }}
          />
        </Sparklines>
      </SparklineContainer>
      <StatItem>
        <Tooltip title="Current memory usage">
          <Typography variant="body2">Memory Usage:</Typography>
        </Tooltip>
        <Typography variant="body2">
          {memoryUsage[memoryUsage.length - 1]}%
        </Typography>
      </StatItem>
      <SparklineContainer>
        <Sparklines
          data={memoryUsage}
          limit={10}
          width={100}
          height={20}
          margin={2}
        >
          <SparklinesLine
            style={{ stroke: '#4caf50', strokeWidth: 1, fill: 'none' }}
          />
          <SparklinesSpots
            size={1}
            style={{ stroke: '#4caf50', strokeWidth: 1, fill: 'white' }}
          />
        </Sparklines>
      </SparklineContainer>
    </Box>
  );
};

export default NodeStatistics;
