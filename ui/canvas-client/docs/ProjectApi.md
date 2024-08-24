# PlatformApi.ProjectApi

All URIs are relative to _http://localhost_

| Method                                                                                                                                                         | HTTP request                                                    | Description             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------- |
| [**createProjectPackageProjectsProjectIdPackagesPost**](ProjectApi.md#createProjectPackageProjectsProjectIdPackagesPost)                                       | **POST** /projects/{project_id}/packages/                       | Create Project Package  |
| [**deleteProjectPackageProjectsProjectIdPackagesPackageIdDelete**](ProjectApi.md#deleteProjectPackageProjectsProjectIdPackagesPackageIdDelete)                 | **DELETE** /projects/{project_id}/packages/{package_id}         | Delete Project Package  |
| [**deployProjectPackageProjectsProjectIdPackagesPackageIdDeployPost**](ProjectApi.md#deployProjectPackageProjectsProjectIdPackagesPackageIdDeployPost)         | **POST** /projects/{project_id}/packages/{package_id}/deploy    | Deploy Project Package  |
| [**destroyProjectPackageProjectsProjectIdPackagesPackageIdDestroyDelete**](ProjectApi.md#destroyProjectPackageProjectsProjectIdPackagesPackageIdDestroyDelete) | **DELETE** /projects/{project_id}/packages/{package_id}/destroy | Destroy Project Package |
| [**getProjectPackageProjectsProjectIdPackagesPackageIdGet**](ProjectApi.md#getProjectPackageProjectsProjectIdPackagesPackageIdGet)                             | **GET** /projects/{project_id}/packages/{package_id}            | Get Project Package     |
| [**listProjectPackagesProjectsProjectIdPackagesGet**](ProjectApi.md#listProjectPackagesProjectsProjectIdPackagesGet)                                           | **GET** /projects/{project_id}/packages/                        | List Project Packages   |
| [**updateProjectPackageProjectsProjectIdPackagesPackageIdPatch**](ProjectApi.md#updateProjectPackageProjectsProjectIdPackagesPackageIdPatch)                   | **PATCH** /projects/{project_id}/packages/{package_id}          | Update Project Package  |

## createProjectPackageProjectsProjectIdPackagesPost

> ProjectPackage createProjectPackageProjectsProjectIdPackagesPost(projectId, projectPackageCreate)

Create Project Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.ProjectApi();
let projectId = 'projectId_example'; // String | The ID of the project
let projectPackageCreate = new PlatformApi.ProjectPackageCreate(); // ProjectPackageCreate |
apiInstance.createProjectPackageProjectsProjectIdPackagesPost(
  projectId,
  projectPackageCreate,
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

| Name                     | Type                                                | Description           | Notes |
| ------------------------ | --------------------------------------------------- | --------------------- | ----- |
| **projectId**            | **String**                                          | The ID of the project |
| **projectPackageCreate** | [**ProjectPackageCreate**](ProjectPackageCreate.md) |                       |

### Return type

[**ProjectPackage**](ProjectPackage.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

## deleteProjectPackageProjectsProjectIdPackagesPackageIdDelete

> ProjectPackage deleteProjectPackageProjectsProjectIdPackagesPackageIdDelete(projectId, packageId)

Delete Project Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.ProjectApi();
let projectId = 'projectId_example'; // String | The ID of the project
let packageId = 'packageId_example'; // String | The ID of the package
apiInstance.deleteProjectPackageProjectsProjectIdPackagesPackageIdDelete(
  projectId,
  packageId,
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

| Name          | Type       | Description           | Notes |
| ------------- | ---------- | --------------------- | ----- |
| **projectId** | **String** | The ID of the project |
| **packageId** | **String** | The ID of the package |

### Return type

[**ProjectPackage**](ProjectPackage.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## deployProjectPackageProjectsProjectIdPackagesPackageIdDeployPost

> ProjectPackage deployProjectPackageProjectsProjectIdPackagesPackageIdDeployPost(projectId, packageId)

Deploy Project Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.ProjectApi();
let projectId = 'projectId_example'; // String | The ID of the project
let packageId = 'packageId_example'; // String | The ID of the package
apiInstance.deployProjectPackageProjectsProjectIdPackagesPackageIdDeployPost(
  projectId,
  packageId,
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

| Name          | Type       | Description           | Notes |
| ------------- | ---------- | --------------------- | ----- |
| **projectId** | **String** | The ID of the project |
| **packageId** | **String** | The ID of the package |

### Return type

[**ProjectPackage**](ProjectPackage.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## destroyProjectPackageProjectsProjectIdPackagesPackageIdDestroyDelete

> ProjectPackage destroyProjectPackageProjectsProjectIdPackagesPackageIdDestroyDelete(projectId, packageId)

Destroy Project Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.ProjectApi();
let projectId = 'projectId_example'; // String | The ID of the project
let packageId = 'packageId_example'; // String | The ID of the package
apiInstance.destroyProjectPackageProjectsProjectIdPackagesPackageIdDestroyDelete(
  projectId,
  packageId,
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

| Name          | Type       | Description           | Notes |
| ------------- | ---------- | --------------------- | ----- |
| **projectId** | **String** | The ID of the project |
| **packageId** | **String** | The ID of the package |

### Return type

[**ProjectPackage**](ProjectPackage.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## getProjectPackageProjectsProjectIdPackagesPackageIdGet

> ProjectPackage getProjectPackageProjectsProjectIdPackagesPackageIdGet(projectId, packageId)

Get Project Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.ProjectApi();
let projectId = 'projectId_example'; // String | The ID of the project
let packageId = 'packageId_example'; // String | The ID of the package
apiInstance.getProjectPackageProjectsProjectIdPackagesPackageIdGet(
  projectId,
  packageId,
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

| Name          | Type       | Description           | Notes |
| ------------- | ---------- | --------------------- | ----- |
| **projectId** | **String** | The ID of the project |
| **packageId** | **String** | The ID of the package |

### Return type

[**ProjectPackage**](ProjectPackage.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## listProjectPackagesProjectsProjectIdPackagesGet

> [ProjectPackage] listProjectPackagesProjectsProjectIdPackagesGet(projectId, opts)

List Project Packages

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.ProjectApi();
let projectId = 'projectId_example'; // String | The ID of the project
let opts = {
  skip: 0, // Number |
  limit: 100, // Number |
};
apiInstance.listProjectPackagesProjectsProjectIdPackagesGet(
  projectId,
  opts,
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

| Name          | Type       | Description           | Notes                       |
| ------------- | ---------- | --------------------- | --------------------------- |
| **projectId** | **String** | The ID of the project |
| **skip**      | **Number** |                       | [optional] [default to 0]   |
| **limit**     | **Number** |                       | [optional] [default to 100] |

### Return type

[**[ProjectPackage]**](ProjectPackage.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

## updateProjectPackageProjectsProjectIdPackagesPackageIdPatch

> ProjectPackage updateProjectPackageProjectsProjectIdPackagesPackageIdPatch(projectId, packageId, projectPackageUpdate)

Update Project Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.ProjectApi();
let projectId = 'projectId_example'; // String | The ID of the project
let packageId = 'packageId_example'; // String | The ID of the package
let projectPackageUpdate = new PlatformApi.ProjectPackageUpdate(); // ProjectPackageUpdate |
apiInstance.updateProjectPackageProjectsProjectIdPackagesPackageIdPatch(
  projectId,
  packageId,
  projectPackageUpdate,
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

| Name                     | Type                                                | Description           | Notes |
| ------------------------ | --------------------------------------------------- | --------------------- | ----- |
| **projectId**            | **String**                                          | The ID of the project |
| **packageId**            | **String**                                          | The ID of the package |
| **projectPackageUpdate** | [**ProjectPackageUpdate**](ProjectPackageUpdate.md) |                       |

### Return type

[**ProjectPackage**](ProjectPackage.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json
