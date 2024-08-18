# PlatformApi.DefaultApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createConnectionProjectsProjectIdConnectionsPost**](DefaultApi.md#createConnectionProjectsProjectIdConnectionsPost) | **POST** /projects/{project_id}/connections/ | Create Connection
[**createPackageProjectsProjectIdPackagesPost**](DefaultApi.md#createPackageProjectsProjectIdPackagesPost) | **POST** /projects/{project_id}/packages/ | Create Package
[**createProjectProjectsPost**](DefaultApi.md#createProjectProjectsPost) | **POST** /projects/ | Create Project
[**deleteConnectionProjectsProjectIdConnectionsConnectionIdDelete**](DefaultApi.md#deleteConnectionProjectsProjectIdConnectionsConnectionIdDelete) | **DELETE** /projects/{project_id}/connections/{connection_id} | Delete Connection
[**deletePackageProjectsProjectIdPackagesPackageIdDelete**](DefaultApi.md#deletePackageProjectsProjectIdPackagesPackageIdDelete) | **DELETE** /projects/{project_id}/packages/{package_id} | Delete Package
[**deleteProjectProjectsProjectIdDelete**](DefaultApi.md#deleteProjectProjectsProjectIdDelete) | **DELETE** /projects/{project_id} | Delete Project
[**deployPackageProjectsProjectIdPackagesPackageIdDeployPost**](DefaultApi.md#deployPackageProjectsProjectIdPackagesPackageIdDeployPost) | **POST** /projects/{project_id}/packages/{package_id}/deploy | Deploy Package
[**destroyPackageProjectsProjectIdPackagesPackageIdDestroyDelete**](DefaultApi.md#destroyPackageProjectsProjectIdPackagesPackageIdDestroyDelete) | **DELETE** /projects/{project_id}/packages/{package_id}/destroy | Destroy Package
[**listAllPackagesPackagesGet**](DefaultApi.md#listAllPackagesPackagesGet) | **GET** /packages/ | List All Packages
[**listConnectionsProjectsProjectIdConnectionsGet**](DefaultApi.md#listConnectionsProjectsProjectIdConnectionsGet) | **GET** /projects/{project_id}/connections/ | List Connections
[**listPackagesProjectsProjectIdPackagesGet**](DefaultApi.md#listPackagesProjectsProjectIdPackagesGet) | **GET** /projects/{project_id}/packages/ | List Packages
[**listProjectsProjectsGet**](DefaultApi.md#listProjectsProjectsGet) | **GET** /projects/ | List Projects
[**updatePackageProjectsProjectIdPackagesPackageIdPatch**](DefaultApi.md#updatePackageProjectsProjectIdPackagesPackageIdPatch) | **PATCH** /projects/{project_id}/packages/{package_id} | Update Package
[**updateProjectProjectsProjectIdPatch**](DefaultApi.md#updateProjectProjectsProjectIdPatch) | **PATCH** /projects/{project_id} | Update Project



## createConnectionProjectsProjectIdConnectionsPost

> Connection createConnectionProjectsProjectIdConnectionsPost(projectId, connectionCreate)

Create Connection

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
let projectId = "projectId_example"; // String |
let connectionCreate = new PlatformApi.ConnectionCreate(); // ConnectionCreate |
apiInstance.createConnectionProjectsProjectIdConnectionsPost(projectId, connectionCreate, (error, data, response) => {
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
 **projectId** | **String**|  |
 **connectionCreate** | [**ConnectionCreate**](ConnectionCreate.md)|  |

### Return type

[**Connection**](Connection.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## createPackageProjectsProjectIdPackagesPost

> Package createPackageProjectsProjectIdPackagesPost(projectId, packageCreate)

Create Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
let projectId = "projectId_example"; // String |
let packageCreate = new PlatformApi.PackageCreate(); // PackageCreate |
apiInstance.createPackageProjectsProjectIdPackagesPost(projectId, packageCreate, (error, data, response) => {
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
 **projectId** | **String**|  |
 **packageCreate** | [**PackageCreate**](PackageCreate.md)|  |

### Return type

[**Package**](Package.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## createProjectProjectsPost

> Project createProjectProjectsPost(projectCreate)

Create Project

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
let projectCreate = new PlatformApi.ProjectCreate(); // ProjectCreate |
apiInstance.createProjectProjectsPost(projectCreate, (error, data, response) => {
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
 **projectCreate** | [**ProjectCreate**](ProjectCreate.md)|  |

### Return type

[**Project**](Project.md)

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
let projectId = "projectId_example"; // String |
let connectionId = "connectionId_example"; // String |
apiInstance.deleteConnectionProjectsProjectIdConnectionsConnectionIdDelete(projectId, connectionId, (error, data, response) => {
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
 **projectId** | **String**|  |
 **connectionId** | **String**|  |

### Return type

[**Connection**](Connection.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## deletePackageProjectsProjectIdPackagesPackageIdDelete

> Package deletePackageProjectsProjectIdPackagesPackageIdDelete(projectId, packageId)

Delete Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
let projectId = "projectId_example"; // String |
let packageId = "packageId_example"; // String |
apiInstance.deletePackageProjectsProjectIdPackagesPackageIdDelete(projectId, packageId, (error, data, response) => {
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
 **projectId** | **String**|  |
 **packageId** | **String**|  |

### Return type

[**Package**](Package.md)

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
let projectId = "projectId_example"; // String |
apiInstance.deleteProjectProjectsProjectIdDelete(projectId, (error, data, response) => {
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
 **projectId** | **String**|  |

### Return type

[**Project**](Project.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## deployPackageProjectsProjectIdPackagesPackageIdDeployPost

> Package deployPackageProjectsProjectIdPackagesPackageIdDeployPost(projectId, packageId, body)

Deploy Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
let projectId = "projectId_example"; // String |
let packageId = "packageId_example"; // String |
let body = {key: null}; // Object |
apiInstance.deployPackageProjectsProjectIdPackagesPackageIdDeployPost(projectId, packageId, body, (error, data, response) => {
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
 **projectId** | **String**|  |
 **packageId** | **String**|  |
 **body** | **Object**|  |

### Return type

[**Package**](Package.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## destroyPackageProjectsProjectIdPackagesPackageIdDestroyDelete

> Package destroyPackageProjectsProjectIdPackagesPackageIdDestroyDelete(projectId, packageId)

Destroy Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
let projectId = "projectId_example"; // String |
let packageId = "packageId_example"; // String |
apiInstance.destroyPackageProjectsProjectIdPackagesPackageIdDestroyDelete(projectId, packageId, (error, data, response) => {
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
 **projectId** | **String**|  |
 **packageId** | **String**|  |

### Return type

[**Package**](Package.md)

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
  'skip': 0, // Number |
  'limit': 100 // Number |
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


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **skip** | **Number**|  | [optional] [default to 0]
 **limit** | **Number**|  | [optional] [default to 100]

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
let projectId = "projectId_example"; // String |
apiInstance.listConnectionsProjectsProjectIdConnectionsGet(projectId, (error, data, response) => {
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
 **projectId** | **String**|  |

### Return type

[**[Connection]**](Connection.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## listPackagesProjectsProjectIdPackagesGet

> [Package] listPackagesProjectsProjectIdPackagesGet(projectId)

List Packages

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
let projectId = "projectId_example"; // String |
apiInstance.listPackagesProjectsProjectIdPackagesGet(projectId, (error, data, response) => {
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
 **projectId** | **String**|  |

### Return type

[**[Package]**](Package.md)

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
  'skip': 0, // Number |
  'limit': 100 // Number |
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


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **skip** | **Number**|  | [optional] [default to 0]
 **limit** | **Number**|  | [optional] [default to 100]

### Return type

[**[Project]**](Project.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## updatePackageProjectsProjectIdPackagesPackageIdPatch

> Package updatePackageProjectsProjectIdPackagesPackageIdPatch(projectId, packageId, packageUpdate)

Update Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
let projectId = "projectId_example"; // String |
let packageId = "packageId_example"; // String |
let packageUpdate = new PlatformApi.PackageUpdate(); // PackageUpdate |
apiInstance.updatePackageProjectsProjectIdPackagesPackageIdPatch(projectId, packageId, packageUpdate, (error, data, response) => {
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
 **projectId** | **String**|  |
 **packageId** | **String**|  |
 **packageUpdate** | [**PackageUpdate**](PackageUpdate.md)|  |

### Return type

[**Package**](Package.md)

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
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.DefaultApi();
let projectId = "projectId_example"; // String |
let projectUpdate = new PlatformApi.ProjectUpdate(); // ProjectUpdate |
apiInstance.updateProjectProjectsProjectIdPatch(projectId, projectUpdate, (error, data, response) => {
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
 **projectId** | **String**|  |
 **projectUpdate** | [**ProjectUpdate**](ProjectUpdate.md)|  |

### Return type

[**Project**](Project.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json
