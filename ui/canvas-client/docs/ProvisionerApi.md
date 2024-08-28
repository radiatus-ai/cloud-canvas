# CanvasApi.ProvisionerApi

All URIs are relative to _http://localhost_

| Method                                                                                                                                                                 | HTTP request                                                       | Description            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------- |
| [**updateProjectPackageProvisionerProjectsProjectIdPackagesPackageIdPatch**](ProvisionerApi.md#updateProjectPackageProvisionerProjectsProjectIdPackagesPackageIdPatch) | **PATCH** /provisioner/projects/{project_id}/packages/{package_id} | Update Project Package |

## updateProjectPackageProvisionerProjectsProjectIdPackagesPackageIdPatch

> Object updateProjectPackageProvisionerProjectsProjectIdPackagesPackageIdPatch(projectId, packageId, xCanvasToken, appSchemasProvisionerProjectPackageProjectPackageUpdate)

Update Project Package

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.ProvisionerApi();
let projectId = 'projectId_example'; // String | The ID of the project
let packageId = 'packageId_example'; // String | The ID of the package
let xCanvasToken = 'xCanvasToken_example'; // String |
let appSchemasProvisionerProjectPackageProjectPackageUpdate =
  new CanvasApi.AppSchemasProvisionerProjectPackageProjectPackageUpdate(); // AppSchemasProvisionerProjectPackageProjectPackageUpdate |
apiInstance.updateProjectPackageProvisionerProjectsProjectIdPackagesPackageIdPatch(
  projectId,
  packageId,
  xCanvasToken,
  appSchemasProvisionerProjectPackageProjectPackageUpdate,
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

| Name                                                        | Type                                                                                                                      | Description           | Notes |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----- |
| **projectId**                                               | **String**                                                                                                                | The ID of the project |
| **packageId**                                               | **String**                                                                                                                | The ID of the package |
| **xCanvasToken**                                            | **String**                                                                                                                |                       |
| **appSchemasProvisionerProjectPackageProjectPackageUpdate** | [**AppSchemasProvisionerProjectPackageProjectPackageUpdate**](AppSchemasProvisionerProjectPackageProjectPackageUpdate.md) |                       |

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json
