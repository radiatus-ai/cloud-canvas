import { useCallback, useEffect } from 'react';
import { useNodesState } from 'reactflow';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';

const useNodeOperations = (projectId, projectData) => {
  const { token } = useAuth();
  const { projects: projectsApi } = useApi();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  useEffect(() => {
    if (projectData && projectData.packages) {
      setNodes(transformPackagesToNodes(projectData.packages));
    }
  }, [projectData, setNodes]);

  const transformPackagesToNodes = (packages) => {
    return (packages || []).map((pkg) => ({
      id: pkg.id,
      type: 'custom',
      position: pkg.position || { x: 0, y: 0 },
      data: {
        id: pkg.id,
        label: pkg.name || '',
        type: pkg.type || '',
        inputs: pkg.inputs || {},
        outputs: pkg.outputs || {},
        parameters: pkg.parameters || {},
        parameter_data: pkg.parameter_data || {},
        deploy_status: pkg.deploy_status || 'undeployed',
      },
    }));
  };

  const onOpenModal = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        return {
          selectedNodeId: nodeId,
          formData: node.data.parameter_data || {},
        };
      }
      return null;
    },
    [nodes]
  );

  const onSubmitForm = useCallback(
    async (nodeId, newFormData) => {
      try {
        const response = await projectsApi.updatePackage(
          projectId,
          nodeId,
          { parameter_data: newFormData },
          token
        );
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

          return updatedPackage.parameter_data || {};
        }
        return {};
      } catch (error) {
        console.error('Error updating package:', error);
        throw error;
      }
    },
    [projectId, token, projectsApi, setNodes]
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
        await projectsApi.deletePackage(projectId, nodeId, token);

        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        return true;
      } catch (error) {
        console.error('Error deleting node:', error);
        setNodes((nds) =>
          nds.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, deploy_status: 'failed' } }
              : node
          )
        );
        return false;
      }
    },
    [projectId, token, projectsApi, setNodes]
  );

  const onDeploy = useCallback(
    async (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      try {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, deploy_status: 'deploying' } }
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
              ? { ...n, data: { ...n.data, deploy_status: 'failed' } }
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

  const createNode = useCallback(
    async (packageInfo, position) => {
      try {
        const response = await projectsApi.createPackage(
          projectId,
          {
            package_id: packageInfo.id,
            name: packageInfo.name,
            type: packageInfo.type,
            inputs: packageInfo.inputs,
            outputs: packageInfo.outputs,
            parameters: packageInfo.parameters,
            position: position,
            deploy_status: 'undeployed',
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
            deploy_status: 'undeployed',
          },
        };

        setNodes((nds) => nds.concat(newNode));
        return newNode;
      } catch (error) {
        console.error('Error creating package:', error);
        throw error;
      }
    },
    [projectId, token, projectsApi, setNodes]
  );

  return {
    nodes,
    setNodes,
    onNodesChange,
    onOpenModal,
    onSubmitForm,
    onDeleteNode,
    onDeploy,
    updateNodeData,
    createNode,
  };
};

export default useNodeOperations;
