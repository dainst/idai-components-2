import {ConfigurationDefinition} from '../../../src/app/configuration/configuration-definition';
import {MDInternal} from '../../../src/app/messages/md-internal';
import {IdaiFieldConfigurationValidator} from '../../../src/app/idai-field-model/idai-field-configuration-validator';

/**
 * @author Daniel de Oliveira
 */
export function main() {

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
                .toContain([MDInternal.VALIDATION_ERROR_MISSINGVIEWTYPE, 'U']);
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
                .toContain([MDInternal.VALIDATION_ERROR_NONOPERATIONVIEWTYPE, 'T2']);
        });
    });
}