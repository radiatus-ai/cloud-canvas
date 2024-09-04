# CanvasApi.AuthApi

All URIs are relative to _http://localhost_

| Method                                                              | HTTP request         | Description  |
| ------------------------------------------------------------------- | -------------------- | ------------ |
| [**loginGoogleAuthLoginPost**](AuthApi.md#loginGoogleAuthLoginPost) | **POST** /auth/login | Login Google |

## loginGoogleAuthLoginPost

> Object loginGoogleAuthLoginPost(body)

Login Google

### Example

```javascript
import CanvasApi from 'canvas_api';

let apiInstance = new CanvasApi.AuthApi();
let body = { key: null }; // Object |
apiInstance.loginGoogleAuthLoginPost(body, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

| Name     | Type       | Description | Notes |
| -------- | ---------- | ----------- | ----- |
| **body** | **Object** |             |

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json
