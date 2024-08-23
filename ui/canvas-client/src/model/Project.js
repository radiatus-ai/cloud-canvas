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
 * The Project model module.
 * @module model/Project
 * @version 0.1.0
 */
class Project {
  /**
   * Constructs a new <code>Project</code>.
   * @alias module:model/Project
   * @param name {String}
   * @param id {String}
   * @param organizationId {String}
   */
  constructor(name, id, organizationId) {
    Project.initialize(this, name, id, organizationId);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, name, id, organizationId) {
    obj['name'] = name;
    obj['id'] = id;
    obj['organization_id'] = organizationId;
  }

  /**
   * Constructs a <code>Project</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Project} obj Optional instance to populate.
   * @return {module:model/Project} The populated <code>Project</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new Project();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'String');
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
   * Validates the JSON data with respect to <code>Project</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>Project</code>.
   */
  static validateJSON(data) {
    // check to make sure all required properties are present in the JSON string
    for (const property of Project.RequiredProperties) {
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
      data['id'] &&
      !(typeof data['id'] === 'string' || data['id'] instanceof String)
    ) {
      throw new Error(
        'Expected the field `id` to be a primitive type in the JSON string but got ' +
          data['id']
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

Project.RequiredProperties = ['name', 'id', 'organization_id'];

/**
 * @member {String} name
 */
Project.prototype['name'] = undefined;

/**
 * @member {String} id
 */
Project.prototype['id'] = undefined;

/**
 * @member {String} organization_id
 */
Project.prototype['organization_id'] = undefined;

export default Project;
