// these hooks are complicated, its still in flux
/* eslint-disable no-unused-vars */

import { useCallback } from 'react';
import { addEdge } from 'reactflow';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';

const useEdgeOperations = (projectId, projectData, nodes, edges, setEdges) => {
  const { token } = useAuth();
  const { projects: projectsApi } = useApi();

  const validateConnection = useCallback(
    (source, target, sourceHandle, targetHandle) => {
      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);
      if (sourceNode && targetNode && sourceNode.data && targetNode.data) {
        const sourceType =
          sourceNode.data.outputs?.properties?.[sourceHandle]?.type;
        const targetType =
          targetNode.data.inputs?.properties?.[targetHandle]?.type;
        return sourceType && targetType && sourceType === targetType;
      }
      return false;
    },
    [nodes]
  );

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
        const targetNode = nodes.find((node) => node.id === params.target);
        const newConnection = {
          source_package_id: params.source,
          target_package_id: params.target,
          source_handle: params.sourceHandle,
          target_handle: params.targetHandle,
        };
        try {
          const response = await projectsApi.createConnection(
            projectId,
            newConnection,
            token
          );
          if (response && response.body) {
            const newEdge = {
              ...response.body,
              data: {
                connectionType:
                  sourceNode?.data?.outputs?.properties?.[params.sourceHandle]
                    ?.type,
                targetDeployStatus: targetNode?.data?.deploy_status,
                onDelete: handleEdgeDelete,
              },
            };
            setEdges((eds) => addEdge(newEdge, eds));
          }
        } catch (error) {
          console.error('Error saving connection:', error);
        }
      }
    },
    [projectId, nodes, token, projectsApi, setEdges, validateConnection]
  );

  const handleEdgeDelete = useCallback(
    async (edgeId) => {
      try {
        const edge = edges.find((e) => e.id === edgeId);
        if (edge) {
          await projectsApi.deleteConnection(
            projectId,
            edge.source,
            edge.target,
            token
          );
          setEdges((eds) => eds.filter((e) => e.id !== edgeId));
        }
      } catch (error) {
        console.error('Error deleting connection:', error);
      }
    },
    [projectId, edges, token, projectsApi, setEdges]
  );

  const onConnectStart = useCallback(() => {
    // Add any logic needed when a connection starts
  }, []);

  const onConnectEnd = useCallback(() => {
    // Add any logic needed when a connection ends
  }, []);

  const onConnectCheck = useCallback(
    (params) => {
      return validateConnection(
        params.source,
        params.target,
        params.sourceHandle,
        params.targetHandle
      );
    },
    [validateConnection]
  );

  return {
    edges,
    setEdges,
    // onEdgesChange,
    onConnect,
    onConnectStart,
    onConnectEnd,
    onConnectCheck,
    handleEdgeDelete,
    validateConnection,
  };
};

export default useEdgeOperations;
