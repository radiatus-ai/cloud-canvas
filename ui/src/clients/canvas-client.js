import { ApiClient, DefaultApi, ProjectApi } from 'canvas-client';
import { getSecureCookie } from '../utils/secureStorage';

const getApiUrl = () => {
  switch (process.env.REACT_APP_ENV) {
    case 'production':
      return 'https://canvas-api.dev.r7ai.net';
    case 'development':
    default:
      return process.env.REACT_APP_API_URL || 'http://localhost:8000';
  }
};

let apiClientInstance = null;

const createApiClient = async () => {
  if (apiClientInstance) {
    return apiClientInstance;
  }

  const client = new ApiClient(getApiUrl());

  // Override the existing callApi method to include headers and better error handling
  const originalCallApi = client.callApi.bind(client);
  client.callApi = async (
    path,
    httpMethod,
    pathParams,
    queryParams,
    headerParams,
    formParams,
    bodyParam,
    authNames,
    contentTypes,
    accepts,
    returnType,
    callback
  ) => {
    const token = getSecureCookie('authToken');
    const updatedHeaderParams = {
      ...headerParams,
      Authorization: token ? `Bearer ${token}` : undefined,
    };

    try {
      const response = await originalCallApi(
        path,
        httpMethod,
        pathParams,
        queryParams,
        updatedHeaderParams,
        formParams,
        bodyParam,
        authNames,
        contentTypes,
        accepts,
        returnType,
        callback
      );

      if (response && response.body) {
        return response;
      } else {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('API call failed:', error);
      if (error.status === 401) {
        // Token might be expired, trigger a refresh
        // You might want to implement a token refresh mechanism here
        console.warn('Authentication failed. Token might be expired.');
      }
      throw error;
    }
  };

  apiClientInstance = client;
  return client;
};

// Factory function to create API instances
export const createApi = async (ApiClass) => {
  const apiClient = await createApiClient();
  return new ApiClass(apiClient);
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
  } else if (error.request) {
    console.error('No response received:', error.request);
  } else {
    console.error('Error setting up request:', error.message);
  }
  // You can add custom error handling logic here, such as showing a notification to the user
};

export { DefaultApi, ProjectApi };

// Utility function to create instances of specific APIs
export const createDefaultApi = async () => createApi(DefaultApi);
export const createProjectApi = async () => createApi(ProjectApi);

// Example of how to use the API in your components:
//
// import { createDefaultApi, createProjectApi, handleApiError } from './canvas-client';
//
// const YourComponent = () => {
//   const fetchData = async () => {
//     try {
//       const defaultApi = await createDefaultApi();
//       const projectApi = await createProjectApi();
//
//       const projects = await defaultApi.listProjectsProjectsGet();
//       const packages = await projectApi.listProjectPackagesProjectsProjectIdPackagesGet('your-project-id');
//
//       // Handle the responses...
//     } catch (error) {
//       handleApiError(error);
//     }
//   };
//
//   // ... rest of your component logic
// };
