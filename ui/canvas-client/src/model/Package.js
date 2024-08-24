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
 * The Package model module.
 * @module model/Package
 * @version 0.1.0
 */
class Package {
    /**
     * Constructs a new <code>Package</code>.
     * @alias module:model/Package
     * @param name {String}
     * @param type {String}
     * @param inputs {Object}
     * @param outputs {Object}
     * @param parameters {Object}
     * @param id {String}
     */
    constructor(name, type, inputs, outputs, parameters, id) {

        Package.initialize(this, name, type, inputs, outputs, parameters, id);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, name, type, inputs, outputs, parameters, id) {
        obj['name'] = name;
        obj['type'] = type;
        obj['inputs'] = inputs;
        obj['outputs'] = outputs;
        obj['parameters'] = parameters;
        obj['id'] = id;
    }

    /**
     * Constructs a <code>Package</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Package} obj Optional instance to populate.
     * @return {module:model/Package} The populated <code>Package</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new Package();

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
            if (data.hasOwnProperty('id')) {
                obj['id'] = ApiClient.convertToType(data['id'], 'String');
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>Package</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>Package</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of Package.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }
        // ensure the json data is a string
        if (data['name'] && !(typeof data['name'] === 'string' || data['name'] instanceof String)) {
            throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data['name']);
        }
        // ensure the json data is a string
        if (data['type'] && !(typeof data['type'] === 'string' || data['type'] instanceof String)) {
            throw new Error("Expected the field `type` to be a primitive type in the JSON string but got " + data['type']);
        }
        // ensure the json data is a string
        if (data['id'] && !(typeof data['id'] === 'string' || data['id'] instanceof String)) {
            throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data['id']);
        }

        return true;
    }


}

Package.RequiredProperties = ["name", "type", "inputs", "outputs", "parameters", "id"];

/**
 * @member {String} name
 */
Package.prototype['name'] = undefined;

/**
 * @member {String} type
 */
Package.prototype['type'] = undefined;

/**
 * @member {Object} inputs
 */
Package.prototype['inputs'] = undefined;

/**
 * @member {Object} outputs
 */
Package.prototype['outputs'] = undefined;

/**
 * @member {Object} parameters
 */
Package.prototype['parameters'] = undefined;

/**
 * @member {String} id
 */
Package.prototype['id'] = undefined;






export default Package;
