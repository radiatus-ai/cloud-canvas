import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from 'reactflow';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import CustomConnectionLine from './CustomConnectionLine';
import DynamicModalForm from './DynamicModalForm';
import Sidebar from './Sidebar';
import apiService from '../apiService';
import CreatePackageModal from './CreatePackageModal';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const FlowDiagram = () => {
  const { projectId } = useParams();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [droppedPackageInfo, setDroppedPackageInfo] = useState(null);
  const defaultViewport = { x: 0, y: 0, zoom: 1.0 };
  const [missingConnectionsModalOpen, setMissingConnectionsModalOpen] =
    useState(false);
  const [missingConnections, setMissingConnections] = useState([]);

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    setIsLoading(true);
    try {
      const [infraData, edgesData] = await Promise.all([
        apiService.fetchPackages(projectId),
        apiService.fetchConnections(projectId),
      ]);
      const newNodes = apiService.transformToNodes(infraData);
      setNodes(newNodes);
      setEdges(edgesData);
      setError(null);
    } catch (err) {
      setError('Failed to load project data. Please try again later.');
      console.error('Error fetching project data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateConnection = useCallback(
    (source, target, sourceHandle, targetHandle) => {
      return apiService.validateConnection(
        nodes,
        source,
        target,
        sourceHandle,
        targetHandle
      );
    },
    [nodes]
  );

  const onConnectStart = useCallback((_, { nodeId, handleId }) => {
    setConnectionStatus(null);
  }, []);

  const onConnectEnd = useCallback((event) => {
    setConnectionStatus(null);
    console.log('Connection ended');
  }, []);

  const onConnect = useCallback(
    async (params) => {
      if (
        validateConnection(
          params.source,
          params.target,
          params.sourceHandle,
          params.targetHandle
        )
      ) {
        const sourceNode = nodes.find((node) => node.id === params.source);
        const connectionType =
          sourceNode.data.outputs.properties[params.sourceHandle]?.type;
        const newEdge = {
          ...params,
          type: 'custom',
          data: {
            connectionType,
            sourceHandle: params.sourceHandle,
            targetHandle: params.targetHandle,
          },
        };

        try {
          const savedEdge = await apiService.createConnection(
            projectId,
            newEdge
          );
          setEdges((eds) => addEdge(savedEdge, eds));
        } catch (error) {
          console.error('Error saving connection:', error);
          // You might want to show an error message to the user here
        }
      }
    },
    [setEdges, validateConnection, nodes, projectId]
  );

  const onEdgesDelete = useCallback(
    async (edgesToDelete) => {
      try {
        await Promise.all(
          edgesToDelete.map((edge) =>
            apiService.deleteConnection(projectId, edge.id)
          )
        );
        setEdges((edges) =>
          edges.filter((edge) => !edgesToDelete.some((e) => e.id === edge.id))
        );
      } catch (error) {
        console.error('Error deleting connections:', error);
        // You might want to show an error message to the user here
      }
    },
    [setEdges, projectId]
  );

  useEffect(() => {
    fetchInfraData();
  }, [projectId]);

  const fetchInfraData = async () => {
    setIsLoading(true);
    try {
      const infraData = await apiService.fetchPackages(projectId);
      const newNodes = apiService.transformToNodes(infraData);
      setNodes(newNodes);
      setError(null);
    } catch (err) {
      setError('Failed to load infrastructure data. Please try again later.');
      console.error('Error fetching infrastructure data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onConnectCheck = useCallback(
    (params) => {
      const isValid = validateConnection(
        params.source,
        params.target,
        params.sourceHandle,
        params.targetHandle
      );
      setConnectionStatus(isValid ? 'valid' : 'invalid');
      return isValid;
    },
    [validateConnection]
  );

  const onOpenModal = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setSelectedNodeId(nodeId);
        setFormData(node.data.parameter_data || {});
        setIsModalOpen(true);
      }
    },
    [nodes]
  );

  const onCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNodeId(null);
    setFormData({});
  }, []);

  const onSubmitForm = useCallback(
    async (newFormData) => {
      if (!selectedNodeId) return;
      console.log('submitting form');

      try {
        const updatedPackage = await apiService.updatePackage(
          projectId,
          selectedNodeId,
          { parameter_data: newFormData }
        );

        setNodes((nds) =>
          nds.map((node) =>
            node.id === selectedNodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    parameter_data: updatedPackage.parameter_data,
                    parameters: updatedPackage.parameters,
                  },
                }
              : node
          )
        );

        setFormData(updatedPackage.parameter_data);
        onCloseModal();
      } catch (error) {
        console.error('Error updating package:', error);
        // You might want to show an error message to the user here
      }
    },
    [selectedNodeId, projectId, setNodes, onCloseModal]
  );

  const onDeleteNode = useCallback(
    async (nodeId) => {
      try {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, deploy_status: 'deploying' } }
              : node
          )
        );
        await apiService.deletePackage(projectId, nodeId);

        // Remove the node from the state
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));

        // Remove any edges connected to this node
        setEdges((eds) =>
          eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
        );
      } catch (error) {
        console.error('Error deleting node:', error);
        setNodes((nds) =>
          nds.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, deploy_status: 'failed' } }
              : node
          )
        );
        // You might want to show an error message to the user here
      }
    },
    [projectId, setNodes, setEdges]
  );

  const checkRequiredConnections = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      const requiredInputs = Object.keys(node.data.inputs.properties);
      const connectedInputs = edges
        .filter((edge) => edge.target === nodeId)
        .map((edge) => edge.targetHandle);

      return requiredInputs.filter((input) => !connectedInputs.includes(input));
    },
    [nodes, edges]
  );

  const onDeploy = useCallback(
    async (nodeId) => {
      const missingInputs = checkRequiredConnections(nodeId);

      if (missingInputs.length > 0) {
        setMissingConnections(missingInputs);
        setMissingConnectionsModalOpen(true);
        return;
      }

      const node = nodes.find((n) => n.id === nodeId);
      try {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, deploy_status: 'deploying' } }
              : node
          )
        );
        const updatedPackage = await apiService.deployPackage(
          projectId,
          node.data.id,
          node.data.parameters
        );

        setNodes((nds) =>
          nds.map((node) =>
            node.id === nodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    deploy_status: updatedPackage.deploy_status,
                    parameters: updatedPackage.parameter_data,
                  },
                }
              : node
          )
        );
      } catch (error) {
        console.error('Error deploying package:', error);
        throw error;
      }
    },
    [projectId, nodes, edges, checkRequiredConnections]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const packageData = event.dataTransfer.getData('application/reactflow');

      if (typeof packageData === 'undefined' || !packageData) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const packageInfo = JSON.parse(packageData);

      setDroppedPackageInfo({ ...packageInfo, position });
      setIsNameModalOpen(true);
    },
    [reactFlowInstance]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      // Zoom to 150% centered on the clicked node
      // reactFlowInstance.setViewport({ x: node.position.x, y: node.position.y, zoom: 1.5 });
    },
    [reactFlowInstance]
  );

  const handleNameSubmit = async (packageName) => {
    setIsNameModalOpen(false);
    if (!droppedPackageInfo) return;

    try {
      const createdPackage = await apiService.createPackage(projectId, {
        package_id: droppedPackageInfo.id,
        name: packageName,
        type: droppedPackageInfo.type,
        inputs: droppedPackageInfo.inputs,
        input_data: {},
        outputs: droppedPackageInfo.outputs,
        output_data: {},
        parameters: droppedPackageInfo.parameters,
        position: droppedPackageInfo.position,
        deploy_status: 'undeployed',
      });

      const newNode = {
        id: createdPackage.id,
        type: 'custom',
        position: droppedPackageInfo.position,
        data: {
          id: createdPackage.id,
          label: createdPackage.name,
          type: createdPackage.type,
          inputs: createdPackage.inputs,
          outputs: createdPackage.outputs,
          parameters: createdPackage.parameters,
          parameter_data: createdPackage.parameter_data || {},
          deploy_status: 'undeployed',
        },
      };

      setNodes((nds) => nds.concat(newNode));
    } catch (error) {
      console.error('Error creating package:', error);
      // You might want to show an error message to the user here
    } finally {
      setDroppedPackageInfo(null);
    }
  };

  // Update nodes to include onOpenModal and onDeploy functions
  const nodesWithFunctions = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onOpenModal: () => onOpenModal(node.id),
      onDeploy: () => onDeploy(node.id),
      onDelete: () => onDeleteNode(node.id),
      deploy_status: node.data.deploy_status || 'undeployed',
    },
  }));

  if (isLoading) {
    return <div>Loading infrastructure data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 64px)', // Adjust 64px if your AppBar height is different
        width: '100%',
      }}
    >
      <Sidebar />
      <div style={{ flexGrow: 1 }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodesWithFunctions}
          edges={edges}
          onNodeClick={onNodeClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgesDelete={onEdgesDelete}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onConnectCheck={onConnectCheck}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineComponent={CustomConnectionLine}
          connectionLineStyle={{ stroke: '#ddd', strokeWidth: 2 }}
          connectionMode="loose"
          defaultViewport={defaultViewport}
        >
          <Controls />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
      {/* <Modal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        schema={
          selectedNodeId
            ? nodes.find((n) => n.id === selectedNodeId)?.data.parameters
            : null
        }
        onSubmit={onSubmitForm}
        initialData={formData}
        title={`Edit Parameters for ${
          nodes.find((n) => n.id === selectedNodeId)?.data.label
        }`}
      ></Modal> */}
      <DynamicModalForm
        isOpen={isModalOpen}
        onClose={onCloseModal}
        schema={
          selectedNodeId
            ? nodes.find((n) => n.id === selectedNodeId)?.data.parameters
            : null
        }
        onSubmit={onSubmitForm}
        initialData={formData}
        title={`Edit Parameters for ${
          nodes.find((n) => n.id === selectedNodeId)?.data.label
        }`}
      />
      <CreatePackageModal
        open={isNameModalOpen}
        onClose={() => {
          setIsNameModalOpen(false);
          setDroppedPackageInfo(null);
        }}
        onSubmit={handleNameSubmit}
      />
      <Dialog
        open={missingConnectionsModalOpen}
        onClose={() => setMissingConnectionsModalOpen(false)}
      >
        <DialogTitle>Missing Required Connections</DialogTitle>
        <DialogContent>
          <p>The following required inputs are not connected:</p>
          <ul>
            {missingConnections.map((input) => (
              <li key={input}>{input}</li>
            ))}
          </ul>
          <p>Please connect these inputs before deploying.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMissingConnectionsModalOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default function WrappedFlowDiagram() {
  return (
    <ReactFlowProvider>
      <FlowDiagram />
    </ReactFlowProvider>
  );
}
