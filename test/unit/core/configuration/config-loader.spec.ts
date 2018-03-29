import {ConfigurationDefinition} from '../../../../src/core/configuration/configuration-definition';
import {ConfigLoader} from '../../../../src/core/configuration/config-loader';
import {
    IdaiFieldPrePreprocessConfigurationValidator
} from '../../../../src/core/configuration/idai-field-pre-prepprocess-configuration-validator';

/**
 * @author Daniel de Oliveira
 */
describe('ConfigLoader',() => {

    const configuration = {} as ConfigurationDefinition;
    let configLoader: ConfigLoader;
    let configReader;


    beforeEach(() => {

        configReader = jasmine.createSpyObj(
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
            new IdaiFieldPrePreprocessConfigurationValidator(),
            undefined as any
        );
        
        expect((pconf.getRelationDefinitions('A') as any)[0].range).toContain('B1');
        expect((pconf.getRelationDefinitions('A1') as any)[0].range).toContain('B');
        expect((pconf.getRelationDefinitions('A2') as any)[0].range).toContain('B2');
        expect((pconf.getRelationDefinitions('C') as any)[0].range).toContain('D');
        done();
    });


    it('preprocess - convert sameOperation to sameMainTypeResource', async (done) => {

        Object.assign(configuration, {
            identifier: 'Conf',
            types: [{type: 'A'}],
            relations: [{
                name: 'abc',
                domain: ['A'],
                sameOperation: false
            }]
        });


        const pconf = await configLoader.go(
            'yo', [], [], [],
            new IdaiFieldPrePreprocessConfigurationValidator(),
            undefined as any);
        expect(pconf.getRelationDefinitions('A')[0].sameMainTypeResource)
            .toBe(false);
        done();
    });


    it('preprocess - apply language confs', async (done) => {

        Object.assign(configuration, {
            identifier: 'Conf',
            types: [
                { type: 'A' },
                { type: 'B'},
                { type: 'C'}
            ],
            relations: [
                { name: 'r1', domain: ['A']},
                { name: 'r2', domain: ['A']}
            ]
        });

        configReader.read.and.returnValues(
            Promise.resolve(configuration),
            Promise.resolve({}),
            Promise.resolve({}),
            Promise.resolve({
                    types: {
                        A: { label: 'A_' },
                        B: { label: 'B_' }
                    },
                    relations: {
                        r1: { label: 'r1_'}
                    }
            }),
            Promise.resolve({
                types: {
                    B: { label: 'B__' }
                }
            })
        );


        const pconf = await configLoader.go(
            'yo', [], [], [],
            new IdaiFieldPrePreprocessConfigurationValidator(),
            undefined as any);


        expect(pconf.getTypesList()[0].label).toEqual('A_');
        expect(pconf.getTypesList()[1].label).toEqual('B__');
        expect(pconf.getTypesList()[2].label).toEqual('C'); // took name as label

        expect(pconf.getRelationDefinitions('A')[0].label).toEqual('r1_');
        expect(pconf.getRelationDefinitions('A')[1].label).toBeUndefined();
        done();
    });
});