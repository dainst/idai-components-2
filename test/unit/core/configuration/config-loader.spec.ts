import {ConfigurationDefinition} from '../../../../src/core/configuration/configuration-definition';
import {ConfigLoader} from '../../../../src/core/configuration/config-loader';

/**
 * @author Daniel de Oliveira
 */
describe('ConfigLoader',() => {

    const configuration = {} as ConfigurationDefinition;
    let configLoader: ConfigLoader;


    beforeEach(() => {

        const configReader = jasmine.createSpyObj(
            'confRead',['read']);
        configReader.read.and.returnValue(Promise.resolve(configuration));
        configLoader = new ConfigLoader(configReader);
    });


    it('mix extisting externally configured with internal inherits rel', async (done) => {

        Object.assign(configuration, {
            identifier: 'Conf',
            types: [
                {type: 'A'},
                {type: 'B'},
                {type: 'C'},
                {type: 'D'},
                {type: 'A1', parent: 'A'},
                {type: 'A2', parent: 'A'},
                {type: 'B1', parent: 'B'},
                {type: 'B2', parent: 'B'},
            ],
            relations: [{
                name: 'connection',
                domain: ['C'],
                range: ['D']
            }]
        });

        const pconf = await configLoader.go(
            'yo',
            [],
            [{
                name: 'connection',
                domain: ['A:inherit'], // TODO reject config if not an array
                range: ['B:inherit']
            }],
            [],
            undefined as any,
        );
        
        expect((pconf.getRelationDefinitions('A') as any)[0].range).toContain('B1');
        expect((pconf.getRelationDefinitions('A1') as any)[0].range).toContain('B');
        expect((pconf.getRelationDefinitions('A2') as any)[0].range).toContain('B2');
        expect((pconf.getRelationDefinitions('C') as any)[0].range).toContain('D');
        done();
    });


    it('preprocessConfigurationValidation - reject if isRecordedIn defined for operation subtype', async (done) => {

        Object.assign(configuration, {
            identifier: 'Conf',
            types: [
                {type: 'A', parent: 'Operation'},
            ],
            relations: [{
                name: 'isRecordedIn',
                domain: ['A']
            }]
        });


        try {
            await configLoader.go('yo', [], [], [], undefined as any);
            fail();
        } catch (expected) {
            expect(expected[0]).toContain('operation subtype as domain type/ isRecordedIn must not be defined manually');
        }
        done();
    });


    it('preprocessConfigurationValidation - reject if isRecordedIn range not operation subtype', async (done) => {

        Object.assign(configuration, {
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
        });


        try {
            await configLoader.go('yo', [], [], [], undefined as any);
            fail();
        } catch (expected) {
            expect(expected[0]).toContain('isRecordedIn - only operation subtypes allowed in range');
        }
        done();
    });
});