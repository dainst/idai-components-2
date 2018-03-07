"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var idai_field_configuration_validator_1 = require("../../../../src/field/model/idai-field-configuration-validator");
var configuration_errors_1 = require("../../../../src/core/configuration/configuration-errors");
/**
 * @author Daniel de Oliveira
 */
describe('IdaiFieldConfigurationValidator', function () {
    var configuration;
    beforeEach(function () {
        configuration = {
            identifier: 'test',
            types: [
                {
                    type: 'Operation',
                    fields: []
                },
                {
                    type: 'T1',
                    fields: [],
                    parent: 'Operation'
                },
                {
                    'type': 'T2',
                    'fields': []
                }
            ],
            relations: [
                {
                    name: 'isRecordedIn', domain: ['T1'], range: ['Project']
                },
                {
                    name: 'isRecordedIn', domain: ['T2'], range: ['T1']
                }
            ],
            views: [
                {
                    name: 'a',
                    label: 'A',
                    operationSubtype: 'T1'
                }
            ]
        };
    });
    it('should report missing view types', function () {
        configuration.views[0] = {
            name: 'a',
            label: 'A',
            operationSubtype: 'U'
        };
        expect(new idai_field_configuration_validator_1.IdaiFieldConfigurationValidator()
            .go(configuration))
            .toContain([configuration_errors_1.ConfigurationErrors.VALIDATION_ERROR_MISSINGVIEWTYPE, 'U']);
    });
    // see apidoc for the reason why we only want operation type views
    it('should report non operation view types', function () {
        configuration.views[0] = {
            name: 'a',
            label: 'A',
            operationSubtype: 'T2'
        };
        expect(new idai_field_configuration_validator_1.IdaiFieldConfigurationValidator()
            .go(configuration))
            .toContain([configuration_errors_1.ConfigurationErrors.VALIDATION_ERROR_NONOPERATIONVIEWTYPE, 'T2']);
    });
});
//# sourceMappingURL=idai-field-configuration-validator.spec.js.map