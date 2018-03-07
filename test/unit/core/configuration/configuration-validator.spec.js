"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_validator_1 = require("../../../../src/core/configuration/configuration-validator");
var configuration_errors_1 = require("../../../../src/core/configuration/configuration-errors");
/**
 * @author Daniel de Oliveira
 */
describe('ConfigurationValidator', function () {
    var configuration;
    it('should report duplicate type', function () {
        configuration = {
            identifier: 'test',
            types: [
                { type: 'Tduplicate', fields: [] },
                { type: 'Tduplicate', fields: [] }
            ]
        };
        expect(new configuration_validator_1.ConfigurationValidator()
            .go(configuration))
            .toContain([configuration_errors_1.ConfigurationErrors.INVALID_CONFIG_DUPLICATETYPE, 'Tduplicate']);
    });
    it('should report missing parent type', function () {
        configuration = {
            identifier: 'test',
            types: [{ type: 'T', fields: [], parent: 'P' }]
        };
        expect(new configuration_validator_1.ConfigurationValidator()
            .go(configuration))
            .toContain([configuration_errors_1.ConfigurationErrors.INVALID_CONFIG_MISSINGPARENTTYPE, 'P']);
    });
    it('should report unnamed type', function () {
        configuration = {
            identifier: 'test',
            types: [{ fields: [] }]
        };
        expect(new configuration_validator_1.ConfigurationValidator()
            .go(configuration))
            .toContain([configuration_errors_1.ConfigurationErrors.INVALID_CONFIG_INVALIDTYPE,
            JSON.stringify({ fields: [] })]);
    });
});
//# sourceMappingURL=configuration-validator.spec.js.map