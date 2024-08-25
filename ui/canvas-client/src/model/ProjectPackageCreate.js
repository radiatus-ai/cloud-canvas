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
 * The ProjectPackageCreate model module.
 * @module model/ProjectPackageCreate
 * @version 0.1.0
 */
class ProjectPackageCreate {
  /**
   * Constructs a new <code>ProjectPackageCreate</code>.
   * @alias module:model/ProjectPackageCreate
   * @param name {String}
   * @param type {String}
   * @param inputs {Object}
   * @param outputs {Object}
   * @param parameters {Object}
   * @param projectId {String}
   */
  constructor(name, type, inputs, outputs, parameters, projectId) {
    ProjectPackageCreate.initialize(
      this,
      name,
      type,
      inputs,
      outputs,
      parameters,
      projectId
    );
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, name, type, inputs, outputs, parameters, projectId) {
    obj['name'] = name;
    obj['type'] = type;
    obj['inputs'] = inputs;
    obj['outputs'] = outputs;
    obj['parameters'] = parameters;
    obj['project_id'] = projectId;
  }

  /**
   * Constructs a <code>ProjectPackageCreate</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ProjectPackageCreate} obj Optional instance to populate.
   * @return {module:model/ProjectPackageCreate} The populated <code>ProjectPackageCreate</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new ProjectPackageCreate();

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
      if (data.hasOwnProperty('project_id')) {
        obj['project_id'] = ApiClient.convertToType(
          data['project_id'],
          'String'
        );
      }
    }
    return obj;
  }

  /**
   * Validates the JSON data with respect to <code>ProjectPackageCreate</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ProjectPackageCreate</code>.
   */
  static validateJSON(data) {
    // check to make sure all required properties are present in the JSON string
    for (const property of ProjectPackageCreate.RequiredProperties) {
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
      data['type'] &&
      !(typeof data['type'] === 'string' || data['type'] instanceof String)
    ) {
      throw new Error(
        'Expected the field `type` to be a primitive type in the JSON string but got ' +
          data['type']
      );
    }
    // ensure the json data is a string
    if (
      data['project_id'] &&
      !(
        typeof data['project_id'] === 'string' ||
        data['project_id'] instanceof String
      )
    ) {
      throw new Error(
        'Expected the field `project_id` to be a primitive type in the JSON string but got ' +
          data['project_id']
      );
    }

    return true;
  }
}

ProjectPackageCreate.RequiredProperties = [
  'name',
  'type',
  'inputs',
  'outputs',
  'parameters',
  'project_id',
];

/**
 * @member {String} name
 */
ProjectPackageCreate.prototype['name'] = undefined;

/**
 * @member {String} type
 */
ProjectPackageCreate.prototype['type'] = undefined;

/**
 * @member {Object} inputs
 */
ProjectPackageCreate.prototype['inputs'] = undefined;

/**
 * @member {Object} outputs
 */
ProjectPackageCreate.prototype['outputs'] = undefined;

/**
 * @member {Object} parameters
 */
ProjectPackageCreate.prototype['parameters'] = undefined;

/**
 * @member {String} project_id
 */
ProjectPackageCreate.prototype['project_id'] = undefined;

export default ProjectPackageCreate;