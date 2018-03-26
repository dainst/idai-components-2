import {ConfigurationDefinition} from '../../../../src/core/configuration/configuration-definition';
import {ConfigLoader} from '../../../../src/core/configuration/config-loader';
import {IdaiFieldPrePreprocessConfigurationValidator} from '../../../../src/core/configuration/idai-field-pre-prepprocess-configuration-validator';

/**
 * @author Daniel de Oliveira
 */
describe('PrePreprocessConfigurationValidator',() => {

    const configuration = {} as ConfigurationDefinition;
    let configLoader: ConfigLoader;


    beforeEach(() => {

        const configReader = jasmine.createSpyObj(
            'confRead',['read']);
        configReader.read.and.returnValue(Promise.resolve(configuration));
        configLoader = new ConfigLoader(configReader);
    });



    it('preprocessConfigurationValidation - reject if isRecordedIn defined for operation subtype', () => {

        const configuration = {
            identifier: 'Conf',
            types: [
                {type: 'A', parent: 'Operation'},
            ],
            relations: [{
                name: 'isRecordedIn',
                domain: ['A']
            }]
        };


        const result = new IdaiFieldPrePreprocessConfigurationValidator().go(configuration);
        expect(result[0]).toContain('operation subtype as domain type/ isRecordedIn must not be defined manually');
    });


    it('preprocessConfigurationValidation - reject if isRecordedIn range not operation subtype', () => {

        const configuration = {
            identifier: 'Conf',
            types: [
                {type: 'A'},
                {type: 'B'}
            ],
            relations: [{
                name: 'isRecordedIn',
                domain: ['A'],
                range: ['B']
            }]
        };

        const result = new IdaiFieldPrePreprocessConfigurationValidator().go(configuration);
        expect(result[0]).toContain('isRecordedIn - only operation subtypes allowed in range');
    });


    it('preprocessConfigurationValidation - reject if field not allowed in relation', () => {

        const configuration = {
            identifier: 'Conf',
            types: [{type: 'A'}],
            relations: [{
                name: 'abc',
                visible: 'true'
            }]
        };

        const result = new IdaiFieldPrePreprocessConfigurationValidator().go(configuration);
        expect(result[0]).toContain('relation field not allowed');
    });
});