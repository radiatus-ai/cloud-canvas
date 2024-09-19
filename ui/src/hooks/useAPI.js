import { context, propagation, trace } from '@opentelemetry/api';
import { useCallback, useMemo, useState } from 'react';
import {
  createApi,
  DefaultApi,
  handleApiError,
  ProjectApi,
} from '../clients/canvas-client';
import { useAuth } from '../contexts/Auth';

const useApi = () => {
  const [error, setError] = useState(null);
  const { getValidToken, logout } = useAuth();

  const apiCall = useCallback(
    async (ApiClass, method, params = [], parentSpan = null) => {
      let headers = {};

      if (parentSpan) {
        const ctx = trace.setSpan(context.active(), parentSpan);
        const carrier = {};
        propagation.inject(ctx, carrier);
        headers = { ...carrier };
      }

      try {
        const token = await getValidToken();
        if (!token) {
          throw new Error('No valid token available');
        }

        const api = await createApi(ApiClass, () => Promise.resolve(token));
        const apiMethod = api[method];
        if (typeof apiMethod !== 'function') {
          throw new Error(`Invalid method ${method} for ${ApiClass.name}`);
        }

        const response = await apiMethod.apply(api, [...params, { headers }]);
        return response;
      } catch (err) {
        if (parentSpan) {
          parentSpan.recordException(err);
        }
        setError(err.message);
        handleApiError(err);
        if (err.response && err.response.status === 401) {
          logout();
          throw new Error('Authentication failed. Please log in again.');
        }
        throw err;
      }
    },
    [getValidToken, logout]
  );

  const projects = useMemo(
    () => ({
      list: (parentSpan) =>
        apiCall(
          DefaultApi,
          'listProjectsProjectsGet',
          [{ skip: 0, limit: 100 }],
          parentSpan
        ),
      create: (data, parentSpan) =>
        apiCall(DefaultApi, 'createProjectProjectsPost', [data], parentSpan),
      get: (id, parentSpan) =>
        apiCall(DefaultApi, 'getProjectProjectsProjectIdGet', [id], parentSpan),
      update: (id, data, parentSpan) =>
        apiCall(
          DefaultApi,
          'updateProjectProjectsProjectIdPatch',
          [id, data],
          parentSpan
        ),
      delete: (id, parentSpan) =>
        apiCall(
          DefaultApi,
          'deleteProjectProjectsProjectIdDelete',
          [id],
          parentSpan
        ),
      listPackages: (parentSpan) =>
        apiCall(DefaultApi, 'listAllPackagesPackagesGet', [], parentSpan),
      listProjectPackages: (projectId, parentSpan) =>
        apiCall(
          ProjectApi,
          'listProjectPackagesProjectsProjectIdPackagesGet',
          [projectId],
          parentSpan
        ),
      createPackage: (projectId, data, parentSpan) =>
        apiCall(
          ProjectApi,
          'createProjectPackageProjectsProjectIdPackagesPost',
          [projectId, data],
          parentSpan
        ),
      updatePackage: (projectId, packageId, data, parentSpan) =>
        apiCall(
          ProjectApi,
          'updateProjectPackageProjectsProjectIdPackagesPackageIdPatch',
          [projectId, packageId, data],
          parentSpan
        ),
      deletePackage: (projectId, packageId, parentSpan) =>
        apiCall(
          ProjectApi,
          'deleteProjectPackageProjectsProjectIdPackagesPackageIdDelete',
          [projectId, packageId],
          parentSpan
        ),
      deployPackage: (projectId, packageId, parentSpan) =>
        apiCall(
          ProjectApi,
          'deployProjectPackageProjectsProjectIdPackagesPackageIdDeployPost',
          [projectId, packageId],
          parentSpan
        ),
      destroyPackage: (projectId, packageId, parentSpan) =>
        apiCall(
          ProjectApi,
          'destroyProjectPackageProjectsProjectIdPackagesPackageIdDestroyDelete',
          [projectId, packageId],
          parentSpan
        ),
      listConnections: (projectId, parentSpan) =>
        apiCall(
          DefaultApi,
          'listConnectionsProjectsProjectIdConnectionsGet',
          [projectId],
          parentSpan
        ),
      createConnection: (projectId, data, parentSpan) =>
        apiCall(
          DefaultApi,
          'createConnectionProjectsProjectIdConnectionsPost',
          [projectId, data],
          parentSpan
        ),
      deleteConnection: (
        projectId,
        sourcePackageId,
        targetPackageId,
        parentSpan
      ) =>
        apiCall(
          DefaultApi,
          'deleteConnectionProjectsProjectIdSourcePackageIdTargetPackageIdDelete',
          [projectId, sourcePackageId, targetPackageId],
          parentSpan
        ),
    }),
    [apiCall]
  );

  const credentials = useMemo(
    () => ({
      list: (parentSpan) =>
        apiCall(DefaultApi, 'listCredentialsCredentialsGet', [], parentSpan),
      create: (data, parentSpan) =>
        apiCall(
          DefaultApi,
          'createCredentialCredentialsPost',
          [data],
          parentSpan
        ),
      get: (id, parentSpan) =>
        apiCall(
          DefaultApi,
          'getCredentialCredentialsCredentialIdGet',
          [id],
          parentSpan
        ),
      update: (id, data, parentSpan) =>
        apiCall(
          DefaultApi,
          'updateCredentialCredentialsCredentialIdPatch',
          [id, data],
          parentSpan
        ),
      delete: (id, parentSpan) =>
        apiCall(
          DefaultApi,
          'deleteCredentialCredentialsCredentialIdDelete',
          [id],
          parentSpan
        ),
    }),
    [apiCall]
  );

  return { projects, credentials, error };
};

export default useApi;
