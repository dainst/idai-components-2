import {ConfigurationDefinition} from '../../../../src/core/configuration/configuration-definition';
import {ConfigLoader} from '../../../../src/core/configuration/config-loader';
import {
    IdaiFieldPrePreprocessConfigurationValidator
} from '../../../../src/core/configuration/idai-field-pre-preprocess-configuration-validator';
import {ConfigurationValidator} from '../../../../src/core/configuration/configuration-validator';

/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
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


    it('mix existing externally configured with internal inherits rel', async (done) => {

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

        let pconf;

        try {
            pconf = await configLoader.go(
                'yo',
                [],
                [{
                    name: 'connection',
                    domain: ['A:inherit'], // TODO reject config if not an array
                    range: ['B:inherit']
                }],
                [],
                new IdaiFieldPrePreprocessConfigurationValidator(),
                new ConfigurationValidator()
            );
        } catch(err) {
            fail(err);
            done();
        }
        
        expect((pconf.getRelationDefinitions('A') as any)[0].range).toContain('B1');
        expect((pconf.getRelationDefinitions('A1') as any)[0].range).toContain('B');
        expect((pconf.getRelationDefinitions('A2') as any)[0].range).toContain('B2');
        expect((pconf.getRelationDefinitions('C') as any)[0].range).toContain('D');
        done();
    });


    it('preprocess - convert sameOperation to sameMainTypeResource', async (done) => {

        Object.assign(configuration, {
            identifier: 'Conf',
            types: [{ type: 'A' }, { type: 'B' }],
            relations: [{ name: 'abc', domain: ['A'], range: ['B'], sameOperation: false }]
        });

        let pconf;
        try {
            pconf = await configLoader.go(
                'yo', [], [], [],
                new IdaiFieldPrePreprocessConfigurationValidator(),
                new ConfigurationValidator());
        } catch(err) {
            fail(err);
            done();
        }

        expect(pconf.getRelationDefinitions('A')[0].sameMainTypeResource).toBe(false);
        done();
    });


    it('preprocess - apply language confs', async (done) => {

        Object.assign(configuration, {
            identifier: 'Conf',
            types: [
                { type: 'A' },
                { type: 'B' },
                { type: 'C' }
            ],
            relations: [
                { name: 'r1', domain: ['A'], range: ['B']},
                { name: 'r2', domain: ['A'], range: ['B']}
            ]
        });

        configReader.read.and.returnValues(
            Promise.resolve(configuration),
            Promise.resolve({}),
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

        let pconf;
        try {
            pconf = await configLoader.go(
                'yo', [], [], [],
                new IdaiFieldPrePreprocessConfigurationValidator(),
                new ConfigurationValidator());
        } catch(err) {
            fail(err);
            done();
        }


        expect(pconf.getTypesList()[0].label).toEqual('A_');
        expect(pconf.getTypesList()[1].label).toEqual('B__');
        expect(pconf.getTypesList()[2].label).toEqual('C'); // took name as label

        expect(pconf.getRelationDefinitions('A')[0].label).toEqual('r1_');
        expect(pconf.getRelationDefinitions('A')[1].label).toBeUndefined();
        done();
    });


    it('preprocess - apply custom fields configuration', async done => {

        Object.assign(configuration, {
            identifier: 'Conf',
            types: [
                { type: 'A', fields: [ { name: 'fieldA1', inputType: 'unsignedInt' } ] },
                { type: 'B', fields: [ { name: 'fieldB1', inputType: 'input' } ] },
            ],
            relations: [
                { name: 'r1', domain: ['A'], range: ['B']},
                { name: 'r2', domain: ['A'], range: ['B']}
            ]
        });

        configReader.read.and.returnValues(
            Promise.resolve(configuration),
            Promise.resolve({
                A: { fields: { fieldA1: { inputType: 'unsignedFloat' } } },
                B: { fields: { fieldB2: { inputType: 'boolean' } } }
            }),
            Promise.resolve({}),
            Promise.resolve({}),
            Promise.resolve({}),
            Promise.resolve({})
        );

        let pconf;
        try {
            pconf = await configLoader.go('', [], [], [],
                new IdaiFieldPrePreprocessConfigurationValidator(), new ConfigurationValidator()
            );

            expect(pconf.getTypesList()[0].fields.find(field => field.name == 'fieldA1')
                .inputType).toEqual('unsignedFloat');
            expect(pconf.getTypesList()[1].fields.find(field => field.name == 'fieldB1')
                .inputType).toEqual('input');
            expect(pconf.getTypesList()[1].fields.find(field => field.name == 'fieldB2')
                .inputType).toEqual('boolean');

            done();
        } catch(err) {
            fail(err);
            done();
        }
    });
});