import { context, propagation, trace } from '@opentelemetry/api';
import { useCallback, useMemo, useState } from 'react';
import {
  createApi,
  DefaultApi,
  ProjectApi,
  handleApiError,
} from '../clients/canvas-client';

const useApi = () => {
  const [error, setError] = useState(null);

  const apiCall = useCallback(
    async (ApiClass, method, params = [], token = null, parentSpan = null) => {
      let headers = {};

      if (parentSpan) {
        const ctx = trace.setSpan(context.active(), parentSpan);
        const carrier = {};
        propagation.inject(ctx, carrier);
        headers = { ...carrier };
      }

      try {
        const api = createApi(ApiClass, token);
        const apiMethod = api[method];
        if (typeof apiMethod !== 'function') {
          throw new Error(`Invalid method ${method} for ${ApiClass.name}`);
        }

        const response = await apiMethod.apply(api, params);
        return response;
      } catch (err) {
        if (parentSpan) {
          parentSpan.recordException(err);
        }
        setError(err.message);
        handleApiError(err);
        throw err;
      }
    },
    []
  );

  const projects = useMemo(
    () => ({
      list: (token, parentSpan) =>
        apiCall(
          DefaultApi,
          'listProjectsProjectsGet',
          [{ skip: 0, limit: 100 }],
          token,
          parentSpan
        ),
      create: (data, token, parentSpan) =>
        apiCall(
          DefaultApi,
          'createProjectProjectsPost',
          [data],
          token,
          parentSpan
        ),
      get: (id, token, parentSpan) =>
        apiCall(
          DefaultApi,
          'getProjectProjectsProjectIdGet',
          [id],
          token,
          parentSpan
        ),
      update: (id, data, token, parentSpan) =>
        apiCall(
          DefaultApi,
          'updateProjectProjectsProjectIdPatch',
          [id, data],
          token,
          parentSpan
        ),
      delete: (id, token, parentSpan) =>
        apiCall(
          DefaultApi,
          'deleteProjectProjectsProjectIdDelete',
          [id],
          token,
          parentSpan
        ),
      // New methods for packages
      listPackages: (token, parentSpan) =>
        apiCall(
          DefaultApi,
          'listAllPackagesPackagesGet',
          [],
          token,
          parentSpan
        ),
      listProjectPackages: (projectId, token, parentSpan) =>
        apiCall(
          ProjectApi,
          'listProjectPackagesProjectsProjectIdPackagesGet',
          [projectId],
          token,
          parentSpan
        ),
      createPackage: (projectId, data, token, parentSpan) =>
        apiCall(
          ProjectApi,
          'createProjectPackageProjectsProjectIdPackagesPost',
          [projectId, data],
          token,
          parentSpan
        ),
      updatePackage: (projectId, packageId, data, token, parentSpan) =>
        apiCall(
          ProjectApi,
          'updateProjectPackageProjectsProjectIdPackagesPackageIdPatch',
          [projectId, packageId, data],
          token,
          parentSpan
        ),
      deletePackage: (projectId, packageId, token, parentSpan) =>
        apiCall(
          ProjectApi,
          'deleteProjectPackageProjectsProjectIdPackagesPackageIdDelete',
          [projectId, packageId],
          token,
          parentSpan
        ),
      deployPackage: (projectId, packageId, data, token, parentSpan) =>
        apiCall(
          ProjectApi,
          'deployProjectPackageProjectsProjectIdPackagesPackageIdDeployPost',
          [projectId, packageId, data],
          token,
          parentSpan
        ),
      // New methods for connections
      listConnections: (projectId, token, parentSpan) =>
        apiCall(
          DefaultApi,
          'listConnectionsProjectsProjectIdConnectionsGet',
          [projectId],
          token,
          parentSpan
        ),
      createConnection: (projectId, data, token, parentSpan) =>
        apiCall(
          DefaultApi,
          'createConnectionProjectsProjectIdConnectionsPost',
          [projectId, data],
          token,
          parentSpan
        ),
      deleteConnection: (projectId, connectionId, token, parentSpan) =>
        apiCall(
          DefaultApi,
          'deleteConnectionProjectsProjectIdConnectionsConnectionIdDelete',
          [projectId, connectionId],
          token,
          parentSpan
        ),
    }),
    [apiCall]
  );

  const credentials = useMemo(
    () => ({
      list: (token, parentSpan) =>
        apiCall(
          DefaultApi,
          'listCredentialsCredentialsGet',
          [],
          token,
          parentSpan
        ),
      create: (data, token, parentSpan) =>
        apiCall(
          DefaultApi,
          'createCredentialCredentialsPost',
          [data],
          token,
          parentSpan
        ),
      get: (id, token, parentSpan) =>
        apiCall(
          DefaultApi,
          'getCredentialCredentialsCredentialIdGet',
          [id],
          token,
          parentSpan
        ),
      update: (id, data, token, parentSpan) =>
        apiCall(
          DefaultApi,
          'updateCredentialCredentialsCredentialIdPatch',
          [id, data],
          token,
          parentSpan
        ),
      delete: (id, token, parentSpan) =>
        apiCall(
          DefaultApi,
          'deleteCredentialCredentialsCredentialIdDelete',
          [id],
          token,
          parentSpan
        ),
    }),
    [apiCall]
  );

  return { projects, credentials, error };
};

export default useApi;
