"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            ]
        };
    });
});
//# sourceMappingURL=idai-field-configuration-validator.spec.js.map