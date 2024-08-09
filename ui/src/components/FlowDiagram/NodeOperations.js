import { useCallback } from 'react';
import apiService from '../../apiService';

const NodeOperations = ({
  nodes,
  setNodes,
  edges,
  setEdges,
  projectId,
  setMissingConnections,
  setMissingConnectionsModalOpen,
}) => {
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
          nds.map((n) =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, deploy_status: 'deploying' } }
              : n
          )
        );

        // Start polling for status updates
        const pollInterval = setInterval(async () => {
          const status = await apiService.getPackageStatus(projectId, nodeId);
          setNodes((nds) =>
            nds.map((n) =>
              n.id === nodeId
                ? {
                    ...n,
                    data: { ...n.data, deploy_status: status.deploy_status },
                  }
                : n
            )
          );

          if (
            status.deploy_status === 'deployed' ||
            status.deploy_status === 'failed'
          ) {
            clearInterval(pollInterval);
          }
        }, 2000); // Poll every 2 seconds

        const updatedPackage = await apiService.deployPackage(
          projectId,
          node.data.id,
          node.data.parameters
        );

        clearInterval(pollInterval); // Clear interval after deployment is complete

        setNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    deploy_status: updatedPackage.deploy_status,
                    parameters: updatedPackage.parameter_data,
                    ...updatedPackage,
                  },
                }
              : n
          )
        );
      } catch (error) {
        console.error('Error deploying package:', error);
        setNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, deploy_status: 'failed' } }
              : n
          )
        );
      }
    },
    [
      nodes,
      setNodes,
      projectId,
      checkRequiredConnections,
      setMissingConnections,
      setMissingConnectionsModalOpen,
    ]
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

        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
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
      }
    },
    [projectId, setNodes, setEdges]
  );

  return null;
};

export default NodeOperations;
