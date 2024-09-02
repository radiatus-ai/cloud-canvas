import React, { useState } from 'react';
import { getBezierPath } from 'reactflow';
import 'reactflow/dist/style.css';

const CustomEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isHovered, setIsHovered] = useState(false);

  debugger;

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={2}
        stroke={isHovered ? '#555' : '#b1b1b7'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {isHovered && (
        <text>
          <textPath
            href={`#${id}`}
            style={{ fontSize: 12 }}
            startOffset="50%"
            textAnchor="middle"
          >
            {data.connectionType}
          </textPath>
        </text>
      )}
    </>
  );
};

export default CustomEdge;
