"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var idai_field_pre_prepprocess_configuration_validator_1 = require("../../../../src/core/configuration/idai-field-pre-prepprocess-configuration-validator");
/**
 * @author Daniel de Oliveira
 */
describe('PrePreprocessConfigurationValidator', function () {
    it('reject if isRecordedIn defined for image type', function () {
        var configuration = {
            identifier: 'Conf',
            types: [
                { type: 'Image' },
            ],
            relations: [{
                    name: 'isRecordedIn',
                    domain: ['Image']
                }]
        };
        var result = new idai_field_pre_prepprocess_configuration_validator_1.IdaiFieldPrePreprocessConfigurationValidator().go(configuration);
        expect(result[0][0]).toContain('image type/ isRecordedIn must not be defined manually');
    });
    it('reject if isRecordedIn defined for image subtype', function () {
        var configuration = {
            identifier: 'Conf',
            types: [
                { type: 'Drawing', parent: 'Image' },
            ],
            relations: [{
                    name: 'isRecordedIn',
                    domain: ['Drawing']
                }]
        };
        var result = new idai_field_pre_prepprocess_configuration_validator_1.IdaiFieldPrePreprocessConfigurationValidator().go(configuration);
        expect(result[0][0]).toContain('image type/ isRecordedIn must not be defined manually');
    });
    it('reject if isRecordedIn defined for operation subtype', function () {
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
        expect(result[0][0]).toContain('operation subtype as domain type/ isRecordedIn must not be defined manually');
    });
    it('reject if isRecordedIn range not operation subtype', function () {
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
        expect(result[0][0]).toContain('isRecordedIn - only operation subtypes allowed in range');
    });
    it('reject if field not allowed in relation', function () {
        var configuration = {
            identifier: 'Conf',
            types: [{ type: 'A' }],
            relations: [{
                    name: 'abc',
                    visible: 'true'
                }]
        };
        var result = new idai_field_pre_prepprocess_configuration_validator_1.IdaiFieldPrePreprocessConfigurationValidator().go(configuration);
        expect(result[0][0]).toContain('relation field not allowed');
    });
    it('reject if field not allowed in type', function () {
        var configuration = {
            identifier: 'Conf',
            types: [{ type: 'A', fields: { editable: true } }],
            relations: []
        };
        var result = new idai_field_pre_prepprocess_configuration_validator_1.IdaiFieldPrePreprocessConfigurationValidator().go(configuration);
        expect(result[0][0]).toContain('field(s) not allowed');
    });
});
//# sourceMappingURL=idai-field-pre-preprocess-configuration-validator.spec.js.map