"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_loader_1 = require("../../../../src/core/configuration/config-loader");
var idai_field_pre_prepprocess_configuration_validator_1 = require("../../../../src/core/configuration/idai-field-pre-prepprocess-configuration-validator");
/**
 * @author Daniel de Oliveira
 */
describe('PrePreprocessConfigurationValidator', function () {
    var configuration = {};
    var configLoader;
    beforeEach(function () {
        var configReader = jasmine.createSpyObj('confRead', ['read']);
        configReader.read.and.returnValue(Promise.resolve(configuration));
        configLoader = new config_loader_1.ConfigLoader(configReader);
    });
    it('preprocessConfigurationValidation - reject if isRecordedIn defined for operation subtype', function () {
        var configuration = {
            identifier: 'Conf',
            types: [
                { type: 'A', parent: 'Operation' },
            ],
            relations: [{
                    name: 'isRecordedIn',
                    domain: ['A']
                }]
        };
        var result = new idai_field_pre_prepprocess_configuration_validator_1.IdaiFieldPrePreprocessConfigurationValidator().go(configuration);
        expect(result[0]).toContain('operation subtype as domain type/ isRecordedIn must not be defined manually');
    });
    it('preprocessConfigurationValidation - reject if isRecordedIn range not operation subtype', function () {
        var configuration = {
            identifier: 'Conf',
            types: [
                { type: 'A' },
                { type: 'B' }
            ],
            relations: [{
                    name: 'isRecordedIn',
                    domain: ['A'],
                    range: ['B']
                }]
        };
        var result = new idai_field_pre_prepprocess_configuration_validator_1.IdaiFieldPrePreprocessConfigurationValidator().go(configuration);
        expect(result[0]).toContain('isRecordedIn - only operation subtypes allowed in range');
    });
    it('preprocessConfigurationValidation - reject if field not allowed in relation', function () {
        var configuration = {
            identifier: 'Conf',
            types: [{ type: 'A' }],
            relations: [{
                    name: 'abc',
                    visible: 'true'
                }]
        };
        var result = new idai_field_pre_prepprocess_configuration_validator_1.IdaiFieldPrePreprocessConfigurationValidator().go(configuration);
        expect(result[0]).toContain('relation field not allowed');
    });
});
//# sourceMappingURL=idai-field-pre-preprocess-configuration-validator.spec.js.map