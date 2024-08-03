import { useCallback } from 'react';
import { addEdge } from 'reactflow';
import apiService from '../../apiService';

const EdgeOperations = ({ nodes, edges, setEdges, projectId }) => {
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
      }
    },
    [setEdges, projectId]
  );

  return null;
};

export default EdgeOperations;
