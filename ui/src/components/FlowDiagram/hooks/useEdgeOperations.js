import { useCallback } from 'react';
import { addEdge, useEdgesState } from 'reactflow';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';

const useEdgeOperations = (projectId, nodes) => {
  const { token } = useAuth();
  const { projects: projectsApi } = useApi();
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
        const connectionType =
          sourceNode?.data?.outputs?.properties?.[params.sourceHandle]?.type;
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
          const response = await projectsApi.createConnection(
            projectId,
            newEdge,
            token
          );
          if (response && response.body) {
            setEdges((eds) => addEdge(response.body, eds));
          }
        } catch (error) {
          console.error('Error saving connection:', error);
        }
      }
    },
    [projectId, nodes, token, projectsApi, setEdges, validateConnection]
  );

  const onEdgesDelete = useCallback(
    async (edgesToDelete) => {
      try {
        await Promise.all(
          edgesToDelete.map((edge) =>
            projectsApi.deleteConnection(projectId, edge.id, token)
          )
        );
        setEdges((edges) =>
          edges.filter((edge) => !edgesToDelete.some((e) => e.id === edge.id))
        );
      } catch (error) {
        console.error('Error deleting connections:', error);
      }
    },
    [projectId, token, projectsApi, setEdges]
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
    onEdgesChange,
    onConnect,
    onConnectStart,
    onConnectEnd,
    onConnectCheck,
    onEdgesDelete,
    validateConnection,
  };
};

export default useEdgeOperations;