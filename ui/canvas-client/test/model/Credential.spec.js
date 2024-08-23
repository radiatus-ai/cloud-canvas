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

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', process.cwd() + '/src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require(process.cwd() + '/src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.PlatformApi);
  }
})(this, function (expect, PlatformApi) {
  'use strict';

  var instance;

  beforeEach(function () {
    instance = new PlatformApi.Credential();
  });

  var getProperty = function (object, getter, property) {
    // Use getter method if present; otherwise, get the property directly.
    if (typeof object[getter] === 'function') return object[getter]();
    else return object[property];
  };

  var setProperty = function (object, setter, property, value) {
    // Use setter method if present; otherwise, set the property directly.
    if (typeof object[setter] === 'function') object[setter](value);
    else object[property] = value;
  };

  describe('Credential', function () {
    it('should create an instance of Credential', function () {
      // uncomment below and update the code to test Credential
      //var instance = new PlatformApi.Credential();
      //expect(instance).to.be.a(PlatformApi.Credential);
    });

    it('should have the property credentialType (base name: "credential_type")', function () {
      // uncomment below and update the code to test the property credentialType
      //var instance = new PlatformApi.Credential();
      //expect(instance).to.be();
    });

    it('should have the property id (base name: "id")', function () {
      // uncomment below and update the code to test the property id
      //var instance = new PlatformApi.Credential();
      //expect(instance).to.be();
    });

    it('should have the property organizationId (base name: "organization_id")', function () {
      // uncomment below and update the code to test the property organizationId
      //var instance = new PlatformApi.Credential();
      //expect(instance).to.be();
    });
  });
});
