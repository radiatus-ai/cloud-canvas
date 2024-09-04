import React from 'react';
import 'reactflow/dist/style.css';
import HandleComponent from './HandleComponent';

// const ExpandButton = styled(IconButton)(({ theme }) => ({
//   padding: theme.spacing(0.5),
//   marginLeft: 'auto',
// }));

const NodeHandles = ({
  inputs,
  outputs,
  isConnectable,
  isTemp,
  packageType,
}) => {
  const renderHandles = (properties, type, position) =>
    Object.entries(properties).map(([id, schema], index, array) => (
      <HandleComponent
        key={`${type}-${id}`}
        type={type}
        position={position}
        id={id}
        schema={schema}
        index={index}
        total={array.length}
        isConnectable={isConnectable && !isTemp}
        packageType={packageType}
      />
    ));

  return (
    <>
      {renderHandles(inputs.properties, 'target', 'left')}
      {renderHandles(outputs.properties, 'source', 'right')}
    </>
  );
};

export default NodeHandles;
