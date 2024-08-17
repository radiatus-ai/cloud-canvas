import { context, propagation, trace } from '@opentelemetry/api';
import { useCallback, useState } from 'react';
import {
  createApi,
  handleApiError,
  Project as ProjectsApi,
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

  const projects = {
    list: (token, parentSpan) =>
      apiCall(
        ProjectsApi,
        'listProjectsInfraV1ProjectsGet',
        [],
        token,
        parentSpan
      ),
    create: (data, token, parentSpan) =>
      apiCall(
        ProjectsApi,
        'createInfraV1ProjectsPost',
        [data],
        token,
        parentSpan
      ),
    createChat: (id, data, token, parentSpan) =>
      apiCall(
        ProjectsApi,
        'createChatInfraV1ProjectsProjectIdChatsPost',
        [id, data],
        token,
        parentSpan
      ),
    get: (id, token, parentSpan) =>
      apiCall(
        ProjectsApi,
        'getProjectInfraV1ProjectsProjectIdGet',
        [id],
        token,
        parentSpan
      ),
    update: (id, data, token, parentSpan) =>
      apiCall(
        ProjectsApi,
        'updateProjectInfraV1ProjectsProjectIdPut',
        [id, data],
        token,
        parentSpan
      ),
    delete: (id, token, parentSpan) =>
      apiCall(
        ProjectsApi,
        'deleteProjectInfraV1ProjectsProjectIdDelete',
        [id],
        token,
        parentSpan
      ),
    listRecentChats: (id, token, parentSpan) =>
      apiCall(
        ProjectsApi,
        'readChatsInfraV1ProjectsProjectIdChatsGet',
        [id],
        token,
        parentSpan
      ),
  };

  return { projects, error };
};

export default useApi;
