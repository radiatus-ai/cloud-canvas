import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Popover, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { getBezierPath } from 'reactflow';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleEdgeClick = useCallback((event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = useCallback(() => {
    if (data.onDelete && data.targetDeployStatus === 'NOT_DEPLOYED') {
      data.onDelete(id);
    }
    handleClose();
  }, [data, id]);

  const open = Boolean(anchorEl);

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: '#b1b1b7', strokeWidth: 2 }}
        onClick={handleEdgeClick}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography sx={{ p: 2 }}>Connection: {data.connectionType}</Typography>
        <Button
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          disabled={data.targetDeployStatus !== 'NOT_DEPLOYED'}
          sx={{ m: 1 }}
        >
          Delete Connection
        </Button>
        {data.targetDeployStatus !== 'NOT_DEPLOYED' && (
          <Typography variant="caption" color="error" sx={{ p: 1 }}>
            Target package must be destroyed before deleting this connection.
          </Typography>
        )}
      </Popover>
    </>
  );
};

export default CustomEdge;
