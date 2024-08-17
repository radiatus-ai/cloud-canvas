// // apiService.js
// // import { OAuth2Client } from 'google-auth-library';
// // const {OAuth2Client} = require('google-auth-library');

// // Determine the API URL based on the environment
// const getApiUrl = () => {
//   switch (process.env.REACT_APP_ENV) {
//     case 'production':
//       return 'https://api-xe7ty6qn7a-uc.a.run.app';
//     case 'development':
//     default:
//       return 'http://localhost:8000';
//   }
// };

// async function verify(iapJwt, expectedAudience) {
//   // const oAuth2Client = new OAuth2Client();
//   // // Verify the id_token, and access the claims.
//   // const response = await oAuth2Client.getIapPublicKeys();
//   // const ticket = await oAuth2Client.verifySignedJwtWithCertsAsync(
//   //   iapJwt,
//   //   response.pubkeys,
//   //   expectedAudience,
//   //   ['https://cloud.google.com/iap']
//   // );
//   // // Print out the info contained in the IAP ID token
//   // console.log(ticket);
// }

// const API_URL = getApiUrl();

// let idToken = null;
// const TOKEN_STORAGE_KEY = 'auth_token';
// const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

// export const setIdToken = async (token) => {
//   let expectedAudience =
//     '/projects/988868445965/global/backendServices/1682481569315074083';
//   await verify(token, expectedAudience);
//   idToken = token;

//   // Store token and expiry in localStorage
//   localStorage.setItem(TOKEN_STORAGE_KEY, token);
//   // Set expiry to 1 hour from now
//   const expiryTime = new Date().getTime() + 60 * 60 * 1000;
//   localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
// };

// const getStoredToken = () => {
//   const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
//   const tokenExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

//   if (storedToken && tokenExpiry) {
//     // Check if token is expired
//     if (new Date().getTime() > parseInt(tokenExpiry)) {
//       // Token is expired, clear it
//       localStorage.removeItem(TOKEN_STORAGE_KEY);
//       localStorage.removeItem(TOKEN_EXPIRY_KEY);
//       return null;
//     }
//     return storedToken;
//   }
//   return null;
// };

// const refreshToken = async () => {
//   // Implement your token refresh logic here
//   // This might involve calling your backend to get a new token
//   // For now, we'll just clear the token and return null
//   localStorage.removeItem(TOKEN_STORAGE_KEY);
//   localStorage.removeItem(TOKEN_EXPIRY_KEY);
//   return null;
// };

// const getHeaders = async () => {
//   let token = idToken || getStoredToken();

//   if (!token) {
//     token = await refreshToken();
//   }

//   if (!token) {
//     throw new Error('Not authenticated');
//   }

//   return {
//     Authorization: `Bearer ${token}`,
//     'Content-Type': 'application/json',
//   };
// };

// export const apiService = {
//   // Fetch all packages
//   async fetchAllPackages() {
//     const headers = await getHeaders();
//     const response = await fetch(`${API_URL}/packages/`, {
//       credentials: 'include',
//       headers,
//     });
//     if (!response.ok) {
//       throw new Error('Failed to fetch packages');
//     }
//     return await response.json();
//   },

//   // Fetch all packages for a project
//   async fetchPackages(projectId) {
//     const headers = await getHeaders();
//     const response = await fetch(`${API_URL}/projects/${projectId}/packages/`, {
//       credentials: 'include',
//       headers,
//     });
//     if (!response.ok) {
//       throw new Error('Failed to fetch packages');
//     }
//     return await response.json();
//   },

//   // Create a new package
//   async createPackage(projectId, packageData) {
//     const headers = await getHeaders();
//     const response = await fetch(`${API_URL}/projects/${projectId}/packages/`, {
//       method: 'POST',
//       credentials: 'include',
//       headers,
//       body: JSON.stringify(packageData),
//     });
//     if (!response.ok) {
//       throw new Error('Failed to create package');
//     }
//     return await response.json();
//   },

//   // Update a package
//   async updatePackage(projectId, packageId, updateData) {
//     const headers = await getHeaders();
//     const response = await fetch(
//       `${API_URL}/projects/${projectId}/packages/${packageId}`,
//       {
//         method: 'PATCH',
//         credentials: 'include',
//         headers,
//         body: JSON.stringify(updateData),
//       }
//     );
//     if (!response.ok) {
//       throw new Error('Failed to update package');
//     }
//     return await response.json();
//   },

//   // Deploy a package
//   async deployPackage(projectId, packageId, deployData) {
//     const headers = await getHeaders();
//     const response = await fetch(
//       `${API_URL}/projects/${projectId}/packages/${packageId}/deploy`,
//       {
//         method: 'POST',
//         credentials: 'include',
//         headers,
//         body: JSON.stringify(deployData),
//       }
//     );
//     if (!response.ok) {
//       throw new Error('Deployment failed');
//     }
//     return await response.json();
//   },

//   // Fetch projects
//   async fetchProjects() {
//     const headers = await getHeaders();
//     const response = await fetch(`${API_URL}/projects/`, {
//       credentials: 'include',
//       headers,
//     });
//     if (!response.ok) {
//       throw new Error('Failed to fetch projects');
//     }
//     return await response.json();
//   },

//   // Create a project
//   async createProject(projectData) {
//     const headers = await getHeaders();
//     const response = await fetch(`${API_URL}/projects/`, {
//       method: 'POST',
//       credentials: 'include',
//       headers,
//       body: JSON.stringify(projectData),
//     });
//     if (!response.ok) {
//       throw new Error('Failed to create project');
//     }
//     return await response.json();
//   },

//   // Update a project
//   async updateProject(projectId, updateData) {
//     const headers = await getHeaders();
//     const response = await fetch(`${API_URL}/projects/${projectId}`, {
//       method: 'PATCH',
//       credentials: 'include',
//       headers,
//       body: JSON.stringify(updateData),
//     });
//     if (!response.ok) {
//       throw new Error('Failed to update project');
//     }
//     return await response.json();
//   },

//   // Delete a project
//   async deleteProject(projectId) {
//     const headers = await getHeaders();
//     const response = await fetch(`${API_URL}/projects/${projectId}`, {
//       method: 'DELETE',
//       credentials: 'include',
//       headers,
//     });
//     if (!response.ok) {
//       throw new Error('Failed to delete project');
//     }
//     return await response.json();
//   },

//   // Fetch connections for a project
//   async fetchConnections(projectId) {
//     const headers = await getHeaders();
//     const response = await fetch(
//       `${API_URL}/projects/${projectId}/connections/`,
//       { credentials: 'include', headers }
//     );
//     if (!response.ok) {
//       throw new Error('Failed to fetch connections');
//     }
//     return response.json();
//   },

//   // Create a connection for a project
//   async createConnection(projectId, connectionData) {
//     const headers = await getHeaders();
//     const response = await fetch(
//       `${API_URL}/projects/${projectId}/connections/`,
//       {
//         method: 'POST',
//         credentials: 'include',
//         headers,
//         body: JSON.stringify(connectionData),
//       }
//     );
//     if (!response.ok) {
//       throw new Error('Failed to create connection');
//     }
//     return response.json();
//   },

//   // Delete a connection for a project
//   async deleteConnection(projectId, connectionId) {
//     const headers = await getHeaders();
//     const response = await fetch(
//       `${API_URL}/projects/${projectId}/connections/${connectionId}`,
//       {
//         method: 'DELETE',
//         credentials: 'include',
//         headers,
//       }
//     );
//     if (!response.ok) {
//       throw new Error('Failed to delete connection');
//     }
//   },

//   async getUserInfo() {
//     const headers = await getHeaders();
//     const response = await fetch(`${API_URL}/users/me`, {
//       credentials: 'include',
//       headers,
//     });
//     if (!response.ok) {
//       throw new Error('Failed to fetch user info');
//     }
//     return await response.json();
//   },

//   // Destroy a package
//   async destroyPackage(projectId, packageId) {
//     const headers = await getHeaders();
//     const response = await fetch(
//       `${API_URL}/projects/${projectId}/packages/${packageId}/destroy`,
//       {
//         method: 'DELETE',
//         credentials: 'include',
//         headers,
//       }
//     );
//     if (!response.ok) {
//       throw new Error('Failed to destroy package');
//     }
//     return await response.json();
//   },

//   // Delete a package (modified to use the root delete endpoint)
//   async deletePackage(projectId, packageId) {
//     const headers = await getHeaders();
//     const response = await fetch(
//       `${API_URL}/projects/${projectId}/packages/${packageId}/`,
//       {
//         method: 'DELETE',
//         credentials: 'include',
//         headers,
//       }
//     );
//     if (!response.ok) {
//       throw new Error('Failed to delete package');
//     }
//     return await response.json();
//   },

//   // Utility function to check if user is authenticated
//   isAuthenticated: () => {
//     return !!getStoredToken();
//   },

//   // Utility function to transform API data to node format
//   transformToNodes(infraData) {
//     return infraData.map((infra, index) => ({
//       id: infra.id,
//       type: 'custom',
//       position: { x: 250 * (index + 1), y: 100 * (index + 1) },
//       data: {
//         id: infra.id,
//         label: infra.name,
//         deploy_status: infra.deploy_status,
//         type: infra.type,
//         inputs: infra.inputs,
//         outputs: infra.outputs,
//         output_data: infra.output_data,
//         parameters: infra.parameters,
//         parameter_data: infra.parameter_data,
//         createdAt: infra.created_at,
//         updatedAt: infra.updated_at,
//       },
//     }));
//   },

//   // Utility function to validate connections
//   validateConnection(nodes, source, target, sourceHandle, targetHandle) {
//     const sourceNode = nodes.find((node) => node.id === source);
//     const targetNode = nodes.find((node) => node.id === target);

//     if (sourceNode && targetNode) {
//       const sourceType = sourceNode.data.outputs.properties[sourceHandle]?.type;
//       const targetType = targetNode.data.inputs.properties[targetHandle]?.type;
//       return sourceType === targetType;
//     }
//     return false;
//   },

//   // Utility function to format date
//   formatDate(dateString) {
//     const date = new Date(dateString);
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       timeZoneName: 'short',
//     });
//   },
// };

// export default apiService;
