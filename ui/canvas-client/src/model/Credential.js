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
import CredentialType from './CredentialType';

/**
 * The Credential model module.
 * @module model/Credential
 * @version 0.1.0
 */
class Credential {
    /**
     * Constructs a new <code>Credential</code>.
     * @alias module:model/Credential
     * @param credentialType {module:model/CredentialType}
     * @param id {String}
     * @param organizationId {String}
     */
    constructor(credentialType, id, organizationId) {

        Credential.initialize(this, credentialType, id, organizationId);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, credentialType, id, organizationId) {
        obj['credential_type'] = credentialType;
        obj['id'] = id;
        obj['organization_id'] = organizationId;
    }

    /**
     * Constructs a <code>Credential</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Credential} obj Optional instance to populate.
     * @return {module:model/Credential} The populated <code>Credential</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new Credential();

            if (data.hasOwnProperty('credential_type')) {
                obj['credential_type'] = CredentialType.constructFromObject(data['credential_type']);
            }
            if (data.hasOwnProperty('id')) {
                obj['id'] = ApiClient.convertToType(data['id'], 'String');
            }
            if (data.hasOwnProperty('organization_id')) {
                obj['organization_id'] = ApiClient.convertToType(data['organization_id'], 'String');
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>Credential</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>Credential</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of Credential.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }
        // ensure the json data is a string
        if (data['id'] && !(typeof data['id'] === 'string' || data['id'] instanceof String)) {
            throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data['id']);
        }
        // ensure the json data is a string
        if (data['organization_id'] && !(typeof data['organization_id'] === 'string' || data['organization_id'] instanceof String)) {
            throw new Error("Expected the field `organization_id` to be a primitive type in the JSON string but got " + data['organization_id']);
        }

        return true;
    }


}

Credential.RequiredProperties = ["credential_type", "id", "organization_id"];

/**
 * @member {module:model/CredentialType} credential_type
 */
Credential.prototype['credential_type'] = undefined;

/**
 * @member {String} id
 */
Credential.prototype['id'] = undefined;

/**
 * @member {String} organization_id
 */
Credential.prototype['organization_id'] = undefined;






export default Credential;