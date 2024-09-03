# CanvasApi.DefaultApi

All URIs are relative to _http://localhost_

| Method                                                                                                                                                           | HTTP request                                                              | Description                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------- |
| [**createConnectionProjectsProjectIdConnectionsPost**](DefaultApi.md#createConnectionProjectsProjectIdConnectionsPost)                                           | **POST** /projects/{project_id}/connections/                              | Create Connection               |
| [**createCredentialCredentialsPost**](DefaultApi.md#createCredentialCredentialsPost)                                                                             | **POST** /credentials/                                                    | Create Credential               |
| [**createGlobalPackagePackagesPost**](DefaultApi.md#createGlobalPackagePackagesPost)                                                                             | **POST** /packages                                                        | Create Global Package           |
| [**createOrUpdateGlobalPackagePackagesCreateOrUpdatePost**](DefaultApi.md#createOrUpdateGlobalPackagePackagesCreateOrUpdatePost)                                 | **POST** /packages/create-or-update                                       | Create Or Update Global Package |
| [**createProjectProjectsPost**](DefaultApi.md#createProjectProjectsPost)                                                                                         | **POST** /projects/                                                       | Create Project                  |
| [**deleteConnectionProjectsProjectIdSourcePackageIdTargetPackageIdDelete**](DefaultApi.md#deleteConnectionProjectsProjectIdSourcePackageIdTargetPackageIdDelete) | **DELETE** /projects/{project_id}/{source_package_id}/{target_package_id} | Delete Connection               |
| [**deleteCredentialCredentialsCredentialIdDelete**](DefaultApi.md#deleteCredentialCredentialsCredentialIdDelete)                                                 | **DELETE** /credentials/{credential_id}                                   | Delete Credential               |
| [**deleteProjectProjectsProjectIdDelete**](DefaultApi.md#deleteProjectProjectsProjectIdDelete)                                                                   | **DELETE** /projects/{project_id}                                         | Delete Project                  |
| [**getCredentialCredentialsCredentialIdGet**](DefaultApi.md#getCredentialCredentialsCredentialIdGet)                                                             | **GET** /credentials/{credential_id}                                      | Get Credential                  |
| [**getProjectProjectsProjectIdGet**](DefaultApi.md#getProjectProjectsProjectIdGet)                                                                               | **GET** /projects/{project_id}                                            | Get Project                     |
| [**listAllPackagesPackagesGet**](DefaultApi.md#listAllPackagesPackagesGet)                                                                                       | **GET** /packages                                                         | List All Packages               |
| [**listConnectionsProjectsProjectIdConnectionsGet**](DefaultApi.md#listConnectionsProjectsProjectIdConnectionsGet)                                               | **GET** /projects/{project_id}/connections/                               | List Connections                |
| [**listCredentialsCredentialsGet**](DefaultApi.md#listCredentialsCredentialsGet)                                                                                 | **GET** /credentials/                                                     | List Credentials                |
| [**listProjectsProjectsGet**](DefaultApi.md#listProjectsProjectsGet)                                                                                             | **GET** /projects/                                                        | List Projects                   |
| [**rootGet**](DefaultApi.md#rootGet)                                                                                                                             | **GET** /                                                                 | Root                            |
| [**updateCredentialCredentialsCredentialIdPatch**](DefaultApi.md#updateCredentialCredentialsCredentialIdPatch)                                                   | **PATCH** /credentials/{credential_id}                                    | Update Credential               |
| [**updateProjectProjectsProjectIdPatch**](DefaultApi.md#updateProjectProjectsProjectIdPatch)                                                                     | **PATCH** /projects/{project_id}                                          | Update Project                  |

## createConnectionProjectsProjectIdConnectionsPost

> Connection createConnectionProjectsProjectIdConnectionsPost(projectId, connectionCreate)

Create Connection

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let projectId = 'projectId_example'; // String |
let connectionCreate = new CanvasApi.ConnectionCreate(); // ConnectionCreate |
apiInstance.createConnectionProjectsProjectIdConnectionsPost(
  projectId,
  connectionCreate,
  (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  }
);
```

### Parameters

| Name                 | Type                                        | Description | Notes |
| -------------------- | ------------------------------------------- | ----------- | ----- |
| **projectId**        | **String**                                  |             |
| **connectionCreate** | [**ConnectionCreate**](ConnectionCreate.md) |             |

### Return type

[**Connection**](Connection.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

## createCredentialCredentialsPost

> Credential createCredentialCredentialsPost(credentialCreate)

Create Credential

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let credentialCreate = new CanvasApi.CredentialCreate(); // CredentialCreate |
apiInstance.createCredentialCredentialsPost(
  credentialCreate,
  (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  }
);
```

### Parameters

| Name                 | Type                                        | Description | Notes |
| -------------------- | ------------------------------------------- | ----------- | ----- |
| **credentialCreate** | [**CredentialCreate**](CredentialCreate.md) |             |

### Return type

[**Credential**](Credential.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

## createGlobalPackagePackagesPost

> Package createGlobalPackagePackagesPost(packageCreate)

Create Global Package

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let packageCreate = new CanvasApi.PackageCreate(); // PackageCreate |
apiInstance.createGlobalPackagePackagesPost(
  packageCreate,
  (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  }
);
```

### Parameters

| Name              | Type                                  | Description | Notes |
| ----------------- | ------------------------------------- | ----------- | ----- |
| **packageCreate** | [**PackageCreate**](PackageCreate.md) |             |

### Return type

[**Package**](Package.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

## createOrUpdateGlobalPackagePackagesCreateOrUpdatePost

> Package createOrUpdateGlobalPackagePackagesCreateOrUpdatePost(packageCreate)

Create Or Update Global Package

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let packageCreate = new CanvasApi.PackageCreate(); // PackageCreate |
apiInstance.createOrUpdateGlobalPackagePackagesCreateOrUpdatePost(
  packageCreate,
  (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  }
);
```

### Parameters

| Name              | Type                                  | Description | Notes |
| ----------------- | ------------------------------------- | ----------- | ----- |
| **packageCreate** | [**PackageCreate**](PackageCreate.md) |             |

### Return type

[**Package**](Package.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

## createProjectProjectsPost

> Object createProjectProjectsPost(projectCreate)

Create Project

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let projectCreate = new CanvasApi.ProjectCreate(); // ProjectCreate |
apiInstance.createProjectProjectsPost(
  projectCreate,
  (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  }
);
```

### Parameters

| Name              | Type                                  | Description | Notes |
| ----------------- | ------------------------------------- | ----------- | ----- |
| **projectCreate** | [**ProjectCreate**](ProjectCreate.md) |             |

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

## deleteConnectionProjectsProjectIdSourcePackageIdTargetPackageIdDelete

> Connection deleteConnectionProjectsProjectIdSourcePackageIdTargetPackageIdDelete(projectId, sourcePackageId, targetPackageId)

Delete Connection

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let projectId = 'projectId_example'; // String |
let sourcePackageId = 'sourcePackageId_example'; // String |
let targetPackageId = 'targetPackageId_example'; // String |
apiInstance.deleteConnectionProjectsProjectIdSourcePackageIdTargetPackageIdDelete(
  projectId,
  sourcePackageId,
  targetPackageId,
  (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  }
);
```

### Parameters

| Name                | Type       | Description | Notes |
| ------------------- | ---------- | ----------- | ----- |
| **projectId**       | **String** |             |
| **sourcePackageId** | **String** |             |
| **targetPackageId** | **String** |             |

### Return type

[**Connection**](Connection.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## deleteCredentialCredentialsCredentialIdDelete

> Credential deleteCredentialCredentialsCredentialIdDelete(credentialId)

Delete Credential

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let credentialId = 'credentialId_example'; // String |
apiInstance.deleteCredentialCredentialsCredentialIdDelete(
  credentialId,
  (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  }
);
```

### Parameters

| Name             | Type       | Description | Notes |
| ---------------- | ---------- | ----------- | ----- |
| **credentialId** | **String** |             |

### Return type

[**Credential**](Credential.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## deleteProjectProjectsProjectIdDelete

> Project deleteProjectProjectsProjectIdDelete(projectId)

Delete Project

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let projectId = 'projectId_example'; // String |
apiInstance.deleteProjectProjectsProjectIdDelete(
  projectId,
  (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  }
);
```

### Parameters

| Name          | Type       | Description | Notes |
| ------------- | ---------- | ----------- | ----- |
| **projectId** | **String** |             |

### Return type

[**Project**](Project.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## getCredentialCredentialsCredentialIdGet

> Credential getCredentialCredentialsCredentialIdGet(credentialId)

Get Credential

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let credentialId = 'credentialId_example'; // String |
apiInstance.getCredentialCredentialsCredentialIdGet(
  credentialId,
  (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  }
);
```

### Parameters

| Name             | Type       | Description | Notes |
| ---------------- | ---------- | ----------- | ----- |
| **credentialId** | **String** |             |

### Return type

[**Credential**](Credential.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## getProjectProjectsProjectIdGet

> Project getProjectProjectsProjectIdGet(projectId)

Get Project

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let projectId = 'projectId_example'; // String |
apiInstance.getProjectProjectsProjectIdGet(
  projectId,
  (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  }
);
```

### Parameters

| Name          | Type       | Description | Notes |
| ------------- | ---------- | ----------- | ----- |
| **projectId** | **String** |             |

### Return type

[**Project**](Project.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## listAllPackagesPackagesGet

> [Package] listAllPackagesPackagesGet(opts)

List All Packages

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let opts = {
  skip: 0, // Number |
  limit: 100, // Number |
};
apiInstance.listAllPackagesPackagesGet(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

| Name      | Type       | Description | Notes                       |
| --------- | ---------- | ----------- | --------------------------- |
| **skip**  | **Number** |             | [optional] [default to 0]   |
| **limit** | **Number** |             | [optional] [default to 100] |

### Return type

[**[Package]**](Package.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## listConnectionsProjectsProjectIdConnectionsGet

> [Connection] listConnectionsProjectsProjectIdConnectionsGet(projectId)

List Connections

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let projectId = 'projectId_example'; // String |
apiInstance.listConnectionsProjectsProjectIdConnectionsGet(
  projectId,
  (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  }
);
```

### Parameters

| Name          | Type       | Description | Notes |
| ------------- | ---------- | ----------- | ----- |
| **projectId** | **String** |             |

### Return type

[**[Connection]**](Connection.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## listCredentialsCredentialsGet

> [Credential] listCredentialsCredentialsGet(opts)

List Credentials

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let opts = {
  skip: 0, // Number |
  limit: 100, // Number |
};
apiInstance.listCredentialsCredentialsGet(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

| Name      | Type       | Description | Notes                       |
| --------- | ---------- | ----------- | --------------------------- |
| **skip**  | **Number** |             | [optional] [default to 0]   |
| **limit** | **Number** |             | [optional] [default to 100] |

### Return type

[**[Credential]**](Credential.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## listProjectsProjectsGet

> [Project] listProjectsProjectsGet(opts)

List Projects

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let opts = {
  skip: 0, // Number |
  limit: 100, // Number |
};
apiInstance.listProjectsProjectsGet(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

| Name      | Type       | Description | Notes                       |
| --------- | ---------- | ----------- | --------------------------- |
| **skip**  | **Number** |             | [optional] [default to 0]   |
| **limit** | **Number** |             | [optional] [default to 100] |

### Return type

[**[Project]**](Project.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## rootGet

> Object rootGet()

Root

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
apiInstance.rootGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## updateCredentialCredentialsCredentialIdPatch

> Credential updateCredentialCredentialsCredentialIdPatch(credentialId, credentialUpdate)

Update Credential

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let credentialId = 'credentialId_example'; // String |
let credentialUpdate = new CanvasApi.CredentialUpdate(); // CredentialUpdate |
apiInstance.updateCredentialCredentialsCredentialIdPatch(
  credentialId,
  credentialUpdate,
  (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  }
);
```

### Parameters

| Name                 | Type                                        | Description | Notes |
| -------------------- | ------------------------------------------- | ----------- | ----- |
| **credentialId**     | **String**                                  |             |
| **credentialUpdate** | [**CredentialUpdate**](CredentialUpdate.md) |             |

### Return type

[**Credential**](Credential.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

## updateProjectProjectsProjectIdPatch

> Project updateProjectProjectsProjectIdPatch(projectId, projectUpdate)

Update Project

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.DefaultApi();
let projectId = 'projectId_example'; // String |
let projectUpdate = new CanvasApi.ProjectUpdate(); // ProjectUpdate |
apiInstance.updateProjectProjectsProjectIdPatch(
  projectId,
  projectUpdate,
  (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  }
);
```

### Parameters

| Name              | Type                                  | Description | Notes |
| ----------------- | ------------------------------------- | ----------- | ----- |
| **projectId**     | **String**                            |             |
| **projectUpdate** | [**ProjectUpdate**](ProjectUpdate.md) |             |

### Return type

[**Project**](Project.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json
