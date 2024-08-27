# PlatformApi.ProvisionerApi

All URIs are relative to _http://localhost_

| Method                                                                                                                                                                 | HTTP request                                                       | Description            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------- |
| [**updateProjectPackageProvisionerProjectsProjectIdPackagesPackageIdPatch**](ProvisionerApi.md#updateProjectPackageProvisionerProjectsProjectIdPackagesPackageIdPatch) | **PATCH** /provisioner/projects/{project_id}/packages/{package_id} | Update Project Package |

## updateProjectPackageProvisionerProjectsProjectIdPackagesPackageIdPatch

> ProjectPackage updateProjectPackageProvisionerProjectsProjectIdPackagesPackageIdPatch(projectId, packageId, xCanvasToken, projectPackageUpdate)

Update Project Package

### Example

```javascript
import PlatformApi from 'platform_api';

let apiInstance = new PlatformApi.ProvisionerApi();
let projectId = 'projectId_example'; // String | The ID of the project
let packageId = 'packageId_example'; // String | The ID of the package
let xCanvasToken = 'xCanvasToken_example'; // String |
let projectPackageUpdate = new PlatformApi.ProjectPackageUpdate(); // ProjectPackageUpdate |
apiInstance.updateProjectPackageProvisionerProjectsProjectIdPackagesPackageIdPatch(
  projectId,
  packageId,
  xCanvasToken,
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
| **xCanvasToken**         | **String**                                          |                       |
| **projectPackageUpdate** | [**ProjectPackageUpdate**](ProjectPackageUpdate.md) |                       |

### Return type

[**ProjectPackage**](ProjectPackage.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json
