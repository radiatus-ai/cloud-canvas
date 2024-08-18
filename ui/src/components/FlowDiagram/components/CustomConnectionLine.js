import React from 'react';
import { getBezierPath } from 'reactflow';
import 'reactflow/dist/style.css';

const CustomConnectionLine = ({ fromX, fromY, toX, toY, connectionStatus }) => {
  const [edgePath] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path
        fill="none"
        stroke={
          connectionStatus === 'valid'
            ? '#00ff00'
            : connectionStatus === 'invalid'
            ? '#ff0000'
            : '#b1b1b7'
        }
        strokeWidth={3}
        className="animated"
        d={edgePath}
      />
    </g>
  );
};

export default CustomConnectionLine;
