import {ConfigurationDefinition} from '../../../../src/core/configuration/configuration-definition';
import {IdaiFieldConfigurationValidator} from '../../../../src/field/model/idai-field-configuration-validator';
import {ConfigurationErrors} from '../../../../src/core/configuration/configuration-errors';

/**
 * @author Daniel de Oliveira
 */

describe('IdaiFieldConfigurationValidator', () => {

    let configuration: ConfigurationDefinition;

    beforeEach(() => {
        configuration = {

            identifier: 'test',
            types : [
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
            relations : [
                {
                    name: 'isRecordedIn', domain: ['T1'], range: ['Project']
                },
                {
                    name: 'isRecordedIn', domain: ['T2'], range: ['T1']
                }
            ],
            views : [
                {
                    name: 'a',
                    label: 'A',
                    operationSubtype: 'T1'
                }
            ]
        };
    });


    it('should report missing view types', function() {

        configuration.views[0] = {
            name: 'a',
            label: 'A',
            operationSubtype: 'U'
        };

        expect(new IdaiFieldConfigurationValidator()
            .go(configuration))
            .toContain([ConfigurationErrors.VALIDATION_ERROR_MISSINGVIEWTYPE, 'U']);
    });


    // see apidoc for the reason why we only want operation type views
    it('should report non operation view types', function() {

        configuration.views[0] = {
            name: 'a',
            label: 'A',
            operationSubtype: 'T2'
        };

        expect(new IdaiFieldConfigurationValidator()
            .go(configuration))
            .toContain([ConfigurationErrors.VALIDATION_ERROR_NONOPERATIONVIEWTYPE, 'T2']);
    });
});
