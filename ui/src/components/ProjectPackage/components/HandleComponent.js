import { Box, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const HandleWrapper = styled('div')(({ position, index, total }) => ({
  position: 'absolute',
  [position === Position.Left ? 'left' : 'right']: -8,
  top: `${((index + 1) / (total + 1)) * 100}%`,
}));

const HandleTooltip = styled(Box)({
  position: 'absolute',
  top: -20,
  padding: '2px 4px',
  borderRadius: '4px',
  fontSize: 9,
  whiteSpace: 'nowrap',
});

const HandleComponent = ({
  type,
  position,
  id,
  schema,
  index,
  total,
  packageType,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();

  return (
    <HandleWrapper
      position={position}
      index={index}
      total={total}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type={type}
        position={position}
        id={id}
        style={{ background: '#555', width: 6, height: 6 }}
      />
      {isHovered && (
        <HandleTooltip
          right={position === Position.Left ? 'auto' : 0}
          left={position === Position.Left ? 0 : 'auto'}
          sx={{
            background: theme.palette.grey[900] || '#333',
            color: theme.palette.common.white || '#fff',
          }}
        >
          {packageType || schema.type}
        </HandleTooltip>
      )}
    </HandleWrapper>
  );
};

export default HandleComponent;
