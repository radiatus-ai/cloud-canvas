// these hooks are complicated, its still in flux
/* eslint-disable no-unused-vars */

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';
import transformPackagesToNodes from './transform';

const useNodeOperations = (
  projectId,
  projectData,
  nodes,
  setNodes,
  edges,
  setEdges,
  reactFlowWrapper
) => {
  const { token } = useAuth();
  const { projects: projectsApi } = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      projectData &&
      projectData.packages &&
      projectData.connections &&
      reactFlowWrapper.current
    ) {
      const canvasWidth = reactFlowWrapper.current.offsetWidth;
      const canvasHeight = reactFlowWrapper.current.offsetHeight;
      const { nodes: transformedNodes, edges: transformedEdges } =
        transformPackagesToNodes(
          projectData.packages,
          projectData.connections,
          canvasWidth,
          canvasHeight
        );
      setNodes(transformedNodes);
      setEdges(transformedEdges);
    }
  }, [projectData, setNodes, setEdges, reactFlowWrapper]);

  const onOpenModal = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      console.log('node', node);
      if (node) {
        return {
          selectedNodeId: nodeId,
          formData: node.data.parameter_data || {},
          schema: node.data.parameters || {},
        };
      }
      return null;
    },
    [nodes]
  );

  const onSubmitForm = useCallback(
    async (nodeId, newFormData) => {
      try {
        console.log('useNodeOperations - Submitting form data:', newFormData);
        console.log('useNodeOperations - Node ID:', nodeId);
        console.log('useNodeOperations - Project ID:', projectId);
        const response = await projectsApi.updatePackage(
          projectId,
          nodeId,
          { parameter_data: newFormData },
          token
        );
        console.log('useNodeOperations - API response:', response);
        const updatedPackage = response.body;

        if (updatedPackage) {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === nodeId
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      parameter_data: updatedPackage.parameter_data || {},
                      parameters: updatedPackage.parameters || {},
                    },
                  }
                : node
            )
          );

          console.log('useNodeOperations - Updated package:', updatedPackage);
          return updatedPackage.parameter_data || {};
        }
        return {};
      } catch (error) {
        console.error('useNodeOperations - Error updating package:', error);
        throw error;
      }
    },
    [projectId, token, projectsApi, setNodes]
  );

  const onDeleteNode = useCallback(
    async (nodeId) => {
      try {
        const node = nodes.find((n) => n.id === nodeId);
        if (node.data.deploy_status !== 'NOT_DEPLOYED') {
          throw new Error(
            'Cannot delete a deployed package. Please destroy it first.'
          );
        }
        console.log('useNodeOperations - Deleting node:', nodeId);
        console.log('useNodeOperations - Project ID:', projectId);

        await projectsApi.deletePackage(projectId, nodeId, token);
        console.log('useNodeOperations - Node deleted:', nodeId);

        // Remove the node
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));

        // Remove edges where this node is the target
        setEdges((eds) => eds.filter((edge) => edge.target !== nodeId));

        return true;
      } catch (error) {
        console.error('Error deleting node:', error);
        throw error;
      }
    },
    [projectId, token, projectsApi, setNodes, setEdges, nodes]
  );

  // todo: dedupe with CustomNode/NodeHeader.js
  const onDeploy = useCallback(
    async (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      try {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, deploy_status: 'DEPLOYING' } }
              : n
          )
        );
        const response = await projectsApi.deployPackage(
          projectId,
          node.data.id,
          node.data.parameters,
          token
        );
        const updatedPackage = response.body;

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
        return true;
      } catch (error) {
        console.error('Error deploying package:', error);
        setNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, deploy_status: 'FAILED' } }
              : n
          )
        );
        return false;
      }
    },
    [projectId, nodes, token, projectsApi, setNodes]
  );

  const updateNodeData = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, ...newData } };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  //   class ProjectPackageBase(BaseModel):
  //     name: str
  //     type: str
  //     inputs: Dict[str, Any]
  //     outputs: Dict[str, Any]
  //     parameters: Dict[str, Any]

  // class ProjectPackageCreate(ProjectPackageBase):
  //     project_id: UUID4

  const createNode = useCallback(
    async (packageInfo, position) => {
      try {
        console.log('createNode - packageInfo:', packageInfo);
        const response = await projectsApi.createPackage(
          projectId,
          {
            name: packageInfo.name,
            type: packageInfo.type,
            inputs: packageInfo.inputs,
            outputs: packageInfo.outputs,
            parameters: packageInfo.parameters,
            deploy_status: 'NOT_DEPLOYED',
          },
          token
        );
        const createdPackage = response.body;

        const newNode = {
          id: createdPackage.id,
          type: 'custom',
          position: position,
          data: {
            id: createdPackage.id,
            label: createdPackage.name,
            type: createdPackage.type,
            inputs: createdPackage.inputs,
            outputs: createdPackage.outputs,
            parameters: createdPackage.parameters,
            parameter_data: createdPackage.parameter_data || {},
            deploy_status: 'NOT_DEPLOYED',
          },
        };

        return newNode;
      } catch (error) {
        console.error('Error creating package:', error);
        throw error;
      }
    },
    [projectId, token, projectsApi]
  );

  return {
    nodes,
    setNodes,
    onOpenModal,
    onSubmitForm,
    onDeleteNode,
    onDeploy,
    updateNodeData,
    createNode,
    isLoading,
    error,
  };
};

export default useNodeOperations;
