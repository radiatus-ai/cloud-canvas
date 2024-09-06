import { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEdgesState, useNodesState } from 'reactflow';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';
import useEdgeOperations from './useEdgeOperations';
import useNodeOperations from './useNodeOperations';
import useProjectData from './useProjectData';
import useCanvasWebSocket from './useRobustWebSocket';

export const useFlowDiagram = () => {
  const { projectId } = useParams();
  const { token } = useAuth();
  const { projects: projectsApi } = useApi();
  const { projectData, isLoading, error } = useProjectData(projectId);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);
  const [tempNodes, setTempNodes] = useState([]);

  const updateEdges = useCallback(
    (updatedEdge) => {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === updatedEdge.id ? { ...edge, ...updatedEdge } : edge
        )
      );
    },
    [setEdges]
  );

  const {
    sendJsonMessage,
    // connectionStatus,
    // error: wsError,
  } = useCanvasWebSocket(projectId, updateEdges);

  const {
    onOpenModal,
    onSubmitForm,
    onDeleteNode,
    onDeploy,
    updateNodeData,
    createNode,
  } = useNodeOperations(
    projectId,
    projectData,
    nodes,
    setNodes,
    edges,
    setEdges,
    reactFlowWrapper
  );

  const {
    onConnectStart,
    onConnectEnd,
    onConnectCheck,
    validateConnection,
    handleEdgeDelete,
  } = useEdgeOperations(projectId, projectData, nodes, edges, setEdges);

  const [modalState, setModalState] = useState({
    isModalOpen: false,
    isNameModalOpen: false,
    missingConnectionsModalOpen: false,
    selectedNodeId: null,
    formData: {},
    schema: {},
    droppedPackageInfo: null,
    missingConnections: [],
  });

  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const generateRandomSuffix = () => {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  };

  const onDrop = useCallback(
    async (event) => {
      event.preventDefault();

      if (!reactFlowInstance) {
        console.warn('React Flow instance is not initialized');
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) {
        console.warn('React Flow wrapper bounds not available');
        return;
      }

      const packageData =
        event.dataTransfer.getData('application/reactflow') ||
        event.dataTransfer.getData('text/plain');

      if (!packageData) {
        console.error('No valid package data found in the drop event');
        return;
      }

      try {
        const packageInfo = JSON.parse(packageData);
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const tempId = `temp-${Date.now()}`;
        const tempNode = {
          id: tempId,
          type: 'custom',
          position,
          data: {
            ...packageInfo,
            label: `${packageInfo.type.replace(
              /\//g,
              '-'
            )}-${generateRandomSuffix()}`,
            isTemp: true,
          },
        };

        // Add temporary node
        setTempNodes((prev) => [...prev, tempNode]);
        setNodes((nds) => nds.concat(tempNode));

        // Create the actual node
        try {
          const newNode = await createNode(
            {
              ...packageInfo,
              name: `${packageInfo.type.replace(
                /\//g,
                '-'
              )}-${generateRandomSuffix()}`,
            },
            position
          );

          // Replace temp node with actual node
          setNodes((nds) =>
            nds.map((node) =>
              node.id === tempId
                ? { ...newNode, position: node.position }
                : node
            )
          );
          setTempNodes((temp) => temp.filter((node) => node.id !== tempId));
        } catch (error) {
          console.error('Error creating package:', error);
          // Remove the temporary node if creation fails
          setNodes((nds) => nds.filter((node) => node.id !== tempId));
          setTempNodes((temp) => temp.filter((node) => node.id !== tempId));
        }
      } catch (error) {
        console.error('Error parsing package data:', error);
      }
    },
    [reactFlowInstance, createNode, setNodes]
  );

  // const handleNameSubmit = useCallback(
  //   async (packageName) => {
  //     setModalState((prev) => ({ ...prev, isNameModalOpen: false }));
  //     if (!modalState.droppedPackageInfo) return;

  //     try {
  //       const { tempId, ...packageInfo } = modalState.droppedPackageInfo;
  //       const newNode = await createNode(
  //         {
  //           ...packageInfo,
  //           name: packageName,
  //         },
  //         packageInfo.position
  //       );

  //       setNodes((nds) =>
  //         nds.map((node) =>
  //           node.id === tempId ? { ...newNode, position: node.position } : node
  //         )
  //       );
  //       setTempNodes((temp) => temp.filter((node) => node.id !== tempId));
  //     } catch (error) {
  //       console.error('Error creating package:', error);
  //       // Remove the temporary node if creation fails
  //       setNodes((nds) =>
  //         nds.filter((node) => node.id !== modalState.droppedPackageInfo.tempId)
  //       );
  //       setTempNodes((temp) =>
  //         temp.filter(
  //           (node) => node.id !== modalState.droppedPackageInfo.tempId
  //         )
  //       );
  //     } finally {
  //       setModalState((prev) => ({ ...prev, droppedPackageInfo: null }));
  //     }
  //   },
  //   [modalState.droppedPackageInfo, createNode, setNodes]
  // );

  const checkRequiredConnections = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node?.data?.inputs?.properties) {
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
          schema: modalData.schema,
        }));
      }
    },
    [onOpenModal]
  );

  const handleSubmitForm = useCallback(
    async (id, newFormData) => {
      if (modalState.selectedNodeId) {
        await onSubmitForm(modalState.selectedNodeId, id, newFormData);
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
        handleEdgeDelete(
          edges.filter(
            (edge) => edge.source === nodeId || edge.target === nodeId
          )
        );
      }
    },
    [onDeleteNode, handleEdgeDelete, edges]
  );

  const handleDeleteEdge = useCallback(
    async (edgeId) => {
      console.log('handleDeleteEdge', edgeId);
      await handleEdgeDelete(edgeId);
    },
    [handleEdgeDelete]
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

  const onConnect = useCallback(
    async (params) => {
      // Optimistically add the edge
      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}`,
        animated: true, // Add animation to show it's pending
      };
      setEdges((eds) => [...eds, newEdge]);

      // Then call the API to create the connection
      if (
        validateConnection(
          params.source,
          params.target,
          params.sourceHandle,
          params.targetHandle
        )
      ) {
        try {
          const response = await projectsApi.createConnection(
            projectId,
            {
              source_package_id: params.source,
              target_package_id: params.target,
              source_handle: params.sourceHandle,
              target_handle: params.targetHandle,
            },
            token
          );

          if (response && response.body) {
            // Update the edge with the response data
            const updatedEdge = {
              ...newEdge,
              ...response.body,
              animated: false, // Remove animation as it's no longer pending
            };
            setEdges((eds) =>
              eds.map((e) => (e.id === newEdge.id ? updatedEdge : e))
            );
          }
        } catch (error) {
          console.error('Error saving connection:', error);
          // Remove the optimistically added edge if the API call fails
          setEdges((eds) => eds.filter((e) => e.id !== newEdge.id));
        }
      }
    },
    [projectId, token, projectsApi, setEdges, validateConnection]
  );

  const nodesWithFunctions = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        updateNodeData: (newData) => updateNodeData(node.id, newData),
        onOpenModal: () => handleOpenModal(node.id),
        onDeploy: () => handleDeploy(node.id),
        onDelete: () => handleDeleteNode(node.id),
        onDeleteEdge: (edgeId) => handleDeleteEdge(edgeId),
        deploy_status: node.data?.deploy_status || 'NOT_DEPLOYED',
      },
    }));
  }, [
    nodes,
    handleOpenModal,
    handleDeploy,
    handleDeleteNode,
    updateNodeData,
    handleDeleteEdge,
  ]);

  return {
    nodes: [...nodesWithFunctions, ...tempNodes],
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
    // handleNameSubmit,
    modalState,
    setModalState,
    handleOpenModal,
    handleEdgeDelete,
    onSubmitForm,
    handleSubmitForm,
    handleDeleteNode,
    handleDeploy,
    updateNodeData,
    checkRequiredConnections,
    validateConnection,
  };
};

export default useFlowDiagram;
