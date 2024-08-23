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

/**
 * The ProjectCreate model module.
 * @module model/ProjectCreate
 * @version 0.1.0
 */
class ProjectCreate {
  /**
   * Constructs a new <code>ProjectCreate</code>.
   * @alias module:model/ProjectCreate
   * @param name {String}
   */
  constructor(name) {
    ProjectCreate.initialize(this, name);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, name) {
    obj['name'] = name;
  }

  /**
   * Constructs a <code>ProjectCreate</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ProjectCreate} obj Optional instance to populate.
   * @return {module:model/ProjectCreate} The populated <code>ProjectCreate</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new ProjectCreate();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('organization_id')) {
        obj['organization_id'] = ApiClient.convertToType(
          data['organization_id'],
          'String'
        );
      }
    }
    return obj;
  }

  /**
   * Validates the JSON data with respect to <code>ProjectCreate</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ProjectCreate</code>.
   */
  static validateJSON(data) {
    // check to make sure all required properties are present in the JSON string
    for (const property of ProjectCreate.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error(
          'The required field `' +
            property +
            '` is not found in the JSON data: ' +
            JSON.stringify(data)
        );
      }
    }
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
      data['organization_id'] &&
      !(
        typeof data['organization_id'] === 'string' ||
        data['organization_id'] instanceof String
      )
    ) {
      throw new Error(
        'Expected the field `organization_id` to be a primitive type in the JSON string but got ' +
          data['organization_id']
      );
    }

    return true;
  }
}

ProjectCreate.RequiredProperties = ['name'];

/**
 * @member {String} name
 */
ProjectCreate.prototype['name'] = undefined;

/**
 * @member {String} organization_id
 */
ProjectCreate.prototype['organization_id'] = undefined;

export default ProjectCreate;
