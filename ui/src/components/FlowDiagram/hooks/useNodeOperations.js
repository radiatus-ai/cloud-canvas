import { useCallback, useEffect, useState } from 'react';
import { useNodesState } from 'reactflow';
import { useAuth } from '../../../contexts/Auth';
import useApi from '../../../hooks/useAPI';

const useNodeOperations = (projectId, projectData, nodes, setNodes) => {
  const { token } = useAuth();
  const { projects: projectsApi } = useApi();
  // const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('projectData', projectData);
    if (projectData && projectData.packages) {
      setNodes(transformPackagesToNodes(projectData.packages));
    }
  }, [projectData, setNodes]);

  const transformPackagesToNodes = (packages) => {
    console.log('packages', packages);
    return (packages || []).map((pkg, index) => ({
      id: pkg.id,
      type: 'custom',
      // position: pkg.position && typeof pkg.position.x === 'number' && typeof pkg.position.y === 'number'
      //   ? pkg.position
      //   : { x: Math.random() * 500, y: Math.random() * 500 }, // Generate random position if invalid
      // position: { x: 250, y: 250 },
      position: { x: 250 * (index + 1), y: 100 * (index + 1) },
      data: {
        id: pkg.id,
        label: pkg.name || '',
        type: pkg.type || '',
        inputs: pkg.inputs || {},
        outputs: pkg.outputs || {},
        parameters: pkg.parameters || {},
        parameter_data: pkg.parameter_data || {},
        deploy_status: pkg.deploy_status || 'NOT_DEPLOYED',
      },
    }));
  };

  const onOpenModal = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      console.log('node', node);
      if (node) {
        return {
          selectedNodeId: nodeId,
          formData: node.data.parameter_data || {},
          schema: node.data.parameters || {}, // Ensure we're passing the schema
        };
      }
      return null;
    },
    [nodes]
  );

  const onSubmitForm = useCallback(
    async (projectIdTwo, nodeId, newFormData) => {
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
        setNodes((nds) =>
          nds.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, deploy_status: 'DEPLOYING' } }
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
              ? { ...node, data: { ...node.data, deploy_status: 'FAILED' } }
              : node
          )
        );
        return false;
      }
    },
    [projectId, token, projectsApi, setNodes]
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
            // package_id: packageInfo.id,
            name: packageInfo.name,
            type: packageInfo.type,
            inputs: packageInfo.inputs,
            outputs: packageInfo.outputs,
            parameters: packageInfo.parameters,
            // store position later, use smater layout algos, etc
            // position: position,
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
    // onNodesChange,
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
