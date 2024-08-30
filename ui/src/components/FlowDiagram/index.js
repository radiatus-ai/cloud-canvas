import { Box } from '@mui/material';
import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import Sidebar from '../Sidebar';
import FlowCanvas from './components/FlowCanvas';
import ModalsContainer from './components/ModalsContainer';
import LoadingScreen from './components/LoadingScreen';
import { useFlowDiagram } from './hooks/useFlowDiagram';

const SIDEBAR_WIDTH = '250px'; // Adjust this value as needed

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
    handleDeploy,
    reactFlowWrapper,
    handleNameSubmit,
    modalState,
    setModalState,
    formData,
    handleSubmitForm,
    missingConnections,
  } = useFlowDiagram();

  // Update nodes to include onOpenModal and onDeploy functions
  // const nodesWithFunctions = useMemo(() => {
  //   return nodes.map((node) => ({
  //     ...node,
  //     data: {
  //       ...node.data,
  //       updateNodeData: (newData) => updateNodeData(node.id, newData),
  //       onOpenModal: () => onOpenModal(node.id),
  //       onDeploy: () => onDeploy(node.id),
  //       onDelete: () => onDeleteNode(node.id),
  //       deploy_status: node.data.deploy_status || 'UNDEPLOYED',
  //     },
  //   }));
  // }, [nodes, onOpenModal, onDeploy, onDeleteNode]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', width: '100%' }}>
      <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0 }}>
        <Sidebar />
      </Box>
      <ReactFlowProvider>
        <Box sx={{ flexGrow: 1, height: '100%' }}>
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
        </Box>
        <ModalsContainer
          modalState={modalState}
          setModalState={setModalState}
          formData={formData}
          onSubmitForm={handleSubmitForm}
          handleNameSubmit={handleNameSubmit}
          missingConnections={missingConnections}
          onDeploy={handleDeploy}
        />
      </ReactFlowProvider>
    </Box>
  );
};

export default FlowDiagram;
