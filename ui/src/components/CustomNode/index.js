import React, { memo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import HandleComponent from './HandleComponent';
import NodeHeader from './NodeHeader';
import { grey } from '@mui/material/colors';
import useRobustWebSocket from './hooks/useRobustWebSocket';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import useWebSocketEffect from './hooks/useWebSocketEffect';
import useConnectionEffect from './hooks/useConnectionEffect';
import useNodeData from './hooks/useNodeData';
const NodeContainer = styled(Box)(({ theme }) => ({
  padding: theme?.spacing?.(1.5) || '12px',
  border: `1px solid ${grey[300]}`,
  borderRadius: theme?.shape?.borderRadius || '4px',
  background: theme?.palette?.background?.paper || '#ffffff',
  minWidth: '180px',
  minHeight: '80px',
  position: 'relative',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const StatusContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginTop: '8px',
});

const CustomNode = memo(({ data, isConnectable }) => {
  const { projectId } = useParams();
  const [error, setError] = useState(null);
  const [nodeData, updateNodeData] = useNodeData(data);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const { sendJsonMessage, messageHistory, connectionStatus } =
    useRobustWebSocket(projectId, nodeData.id);

  useWebSocketEffect(messageHistory, updateNodeData, setError);
  useConnectionEffect(connectionStatus, sendJsonMessage, setError);

  if (nodeData.inputs.properties === undefined) {
    nodeData.inputs.properties = {};
    nodeData.outputs.properties = {};
  }

  const inputHandles = Object.entries(nodeData.inputs.properties).map(
    ([input, schema], index, array) => (
      <HandleComponent
        key={`input-${input}`}
        type="target"
        position="left"
        id={input}
        schema={schema}
        index={index}
        total={array.length}
        isConnectable={isConnectable}
      />
    )
  );

  const outputHandles = Object.entries(nodeData.outputs.properties).map(
    ([output, schema], index, array) => (
      <HandleComponent
        key={`output-${output}`}
        type="source"
        position="right"
        id={output}
        schema={schema}
        index={index}
        total={array.length}
        isConnectable={isConnectable}
      />
    )
  );

  const renderConnectionStatus = () => {
    if (isDebugMode) {
      return (
        <Typography variant="caption" color="text.secondary">
          Connection: {connectionStatus}
        </Typography>
      );
    } else {
      return connectionStatus === 'Open' ? (
        <WbSunnyIcon color="primary" fontSize="small" />
      ) : (
        <CloudIcon color="disabled" fontSize="small" />
      );
    }
  };

  return (
    <NodeContainer>
      <NodeHeader
        data={nodeData}
        projectId={projectId}
        updateNodeData={updateNodeData}
        onOpenModal={nodeData.onOpenModal}
        onDeleteNode={nodeData.onDelete}
      />
      <Typography variant="caption" color="text.secondary">
        {nodeData.type}
      </Typography>
      {inputHandles}
      {outputHandles}
      {error && <Typography color="error">{error}</Typography>}
      <StatusContainer>
        {renderConnectionStatus()}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ marginLeft: '8px', cursor: 'pointer' }}
          onClick={() => setIsDebugMode(!isDebugMode)}
        >
          {isDebugMode ? 'Switch to Icon Mode' : 'Switch to Debug Mode'}
        </Typography>
      </StatusContainer>
    </NodeContainer>
  );
});

export default CustomNode;
