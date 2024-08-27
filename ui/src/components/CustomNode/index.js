import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import HandleComponent from './HandleComponent';
import NodeHeader from './NodeHeader';
import { grey } from '@mui/material/colors';

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

const CustomNode = memo(({ data, updateNodeData }) => {
  const { projectId } = useParams();

  // useEffect(() => {
  //   console.log('Node data updated:', data);
  // }, [data]);

  if (data.inputs.properties === undefined) {
    data.inputs.properties = {};
    data.outputs.properties = {};
  }

  const inputHandles = Object.entries(data.inputs.properties).map(
    ([input, schema], index, array) => (
      <HandleComponent
        key={`input-${input}`}
        type="target"
        position="left"
        id={input}
        schema={schema}
        index={index}
        total={array.length}
      />
    )
  );

  const outputHandles = Object.entries(data.outputs.properties).map(
    ([output, schema], index, array) => (
      <HandleComponent
        key={`output-${output}`}
        type="source"
        position="right"
        id={output}
        schema={schema}
        index={index}
        total={array.length}
      />
    )
  );

  return (
    <NodeContainer>
      <NodeHeader
        data={data}
        projectId={projectId}
        updateNodeData={data.updateNodeData}
        onOpenModal={data.onOpenModal}
        onDeleteNode={data.onDelete}
      />
      <Typography variant="caption" color="text.secondary">
        {data.type}
      </Typography>
      {inputHandles}
      {outputHandles}
    </NodeContainer>
  );
});

export default CustomNode;
