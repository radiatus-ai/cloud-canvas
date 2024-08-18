import { Box } from '@mui/material';
import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import Sidebar from '../Sidebar';
import FlowCanvas from './components/FlowCanvas';
import ModalsContainer from './components/ModalsContainer';
import { useFlowDiagram } from './hooks/useFlowDiagram';

const FlowDiagram = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onConnectStart,
    onConnectEnd,
    onConnectCheck,
    onInit,
    onDrop,
    onDragOver,
    isLoading,
    error,
    reactFlowWrapper,
    handleNameSubmit,
    modalState,
    setModalState,
    formData,
    onSubmitForm,
    missingConnections,
  } = useFlowDiagram();

  if (isLoading) {
    return <div>Loading infrastructure data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', width: '100%' }}>
      <Sidebar />
      <ReactFlowProvider>
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onConnectCheck={onConnectCheck}
          onInit={onInit}
          onDrop={onDrop}
          onDragOver={onDragOver}
          reactFlowWrapper={reactFlowWrapper}
        />
        <ModalsContainer
          modalState={modalState}
          setModalState={setModalState}
          formData={formData}
          onSubmitForm={onSubmitForm}
          handleNameSubmit={handleNameSubmit}
          missingConnections={missingConnections}
        />
      </ReactFlowProvider>
    </Box>
  );
};

export default FlowDiagram;
