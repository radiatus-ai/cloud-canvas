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
 * The ConnectionCreate model module.
 * @module model/ConnectionCreate
 * @version 0.1.0
 */
class ConnectionCreate {
    /**
     * Constructs a new <code>ConnectionCreate</code>.
     * @alias module:model/ConnectionCreate
     * @param sourcePackageId {String}
     * @param targetPackageId {String}
     * @param sourceHandle {String}
     * @param targetHandle {String}
     * @param projectId {String}
     */
    constructor(sourcePackageId, targetPackageId, sourceHandle, targetHandle, projectId) {

        ConnectionCreate.initialize(this, sourcePackageId, targetPackageId, sourceHandle, targetHandle, projectId);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, sourcePackageId, targetPackageId, sourceHandle, targetHandle, projectId) {
        obj['source_package_id'] = sourcePackageId;
        obj['target_package_id'] = targetPackageId;
        obj['source_handle'] = sourceHandle;
        obj['target_handle'] = targetHandle;
        obj['project_id'] = projectId;
    }

    /**
     * Constructs a <code>ConnectionCreate</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ConnectionCreate} obj Optional instance to populate.
     * @return {module:model/ConnectionCreate} The populated <code>ConnectionCreate</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ConnectionCreate();

            if (data.hasOwnProperty('source_package_id')) {
                obj['source_package_id'] = ApiClient.convertToType(data['source_package_id'], 'String');
            }
            if (data.hasOwnProperty('target_package_id')) {
                obj['target_package_id'] = ApiClient.convertToType(data['target_package_id'], 'String');
            }
            if (data.hasOwnProperty('source_handle')) {
                obj['source_handle'] = ApiClient.convertToType(data['source_handle'], 'String');
            }
            if (data.hasOwnProperty('target_handle')) {
                obj['target_handle'] = ApiClient.convertToType(data['target_handle'], 'String');
            }
            if (data.hasOwnProperty('project_id')) {
                obj['project_id'] = ApiClient.convertToType(data['project_id'], 'String');
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>ConnectionCreate</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ConnectionCreate</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of ConnectionCreate.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }
        // ensure the json data is a string
        if (data['source_package_id'] && !(typeof data['source_package_id'] === 'string' || data['source_package_id'] instanceof String)) {
            throw new Error("Expected the field `source_package_id` to be a primitive type in the JSON string but got " + data['source_package_id']);
        }
        // ensure the json data is a string
        if (data['target_package_id'] && !(typeof data['target_package_id'] === 'string' || data['target_package_id'] instanceof String)) {
            throw new Error("Expected the field `target_package_id` to be a primitive type in the JSON string but got " + data['target_package_id']);
        }
        // ensure the json data is a string
        if (data['source_handle'] && !(typeof data['source_handle'] === 'string' || data['source_handle'] instanceof String)) {
            throw new Error("Expected the field `source_handle` to be a primitive type in the JSON string but got " + data['source_handle']);
        }
        // ensure the json data is a string
        if (data['target_handle'] && !(typeof data['target_handle'] === 'string' || data['target_handle'] instanceof String)) {
            throw new Error("Expected the field `target_handle` to be a primitive type in the JSON string but got " + data['target_handle']);
        }
        // ensure the json data is a string
        if (data['project_id'] && !(typeof data['project_id'] === 'string' || data['project_id'] instanceof String)) {
            throw new Error("Expected the field `project_id` to be a primitive type in the JSON string but got " + data['project_id']);
        }

        return true;
    }


}

ConnectionCreate.RequiredProperties = ["source_package_id", "target_package_id", "source_handle", "target_handle", "project_id"];

/**
 * @member {String} source_package_id
 */
ConnectionCreate.prototype['source_package_id'] = undefined;

/**
 * @member {String} target_package_id
 */
ConnectionCreate.prototype['target_package_id'] = undefined;

/**
 * @member {String} source_handle
 */
ConnectionCreate.prototype['source_handle'] = undefined;

/**
 * @member {String} target_handle
 */
ConnectionCreate.prototype['target_handle'] = undefined;

/**
 * @member {String} project_id
 */
ConnectionCreate.prototype['project_id'] = undefined;






export default ConnectionCreate;