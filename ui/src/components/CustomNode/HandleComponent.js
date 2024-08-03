import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

const HandleWrapper = styled('div')(({ theme, position, index, total }) => ({
  position: 'absolute',
  [position === Position.Left ? 'left' : 'right']: -8,
  top: `${((index + 1) / (total + 1)) * 100}%`,
}));

const HandleTooltip = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -20,
  background: theme.palette.grey[900],
  color: theme.palette.common.white,
  padding: theme.spacing(0.25, 0.5),
  borderRadius: theme.shape.borderRadius,
  fontSize: 9,
  whiteSpace: 'nowrap',
}));

const HandleComponent = ({ type, position, id, schema, index, total }) => {
  const [isHovered, setIsHovered] = useState(false);

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
        >
          {schema.type}
        </HandleTooltip>
      )}
    </HandleWrapper>
  );
};

export default HandleComponent;
