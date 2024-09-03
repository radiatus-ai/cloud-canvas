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

import ApiClient from './ApiClient';
import AppSchemasProjectPackageProjectPackageUpdate from './model/AppSchemasProjectPackageProjectPackageUpdate';
import AppSchemasProvisionerProjectPackageProjectPackageUpdate from './model/AppSchemasProvisionerProjectPackageProjectPackageUpdate';
import Connection from './model/Connection';
import ConnectionCreate from './model/ConnectionCreate';
import Credential from './model/Credential';
import CredentialCreate from './model/CredentialCreate';
import CredentialType from './model/CredentialType';
import CredentialUpdate from './model/CredentialUpdate';
import HTTPValidationError from './model/HTTPValidationError';
import Package from './model/Package';
import PackageCreate from './model/PackageCreate';
import Project from './model/Project';
import ProjectCreate from './model/ProjectCreate';
import ProjectPackage from './model/ProjectPackage';
import ProjectPackageCreate from './model/ProjectPackageCreate';
import ProjectPackageStatus from './model/ProjectPackageStatus';
import ProjectUpdate from './model/ProjectUpdate';
import User from './model/User';
import ValidationError from './model/ValidationError';
import ValidationErrorLocInner from './model/ValidationErrorLocInner';
import AuthApi from './api/AuthApi';
import DefaultApi from './api/DefaultApi';
import MeApi from './api/MeApi';
import PackagesApi from './api/PackagesApi';
import ProjectApi from './api/ProjectApi';
import ProvisionerApi from './api/ProvisionerApi';

/**
 * JS API client generated by OpenAPI Generator.<br>
 * The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
 * <p>
 * An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
 * <pre>
 * var CanvasApi = require('index'); // See note below*.
 * var xxxSvc = new CanvasApi.XxxApi(); // Allocate the API class we're going to use.
 * var yyyModel = new CanvasApi.Yyy(); // Construct a model instance.
 * yyyModel.someProperty = 'someValue';
 * ...
 * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
 * ...
 * </pre>
 * <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
 * and put the application logic within the callback function.</em>
 * </p>
 * <p>
 * A non-AMD browser application (discouraged) might do something like this:
 * <pre>
 * var xxxSvc = new CanvasApi.XxxApi(); // Allocate the API class we're going to use.
 * var yyy = new CanvasApi.Yyy(); // Construct a model instance.
 * yyyModel.someProperty = 'someValue';
 * ...
 * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
 * ...
 * </pre>
 * </p>
 * @module index
 * @version 0.1.0
 */
export {
  /**
   * The ApiClient constructor.
   * @property {module:ApiClient}
   */
  ApiClient,

  /**
   * The AppSchemasProjectPackageProjectPackageUpdate model constructor.
   * @property {module:model/AppSchemasProjectPackageProjectPackageUpdate}
   */
  AppSchemasProjectPackageProjectPackageUpdate,

  /**
   * The AppSchemasProvisionerProjectPackageProjectPackageUpdate model constructor.
   * @property {module:model/AppSchemasProvisionerProjectPackageProjectPackageUpdate}
   */
  AppSchemasProvisionerProjectPackageProjectPackageUpdate,

  /**
   * The Connection model constructor.
   * @property {module:model/Connection}
   */
  Connection,

  /**
   * The ConnectionCreate model constructor.
   * @property {module:model/ConnectionCreate}
   */
  ConnectionCreate,

  /**
   * The Credential model constructor.
   * @property {module:model/Credential}
   */
  Credential,

  /**
   * The CredentialCreate model constructor.
   * @property {module:model/CredentialCreate}
   */
  CredentialCreate,

  /**
   * The CredentialType model constructor.
   * @property {module:model/CredentialType}
   */
  CredentialType,

  /**
   * The CredentialUpdate model constructor.
   * @property {module:model/CredentialUpdate}
   */
  CredentialUpdate,

  /**
   * The HTTPValidationError model constructor.
   * @property {module:model/HTTPValidationError}
   */
  HTTPValidationError,

  /**
   * The Package model constructor.
   * @property {module:model/Package}
   */
  Package,

  /**
   * The PackageCreate model constructor.
   * @property {module:model/PackageCreate}
   */
  PackageCreate,

  /**
   * The Project model constructor.
   * @property {module:model/Project}
   */
  Project,

  /**
   * The ProjectCreate model constructor.
   * @property {module:model/ProjectCreate}
   */
  ProjectCreate,

  /**
   * The ProjectPackage model constructor.
   * @property {module:model/ProjectPackage}
   */
  ProjectPackage,

  /**
   * The ProjectPackageCreate model constructor.
   * @property {module:model/ProjectPackageCreate}
   */
  ProjectPackageCreate,

  /**
   * The ProjectPackageStatus model constructor.
   * @property {module:model/ProjectPackageStatus}
   */
  ProjectPackageStatus,

  /**
   * The ProjectUpdate model constructor.
   * @property {module:model/ProjectUpdate}
   */
  ProjectUpdate,

  /**
   * The User model constructor.
   * @property {module:model/User}
   */
  User,

  /**
   * The ValidationError model constructor.
   * @property {module:model/ValidationError}
   */
  ValidationError,

  /**
   * The ValidationErrorLocInner model constructor.
   * @property {module:model/ValidationErrorLocInner}
   */
  ValidationErrorLocInner,

  /**
   * The AuthApi service constructor.
   * @property {module:api/AuthApi}
   */
  AuthApi,

  /**
   * The DefaultApi service constructor.
   * @property {module:api/DefaultApi}
   */
  DefaultApi,

  /**
   * The MeApi service constructor.
   * @property {module:api/MeApi}
   */
  MeApi,

  /**
   * The PackagesApi service constructor.
   * @property {module:api/PackagesApi}
   */
  PackagesApi,

  /**
   * The ProjectApi service constructor.
   * @property {module:api/ProjectApi}
   */
  ProjectApi,

  /**
   * The ProvisionerApi service constructor.
   * @property {module:api/ProvisionerApi}
   */
  ProvisionerApi,
};
