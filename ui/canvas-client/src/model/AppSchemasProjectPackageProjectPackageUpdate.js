/**
 * Platform API
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
import DeployStatus from './DeployStatus';

/**
 * The AppSchemasProjectPackageProjectPackageUpdate model module.
 * @module model/AppSchemasProjectPackageProjectPackageUpdate
 * @version 0.1.0
 */
class AppSchemasProjectPackageProjectPackageUpdate {
  /**
   * Constructs a new <code>AppSchemasProjectPackageProjectPackageUpdate</code>.
   * @alias module:model/AppSchemasProjectPackageProjectPackageUpdate
   */
  constructor() {
    AppSchemasProjectPackageProjectPackageUpdate.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {}

  /**
   * Constructs a <code>AppSchemasProjectPackageProjectPackageUpdate</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AppSchemasProjectPackageProjectPackageUpdate} obj Optional instance to populate.
   * @return {module:model/AppSchemasProjectPackageProjectPackageUpdate} The populated <code>AppSchemasProjectPackageProjectPackageUpdate</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new AppSchemasProjectPackageProjectPackageUpdate();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('type')) {
        obj['type'] = ApiClient.convertToType(data['type'], 'String');
      }
      if (data.hasOwnProperty('inputs')) {
        obj['inputs'] = ApiClient.convertToType(data['inputs'], Object);
      }
      if (data.hasOwnProperty('outputs')) {
        obj['outputs'] = ApiClient.convertToType(data['outputs'], Object);
      }
      if (data.hasOwnProperty('parameters')) {
        obj['parameters'] = ApiClient.convertToType(data['parameters'], Object);
      }
      if (data.hasOwnProperty('deploy_status')) {
        obj['deploy_status'] = DeployStatus.constructFromObject(
          data['deploy_status']
        );
      }
      if (data.hasOwnProperty('output_data')) {
        obj['output_data'] = ApiClient.convertToType(
          data['output_data'],
          Object
        );
      }
      if (data.hasOwnProperty('parameter_data')) {
        obj['parameter_data'] = ApiClient.convertToType(
          data['parameter_data'],
          Object
        );
      }
    }
    return obj;
  }

  /**
   * Validates the JSON data with respect to <code>AppSchemasProjectPackageProjectPackageUpdate</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AppSchemasProjectPackageProjectPackageUpdate</code>.
   */
  static validateJSON(data) {
    // ensure the json data is a string
    if (
      data['name'] &&
      !(typeof data['name'] === 'string' || data['name'] instanceof String)
    ) {
      throw new Error(
        'Expected the field `name` to be a primitive type in the JSON string but got ' +
          data['name']
      );
    }
    // ensure the json data is a string
    if (
      data['type'] &&
      !(typeof data['type'] === 'string' || data['type'] instanceof String)
    ) {
      throw new Error(
        'Expected the field `type` to be a primitive type in the JSON string but got ' +
          data['type']
      );
    }

    return true;
  }
}

/**
 * @member {String} name
 */
AppSchemasProjectPackageProjectPackageUpdate.prototype['name'] = undefined;

/**
 * @member {String} type
 */
AppSchemasProjectPackageProjectPackageUpdate.prototype['type'] = undefined;

/**
 * @member {Object} inputs
 */
AppSchemasProjectPackageProjectPackageUpdate.prototype['inputs'] = undefined;

/**
 * @member {Object} outputs
 */
AppSchemasProjectPackageProjectPackageUpdate.prototype['outputs'] = undefined;

/**
 * @member {Object} parameters
 */
AppSchemasProjectPackageProjectPackageUpdate.prototype['parameters'] =
  undefined;

/**
 * @member {module:model/DeployStatus} deploy_status
 */
AppSchemasProjectPackageProjectPackageUpdate.prototype['deploy_status'] =
  undefined;

/**
 * @member {Object} output_data
 */
AppSchemasProjectPackageProjectPackageUpdate.prototype['output_data'] =
  undefined;

/**
 * @member {Object} parameter_data
 */
AppSchemasProjectPackageProjectPackageUpdate.prototype['parameter_data'] =
  undefined;

export default AppSchemasProjectPackageProjectPackageUpdate;
