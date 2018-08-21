import {ConfigurationDefinition} from '../../../../src/ts/configuration/configuration-definition';
import {IdaiFieldConfigurationValidator} from '../../../../src/ts/model/idai-field-configuration-validator';
import {ConfigurationErrors} from '../../../../src/ts/configuration/configuration-errors';

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
            ]
        };
    });
});
