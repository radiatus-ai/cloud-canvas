import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import { ReactFlowProvider } from 'reactflow';
import Sidebar from '../Sidebar';
import FlowCanvas from './components/FlowCanvas';
import LoadingScreen from './components/LoadingScreen';
import ModalsContainer from './components/ModalsContainer';
import { useFlowDiagram } from './hooks/useFlowDiagram';

const SIDEBAR_WIDTH = '195px';

const Canvas = () => {
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
    handleDeploy,
    reactFlowWrapper,
    // handleNameSubmit,
    modalState,
    setModalState,
    handleSubmitForm,
    handleEdgeDelete,
    missingConnections,
  } = useFlowDiagram();

  const flowCanvasProps = useMemo(
    () => ({
      nodes,
      edges,
      onNodesChange,
      onEdgesChange: handleEdgeDelete,
      onConnect,
      onConnectStart,
      onConnectEnd,
      onConnectCheck,
      onInit,
      onDrop,
      onDragOver,
      reactFlowWrapper,
    }),
    [
      nodes,
      edges,
      onNodesChange,
      handleEdgeDelete,
      onConnect,
      onConnectStart,
      onConnectEnd,
      onConnectCheck,
      onInit,
      onDrop,
      onDragOver,
      reactFlowWrapper,
    ]
  );

  const modalsContainerProps = useMemo(
    () => ({
      modalState,
      setModalState,
      onSubmitForm: handleSubmitForm,
      // handleNameSubmit,
      missingConnections,
      onDeploy: handleDeploy,
      nodes,
    }),
    [
      modalState,
      setModalState,
      handleSubmitForm,
      // handleNameSubmit,
      missingConnections,
      handleDeploy,
      nodes,
    ]
  );

  if (isLoading) return <LoadingScreen />;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', width: '100%' }}>
      <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0 }}>
        <Sidebar />
      </Box>
      <ReactFlowProvider>
        <Box sx={{ flexGrow: 1, height: '100%' }}>
          <FlowCanvas {...flowCanvasProps} />
        </Box>
        <ModalsContainer {...modalsContainerProps} />
      </ReactFlowProvider>
    </Box>
  );
};

export default Canvas;
