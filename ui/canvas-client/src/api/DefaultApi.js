/**
 * Canvas API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';
import Connection from '../model/Connection';
import ConnectionCreate from '../model/ConnectionCreate';
import Credential from '../model/Credential';
import CredentialCreate from '../model/CredentialCreate';
import CredentialUpdate from '../model/CredentialUpdate';
import HTTPValidationError from '../model/HTTPValidationError';
import Package from '../model/Package';
import PackageCreate from '../model/PackageCreate';
import PackageUpdate from '../model/PackageUpdate';
import Project from '../model/Project';
import ProjectCreate from '../model/ProjectCreate';
import ProjectUpdate from '../model/ProjectUpdate';

/**
 * Default service.
 * @module api/DefaultApi
 * @version 0.1.0
 */
export default class DefaultApi {
  /**
   * Constructs a new DefaultApi.
   * @alias module:api/DefaultApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
  }

  /**
   * Callback function to receive the result of the createConnectionProjectsProjectIdConnectionsPost operation.
   * @callback module:api/DefaultApi~createConnectionProjectsProjectIdConnectionsPostCallback
   * @param {String} error Error message, if any.
   * @param {module:model/Connection} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Create Connection
   * @param {String} projectId
   * @param {module:model/ConnectionCreate} connectionCreate
   * @param {module:api/DefaultApi~createConnectionProjectsProjectIdConnectionsPostCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/Connection}
   */
  createConnectionProjectsProjectIdConnectionsPost(
    projectId,
    connectionCreate,
    callback
  ) {
    let postBody = connectionCreate;
    // verify the required parameter 'projectId' is set
    if (projectId === undefined || projectId === null) {
      throw new Error(
        "Missing the required parameter 'projectId' when calling createConnectionProjectsProjectIdConnectionsPost"
      );
    }
    // verify the required parameter 'connectionCreate' is set
    if (connectionCreate === undefined || connectionCreate === null) {
      throw new Error(
        "Missing the required parameter 'connectionCreate' when calling createConnectionProjectsProjectIdConnectionsPost"
      );
    }

    let pathParams = {
      project_id: projectId,
    };
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = ['application/json'];
    let accepts = ['application/json'];
    let returnType = Connection;
    return this.apiClient.callApi(
      '/projects/{project_id}/connections/',
      'POST',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the createCredentialCredentialsPost operation.
   * @callback module:api/DefaultApi~createCredentialCredentialsPostCallback
   * @param {String} error Error message, if any.
   * @param {module:model/Credential} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Create Credential
   * @param {module:model/CredentialCreate} credentialCreate
   * @param {module:api/DefaultApi~createCredentialCredentialsPostCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/Credential}
   */
  createCredentialCredentialsPost(credentialCreate, callback) {
    let postBody = credentialCreate;
    // verify the required parameter 'credentialCreate' is set
    if (credentialCreate === undefined || credentialCreate === null) {
      throw new Error(
        "Missing the required parameter 'credentialCreate' when calling createCredentialCredentialsPost"
      );
    }

    let pathParams = {};
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = ['application/json'];
    let accepts = ['application/json'];
    let returnType = Credential;
    return this.apiClient.callApi(
      '/credentials/',
      'POST',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the createGlobalPackagePackagesPost operation.
   * @callback module:api/DefaultApi~createGlobalPackagePackagesPostCallback
   * @param {String} error Error message, if any.
   * @param {module:model/Package} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Create Global Package
   * @param {module:model/PackageCreate} packageCreate
   * @param {module:api/DefaultApi~createGlobalPackagePackagesPostCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/Package}
   */
  createGlobalPackagePackagesPost(packageCreate, callback) {
    let postBody = packageCreate;
    // verify the required parameter 'packageCreate' is set
    if (packageCreate === undefined || packageCreate === null) {
      throw new Error(
        "Missing the required parameter 'packageCreate' when calling createGlobalPackagePackagesPost"
      );
    }

    let pathParams = {};
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = ['application/json'];
    let accepts = ['application/json'];
    let returnType = Package;
    return this.apiClient.callApi(
      '/packages',
      'POST',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the createOrUpdatePackagePackagesPackageIdPut operation.
   * @callback module:api/DefaultApi~createOrUpdatePackagePackagesPackageIdPutCallback
   * @param {String} error Error message, if any.
   * @param {module:model/Package} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Create Or Update Package
   * @param {String} packageId The ID of the package
   * @param {module:model/PackageUpdate} packageUpdate
   * @param {module:api/DefaultApi~createOrUpdatePackagePackagesPackageIdPutCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/Package}
   */
  createOrUpdatePackagePackagesPackageIdPut(
    packageId,
    packageUpdate,
    callback
  ) {
    let postBody = packageUpdate;
    // verify the required parameter 'packageId' is set
    if (packageId === undefined || packageId === null) {
      throw new Error(
        "Missing the required parameter 'packageId' when calling createOrUpdatePackagePackagesPackageIdPut"
      );
    }
    // verify the required parameter 'packageUpdate' is set
    if (packageUpdate === undefined || packageUpdate === null) {
      throw new Error(
        "Missing the required parameter 'packageUpdate' when calling createOrUpdatePackagePackagesPackageIdPut"
      );
    }

    let pathParams = {
      package_id: packageId,
    };
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = ['application/json'];
    let accepts = ['application/json'];
    let returnType = Package;
    return this.apiClient.callApi(
      '/packages/{package_id}',
      'PUT',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the createProjectProjectsPost operation.
   * @callback module:api/DefaultApi~createProjectProjectsPostCallback
   * @param {String} error Error message, if any.
   * @param {Object} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Create Project
   * @param {module:model/ProjectCreate} projectCreate
   * @param {module:api/DefaultApi~createProjectProjectsPostCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link Object}
   */
  createProjectProjectsPost(projectCreate, callback) {
    let postBody = projectCreate;
    // verify the required parameter 'projectCreate' is set
    if (projectCreate === undefined || projectCreate === null) {
      throw new Error(
        "Missing the required parameter 'projectCreate' when calling createProjectProjectsPost"
      );
    }

    let pathParams = {};
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = ['application/json'];
    let accepts = ['application/json'];
    let returnType = Object;
    return this.apiClient.callApi(
      '/projects/',
      'POST',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the deleteConnectionProjectsProjectIdConnectionsConnectionIdDelete operation.
   * @callback module:api/DefaultApi~deleteConnectionProjectsProjectIdConnectionsConnectionIdDeleteCallback
   * @param {String} error Error message, if any.
   * @param {module:model/Connection} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Delete Connection
   * @param {String} projectId
   * @param {String} connectionId
   * @param {module:api/DefaultApi~deleteConnectionProjectsProjectIdConnectionsConnectionIdDeleteCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/Connection}
   */
  deleteConnectionProjectsProjectIdConnectionsConnectionIdDelete(
    projectId,
    connectionId,
    callback
  ) {
    let postBody = null;
    // verify the required parameter 'projectId' is set
    if (projectId === undefined || projectId === null) {
      throw new Error(
        "Missing the required parameter 'projectId' when calling deleteConnectionProjectsProjectIdConnectionsConnectionIdDelete"
      );
    }
    // verify the required parameter 'connectionId' is set
    if (connectionId === undefined || connectionId === null) {
      throw new Error(
        "Missing the required parameter 'connectionId' when calling deleteConnectionProjectsProjectIdConnectionsConnectionIdDelete"
      );
    }

    let pathParams = {
      project_id: projectId,
      connection_id: connectionId,
    };
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = Connection;
    return this.apiClient.callApi(
      '/projects/{project_id}/connections/{connection_id}',
      'DELETE',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the deleteCredentialCredentialsCredentialIdDelete operation.
   * @callback module:api/DefaultApi~deleteCredentialCredentialsCredentialIdDeleteCallback
   * @param {String} error Error message, if any.
   * @param {module:model/Credential} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Delete Credential
   * @param {String} credentialId
   * @param {module:api/DefaultApi~deleteCredentialCredentialsCredentialIdDeleteCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/Credential}
   */
  deleteCredentialCredentialsCredentialIdDelete(credentialId, callback) {
    let postBody = null;
    // verify the required parameter 'credentialId' is set
    if (credentialId === undefined || credentialId === null) {
      throw new Error(
        "Missing the required parameter 'credentialId' when calling deleteCredentialCredentialsCredentialIdDelete"
      );
    }

    let pathParams = {
      credential_id: credentialId,
    };
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = Credential;
    return this.apiClient.callApi(
      '/credentials/{credential_id}',
      'DELETE',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the deleteProjectProjectsProjectIdDelete operation.
   * @callback module:api/DefaultApi~deleteProjectProjectsProjectIdDeleteCallback
   * @param {String} error Error message, if any.
   * @param {module:model/Project} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Delete Project
   * @param {String} projectId
   * @param {module:api/DefaultApi~deleteProjectProjectsProjectIdDeleteCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/Project}
   */
  deleteProjectProjectsProjectIdDelete(projectId, callback) {
    let postBody = null;
    // verify the required parameter 'projectId' is set
    if (projectId === undefined || projectId === null) {
      throw new Error(
        "Missing the required parameter 'projectId' when calling deleteProjectProjectsProjectIdDelete"
      );
    }

    let pathParams = {
      project_id: projectId,
    };
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = Project;
    return this.apiClient.callApi(
      '/projects/{project_id}',
      'DELETE',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the getCredentialCredentialsCredentialIdGet operation.
   * @callback module:api/DefaultApi~getCredentialCredentialsCredentialIdGetCallback
   * @param {String} error Error message, if any.
   * @param {module:model/Credential} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Get Credential
   * @param {String} credentialId
   * @param {module:api/DefaultApi~getCredentialCredentialsCredentialIdGetCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/Credential}
   */
  getCredentialCredentialsCredentialIdGet(credentialId, callback) {
    let postBody = null;
    // verify the required parameter 'credentialId' is set
    if (credentialId === undefined || credentialId === null) {
      throw new Error(
        "Missing the required parameter 'credentialId' when calling getCredentialCredentialsCredentialIdGet"
      );
    }

    let pathParams = {
      credential_id: credentialId,
    };
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = Credential;
    return this.apiClient.callApi(
      '/credentials/{credential_id}',
      'GET',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the listAllPackagesPackagesGet operation.
   * @callback module:api/DefaultApi~listAllPackagesPackagesGetCallback
   * @param {String} error Error message, if any.
   * @param {Array.<module:model/Package>} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * List All Packages
   * @param {Object} opts Optional parameters
   * @param {Number} [skip = 0)]
   * @param {Number} [limit = 100)]
   * @param {module:api/DefaultApi~listAllPackagesPackagesGetCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link Array.<module:model/Package>}
   */
  listAllPackagesPackagesGet(opts, callback) {
    opts = opts || {};
    let postBody = null;

    let pathParams = {};
    let queryParams = {
      skip: opts['skip'],
      limit: opts['limit'],
    };
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = [Package];
    return this.apiClient.callApi(
      '/packages',
      'GET',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the listConnectionsProjectsProjectIdConnectionsGet operation.
   * @callback module:api/DefaultApi~listConnectionsProjectsProjectIdConnectionsGetCallback
   * @param {String} error Error message, if any.
   * @param {Array.<module:model/Connection>} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * List Connections
   * @param {String} projectId
   * @param {module:api/DefaultApi~listConnectionsProjectsProjectIdConnectionsGetCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link Array.<module:model/Connection>}
   */
  listConnectionsProjectsProjectIdConnectionsGet(projectId, callback) {
    let postBody = null;
    // verify the required parameter 'projectId' is set
    if (projectId === undefined || projectId === null) {
      throw new Error(
        "Missing the required parameter 'projectId' when calling listConnectionsProjectsProjectIdConnectionsGet"
      );
    }

    let pathParams = {
      project_id: projectId,
    };
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = [Connection];
    return this.apiClient.callApi(
      '/projects/{project_id}/connections/',
      'GET',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the listCredentialsCredentialsGet operation.
   * @callback module:api/DefaultApi~listCredentialsCredentialsGetCallback
   * @param {String} error Error message, if any.
   * @param {Array.<module:model/Credential>} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * List Credentials
   * @param {Object} opts Optional parameters
   * @param {Number} [skip = 0)]
   * @param {Number} [limit = 100)]
   * @param {module:api/DefaultApi~listCredentialsCredentialsGetCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link Array.<module:model/Credential>}
   */
  listCredentialsCredentialsGet(opts, callback) {
    opts = opts || {};
    let postBody = null;

    let pathParams = {};
    let queryParams = {
      skip: opts['skip'],
      limit: opts['limit'],
    };
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = [Credential];
    return this.apiClient.callApi(
      '/credentials/',
      'GET',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the listProjectsProjectsGet operation.
   * @callback module:api/DefaultApi~listProjectsProjectsGetCallback
   * @param {String} error Error message, if any.
   * @param {Array.<module:model/Project>} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * List Projects
   * @param {Object} opts Optional parameters
   * @param {Number} [skip = 0)]
   * @param {Number} [limit = 100)]
   * @param {module:api/DefaultApi~listProjectsProjectsGetCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link Array.<module:model/Project>}
   */
  listProjectsProjectsGet(opts, callback) {
    opts = opts || {};
    let postBody = null;

    let pathParams = {};
    let queryParams = {
      skip: opts['skip'],
      limit: opts['limit'],
    };
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = [Project];
    return this.apiClient.callApi(
      '/projects/',
      'GET',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the rootGet operation.
   * @callback module:api/DefaultApi~rootGetCallback
   * @param {String} error Error message, if any.
   * @param {Object} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Root
   * @param {module:api/DefaultApi~rootGetCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link Object}
   */
  rootGet(callback) {
    let postBody = null;

    let pathParams = {};
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = Object;
    return this.apiClient.callApi(
      '/',
      'GET',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the updateCredentialCredentialsCredentialIdPatch operation.
   * @callback module:api/DefaultApi~updateCredentialCredentialsCredentialIdPatchCallback
   * @param {String} error Error message, if any.
   * @param {module:model/Credential} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Update Credential
   * @param {String} credentialId
   * @param {module:model/CredentialUpdate} credentialUpdate
   * @param {module:api/DefaultApi~updateCredentialCredentialsCredentialIdPatchCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/Credential}
   */
  updateCredentialCredentialsCredentialIdPatch(
    credentialId,
    credentialUpdate,
    callback
  ) {
    let postBody = credentialUpdate;
    // verify the required parameter 'credentialId' is set
    if (credentialId === undefined || credentialId === null) {
      throw new Error(
        "Missing the required parameter 'credentialId' when calling updateCredentialCredentialsCredentialIdPatch"
      );
    }
    // verify the required parameter 'credentialUpdate' is set
    if (credentialUpdate === undefined || credentialUpdate === null) {
      throw new Error(
        "Missing the required parameter 'credentialUpdate' when calling updateCredentialCredentialsCredentialIdPatch"
      );
    }

    let pathParams = {
      credential_id: credentialId,
    };
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = ['application/json'];
    let accepts = ['application/json'];
    let returnType = Credential;
    return this.apiClient.callApi(
      '/credentials/{credential_id}',
      'PATCH',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }

  /**
   * Callback function to receive the result of the updateProjectProjectsProjectIdPatch operation.
   * @callback module:api/DefaultApi~updateProjectProjectsProjectIdPatchCallback
   * @param {String} error Error message, if any.
   * @param {module:model/Project} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Update Project
   * @param {String} projectId
   * @param {module:model/ProjectUpdate} projectUpdate
   * @param {module:api/DefaultApi~updateProjectProjectsProjectIdPatchCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/Project}
   */
  updateProjectProjectsProjectIdPatch(projectId, projectUpdate, callback) {
    let postBody = projectUpdate;
    // verify the required parameter 'projectId' is set
    if (projectId === undefined || projectId === null) {
      throw new Error(
        "Missing the required parameter 'projectId' when calling updateProjectProjectsProjectIdPatch"
      );
    }
    // verify the required parameter 'projectUpdate' is set
    if (projectUpdate === undefined || projectUpdate === null) {
      throw new Error(
        "Missing the required parameter 'projectUpdate' when calling updateProjectProjectsProjectIdPatch"
      );
    }

    let pathParams = {
      project_id: projectId,
    };
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = ['application/json'];
    let accepts = ['application/json'];
    let returnType = Project;
    return this.apiClient.callApi(
      '/projects/{project_id}',
      'PATCH',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null,
      callback
    );
  }
}
