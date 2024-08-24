import { ApiClient, DefaultApi, ProjectApi } from 'canvas-client';

const getApiUrl = () => {
  switch (process.env.REACT_APP_ENV) {
    case 'production':
      return 'https://canvas-api.dev.r7ai.net';
    case 'development':
    default:
      return process.env.REACT_APP_API_URL || 'http://localhost:8000';
  }
};

const getHeaders = (customToken = null) => {
  const token = customToken || localStorage.getItem('authToken');
  return {
    Authorization: token ? `Bearer ${token}` : undefined,
  };
};

let apiClientInstance = null;

const createApiClient = (customToken = null) => {
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
    const updatedHeaderParams = {
      ...headerParams,
      ...getHeaders(customToken),
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
      throw error;
    }
  };

  apiClientInstance = client;
  return client;
};

// Factory function to create API instances
export const createApi = (ApiClass, customToken = null) => {
  const apiClient = createApiClient(customToken);
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

export { DefaultApi, ProjectApi};
