import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEdgesState, useNodesState } from 'reactflow';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';
import useEdgeOperations from './useEdgeOperations';
import useNodeOperations from './useNodeOperations';
import useProjectData from './useProjectData';

export const useFlowDiagram = () => {
  const { projectId } = useParams();
  const { token } = useAuth();
  const { projects: projectsApi } = useApi();
  const { projectData, isLoading, error } = useProjectData(projectId);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);

  const {
    onOpenModal,
    onSubmitForm,
    onDeleteNode,
    onDeploy,
    updateNodeData,
    createNode,
  } = useNodeOperations(projectId, token, projectsApi, nodes, setNodes);

  const {
    onConnect,
    onConnectStart,
    onConnectEnd,
    onConnectCheck,
    validateConnection,
    onEdgesDelete,
  } = useEdgeOperations(projectId, token, projectsApi, nodes, edges, setEdges);

  const [modalState, setModalState] = useState({
    isModalOpen: false,
    isNameModalOpen: false,
    missingConnectionsModalOpen: false,
    selectedNodeId: null,
    formData: {},
    droppedPackageInfo: null,
    missingConnections: [],
  });

  useEffect(() => {
    if (projectData) {
      if (JSON.stringify(nodes) !== JSON.stringify(projectData.nodes)) {
        setNodes(projectData.nodes || []);
      }
      if (JSON.stringify(edges) !== JSON.stringify(projectData.edges)) {
        setEdges(projectData.edges || []);
      }
    }
  }, [projectData, nodes, edges, setNodes, setEdges]);

  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);

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

      setModalState((prev) => ({
        ...prev,
        isNameModalOpen: true,
        droppedPackageInfo: { ...packageInfo, position },
      }));
    },
    [reactFlowInstance]
  );

  const handleNameSubmit = useCallback(
    async (packageName) => {
      setModalState((prev) => ({ ...prev, isNameModalOpen: false }));
      if (!modalState.droppedPackageInfo) return;

      try {
        await createNode(
          {
            ...modalState.droppedPackageInfo,
            name: packageName,
          },
          modalState.droppedPackageInfo.position
        );
      } catch (error) {
        console.error('Error creating package:', error);
        // You might want to show an error message to the user here
      } finally {
        setModalState((prev) => ({ ...prev, droppedPackageInfo: null }));
      }
    },
    [modalState.droppedPackageInfo, createNode]
  );

  const checkRequiredConnections = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (
        !node ||
        !node.data ||
        !node.data.inputs ||
        !node.data.inputs.properties
      ) {
        return [];
      }
      const requiredInputs = Object.keys(node.data.inputs.properties);
      const connectedInputs = edges
        .filter((edge) => edge.target === nodeId)
        .map((edge) => edge.targetHandle);

      return requiredInputs.filter((input) => !connectedInputs.includes(input));
    },
    [nodes, edges]
  );

  const handleOpenModal = useCallback(
    (nodeId) => {
      const modalData = onOpenModal(nodeId);
      if (modalData) {
        setModalState((prev) => ({
          ...prev,
          isModalOpen: true,
          selectedNodeId: modalData.selectedNodeId,
          formData: modalData.formData,
        }));
      }
    },
    [onOpenModal]
  );

  const handleSubmitForm = useCallback(
    async (newFormData) => {
      if (modalState.selectedNodeId) {
        await onSubmitForm(modalState.selectedNodeId, newFormData);
        setModalState((prev) => ({
          ...prev,
          isModalOpen: false,
          selectedNodeId: null,
          formData: {},
        }));
      }
    },
    [modalState.selectedNodeId, onSubmitForm]
  );

  const handleDeleteNode = useCallback(
    async (nodeId) => {
      const success = await onDeleteNode(nodeId);
      if (success) {
        onEdgesDelete(
          edges.filter(
            (edge) => edge.source === nodeId || edge.target === nodeId
          )
        );
      }
    },
    [onDeleteNode, onEdgesDelete, edges]
  );

  const handleDeploy = useCallback(
    async (nodeId) => {
      const missingInputs = checkRequiredConnections(nodeId);
      if (missingInputs.length > 0) {
        setModalState((prev) => ({
          ...prev,
          missingConnectionsModalOpen: true,
          selectedNodeId: nodeId,
          missingConnections: missingInputs,
        }));
      } else {
        await onDeploy(nodeId);
      }
    },
    [checkRequiredConnections, onDeploy]
  );

  return {
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
    handleOpenModal,
    handleSubmitForm,
    handleDeleteNode,
    handleDeploy,
    updateNodeData,
    checkRequiredConnections,
    validateConnection,
  };
};

export default useFlowDiagram;