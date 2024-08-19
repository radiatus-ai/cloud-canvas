# PlatformApi.DefaultApi

All URIs are relative to _http://localhost_

| Method                                                                                                                                             | HTTP request                                                  | Description           |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------- |
| [**createConnectionProjectsProjectIdConnectionsPost**](DefaultApi.md#createConnectionProjectsProjectIdConnectionsPost)                             | **POST** /projects/{project_id}/connections/                  | Create Connection     |
| [**createGlobalPackagePackagesPost**](DefaultApi.md#createGlobalPackagePackagesPost)                                                               | **POST** /packages                                            | Create Global Package |
| [**createProjectProjectsPost**](DefaultApi.md#createProjectProjectsPost)                                                                           | **POST** /projects/                                           | Create Project        |
| [**deleteConnectionProjectsProjectIdConnectionsConnectionIdDelete**](DefaultApi.md#deleteConnectionProjectsProjectIdConnectionsConnectionIdDelete) | **DELETE** /projects/{project_id}/connections/{connection_id} | Delete Connection     |
| [**deleteProjectProjectsProjectIdDelete**](DefaultApi.md#deleteProjectProjectsProjectIdDelete)                                                     | **DELETE** /projects/{project_id}                             | Delete Project        |
| [**listAllPackagesPackagesGet**](DefaultApi.md#listAllPackagesPackagesGet)                                                                         | **GET** /packages                                             | List All Packages     |
| [**listConnectionsProjectsProjectIdConnectionsGet**](DefaultApi.md#listConnectionsProjectsProjectIdConnectionsGet)                                 | **GET** /projects/{project_id}/connections/                   | List Connections      |
| [**listProjectsProjectsGet**](DefaultApi.md#listProjectsProjectsGet)                                                                               | **GET** /projects/                                            | List Projects         |
| [**updateProjectProjectsProjectIdPatch**](DefaultApi.md#updateProjectProjectsProjectIdPatch)                                                       | **PATCH** /projects/{project_id}                              | Update Project        |

## createConnectionProjectsProjectIdConnectionsPost

> Connection createConnectionProjectsProjectIdConnectionsPost(projectId, connectionCreate)

Create Connection

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
let projectId = 'projectId_example'; // String |
let connectionCreate = new PlatformApi.ConnectionCreate(); // ConnectionCreate |
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

## createGlobalPackagePackagesPost

> Package createGlobalPackagePackagesPost(packageCreate)

Create Global Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
let packageCreate = new PlatformApi.PackageCreate(); // PackageCreate |
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

## createProjectProjectsPost

> Object createProjectProjectsPost(projectCreate)

Create Project

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
let projectCreate = new PlatformApi.ProjectCreate(); // ProjectCreate |
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

## deleteConnectionProjectsProjectIdConnectionsConnectionIdDelete

> Connection deleteConnectionProjectsProjectIdConnectionsConnectionIdDelete(projectId, connectionId)

Delete Connection

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
let projectId = 'projectId_example'; // String |
let connectionId = 'connectionId_example'; // String |
apiInstance.deleteConnectionProjectsProjectIdConnectionsConnectionIdDelete(
  projectId,
  connectionId,
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
| **projectId**    | **String** |             |
| **connectionId** | **String** |             |

### Return type

[**Connection**](Connection.md)

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
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
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

## listAllPackagesPackagesGet

> [Package] listAllPackagesPackagesGet(opts)

List All Packages

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
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
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
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

## listProjectsProjectsGet

> [Project] listProjectsProjectsGet(opts)

List Projects

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
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

## updateProjectProjectsProjectIdPatch

> Project updateProjectProjectsProjectIdPatch(projectId, projectUpdate)

Update Project

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
let projectId = 'projectId_example'; // String |
let projectUpdate = new PlatformApi.ProjectUpdate(); // ProjectUpdate |
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
