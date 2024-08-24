# PlatformApi.PackagesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createProjectPackageProjectsProjectIdPackagesPost**](PackagesApi.md#createProjectPackageProjectsProjectIdPackagesPost) | **POST** /projects/{project_id}/packages/ | Create Project Package
[**deleteProjectPackageProjectsProjectIdPackagesPackageIdDelete**](PackagesApi.md#deleteProjectPackageProjectsProjectIdPackagesPackageIdDelete) | **DELETE** /projects/{project_id}/packages/{package_id} | Delete Project Package
[**deployProjectPackageProjectsProjectIdPackagesPackageIdDeployPost**](PackagesApi.md#deployProjectPackageProjectsProjectIdPackagesPackageIdDeployPost) | **POST** /projects/{project_id}/packages/{package_id}/deploy | Deploy Project Package
[**destroyProjectPackageProjectsProjectIdPackagesPackageIdDestroyDelete**](PackagesApi.md#destroyProjectPackageProjectsProjectIdPackagesPackageIdDestroyDelete) | **DELETE** /projects/{project_id}/packages/{package_id}/destroy | Destroy Project Package
[**getProjectPackageProjectsProjectIdPackagesPackageIdGet**](PackagesApi.md#getProjectPackageProjectsProjectIdPackagesPackageIdGet) | **GET** /projects/{project_id}/packages/{package_id} | Get Project Package
[**listProjectPackagesProjectsProjectIdPackagesGet**](PackagesApi.md#listProjectPackagesProjectsProjectIdPackagesGet) | **GET** /projects/{project_id}/packages/ | List Project Packages
[**updateProjectPackageProjectsProjectIdPackagesPackageIdPatch**](PackagesApi.md#updateProjectPackageProjectsProjectIdPackagesPackageIdPatch) | **PATCH** /projects/{project_id}/packages/{package_id} | Update Project Package



## createProjectPackageProjectsProjectIdPackagesPost

> Package createProjectPackageProjectsProjectIdPackagesPost(projectId, packageCreate)

Create Project Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.PackagesApi();
let projectId = "projectId_example"; // String | The ID of the project
let packageCreate = new PlatformApi.PackageCreate(); // PackageCreate |
apiInstance.createProjectPackageProjectsProjectIdPackagesPost(projectId, packageCreate, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| The ID of the project |
 **packageCreate** | [**PackageCreate**](PackageCreate.md)|  |

### Return type

[**Package**](Package.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## deleteProjectPackageProjectsProjectIdPackagesPackageIdDelete

> Package deleteProjectPackageProjectsProjectIdPackagesPackageIdDelete(projectId, packageId)

Delete Project Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.PackagesApi();
let projectId = "projectId_example"; // String | The ID of the project
let packageId = "packageId_example"; // String | The ID of the package
apiInstance.deleteProjectPackageProjectsProjectIdPackagesPackageIdDelete(projectId, packageId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| The ID of the project |
 **packageId** | **String**| The ID of the package |

### Return type

[**Package**](Package.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## deployProjectPackageProjectsProjectIdPackagesPackageIdDeployPost

> Package deployProjectPackageProjectsProjectIdPackagesPackageIdDeployPost(projectId, packageId)

Deploy Project Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.PackagesApi();
let projectId = "projectId_example"; // String | The ID of the project
let packageId = "packageId_example"; // String | The ID of the package
apiInstance.deployProjectPackageProjectsProjectIdPackagesPackageIdDeployPost(projectId, packageId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| The ID of the project |
 **packageId** | **String**| The ID of the package |

### Return type

[**Package**](Package.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## destroyProjectPackageProjectsProjectIdPackagesPackageIdDestroyDelete

> Package destroyProjectPackageProjectsProjectIdPackagesPackageIdDestroyDelete(projectId, packageId)

Destroy Project Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.PackagesApi();
let projectId = "projectId_example"; // String | The ID of the project
let packageId = "packageId_example"; // String | The ID of the package
apiInstance.destroyProjectPackageProjectsProjectIdPackagesPackageIdDestroyDelete(projectId, packageId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| The ID of the project |
 **packageId** | **String**| The ID of the package |

### Return type

[**Package**](Package.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getProjectPackageProjectsProjectIdPackagesPackageIdGet

> Package getProjectPackageProjectsProjectIdPackagesPackageIdGet(projectId, packageId)

Get Project Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.PackagesApi();
let projectId = "projectId_example"; // String | The ID of the project
let packageId = "packageId_example"; // String | The ID of the package
apiInstance.getProjectPackageProjectsProjectIdPackagesPackageIdGet(projectId, packageId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| The ID of the project |
 **packageId** | **String**| The ID of the package |

### Return type

[**Package**](Package.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## listProjectPackagesProjectsProjectIdPackagesGet

> [Package] listProjectPackagesProjectsProjectIdPackagesGet(projectId, opts)

List Project Packages

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.PackagesApi();
let projectId = "projectId_example"; // String | The ID of the project
let opts = {
  'skip': 0, // Number |
  'limit': 100 // Number |
};
apiInstance.listProjectPackagesProjectsProjectIdPackagesGet(projectId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| The ID of the project |
 **skip** | **Number**|  | [optional] [default to 0]
 **limit** | **Number**|  | [optional] [default to 100]

### Return type

[**[Package]**](Package.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## updateProjectPackageProjectsProjectIdPackagesPackageIdPatch

> Package updateProjectPackageProjectsProjectIdPackagesPackageIdPatch(projectId, packageId, packageUpdate)

Update Project Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.PackagesApi();
let projectId = "projectId_example"; // String | The ID of the project
let packageId = "packageId_example"; // String | The ID of the package
let packageUpdate = new PlatformApi.PackageUpdate(); // PackageUpdate |
apiInstance.updateProjectPackageProjectsProjectIdPackagesPackageIdPatch(projectId, packageId, packageUpdate, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| The ID of the project |
 **packageId** | **String**| The ID of the package |
 **packageUpdate** | [**PackageUpdate**](PackageUpdate.md)|  |

### Return type

[**Package**](Package.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json
