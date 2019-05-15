import {ConfigurationDefinition} from '../../../../src/configuration/configuration-definition';
import {ConfigLoader} from '../../../../src/configuration/config-loader';
import {PrePreprocessConfigurationValidator}
    from '../../../../src/configuration/pre-preprocess-configuration-validator';
import {ConfigurationValidator} from '../../../../src/configuration/configuration-validator';
import {FieldDefinition} from '../../../../src/configuration/field-definition';

/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
describe('ConfigLoader', () => {

    let configuration = {} as ConfigurationDefinition;
    let configLoader: ConfigLoader;
    let configReader;


    function applyConfig(
        customFieldsConfiguration = {},
        languageConfiguration = {},
        customLanguageConfiguration = {},
        hiddenConfiguration = {},
        hiddenCustomConfiguration = {},
        orderConfiguration = {}) {

        configReader.read.and.returnValues(
            Promise.resolve(configuration),
            Promise.resolve(customFieldsConfiguration),
            Promise.resolve(hiddenConfiguration),
            Promise.resolve(hiddenCustomConfiguration),
            Promise.resolve(languageConfiguration),
            Promise.resolve(customLanguageConfiguration),
            Promise.resolve({}),
            Promise.resolve({}),
            Promise.resolve(orderConfiguration)
        );
    }


    beforeEach(() => {

        // Object.assign(configuration, {});
        configuration = {} as ConfigurationDefinition;

        configReader = jasmine.createSpyObj('confRead', ['read']);
        applyConfig();

        configLoader = new ConfigLoader(configReader, () => '');
    });


    // TODO move to preprocessing spec
    it('mix in common fields', async done => {

        Object.assign(configuration, {
            A: { commons: ['processor'] },
        });

        applyConfig(undefined, {
            types: {
                A: { label: 'A_', fields: { processor: {label: 'Bearbeiter/Bearbeiterin', description: "abc"}} },
            }, relations: {}
        });

        let pconf;
        try {
            pconf = await configLoader.go(
                'yo',
                { processor : { inputType: 'input', group: 'stem' }},
                {},
                [],
                {},
                new PrePreprocessConfigurationValidator(),
                new ConfigurationValidator(),
                undefined,
                'de'
            );
        } catch(err) {
            fail(err);
            done();
        }

        expect(pconf.getTypesList()[0]['fields'][0]['name']).toBe('processor');
        done();
    });


    // TODO move to preprocessing spec
    it('translate common fields', async done => {

        Object.assign(configuration, {
            A: { commons: ['processor'] },
        });

        applyConfig(undefined, {
            commons: {
                processor: {label: 'Bearbeiter/Bearbeiterin', description: "abc"}
            },
            types: {},
            relations: {}
        });

        let pconf;
        try {
            pconf = await configLoader.go(
                'yo',
                { processor : { inputType: 'input', group: 'stem' }},
                {},
                [],
                {},
                new PrePreprocessConfigurationValidator(),
                new ConfigurationValidator(),
                undefined,
                'de'
            );
        } catch(err) {
            console.log("err",err);
            fail(err);
            done();
        }

        expect(pconf.getTypesList()[0]['fields'][0]['label']).toBe('Bearbeiter/Bearbeiterin');
        expect(pconf.getTypesList()[0]['fields'][0]['description']).toBe('abc');
        done();
    });


    it('mix existing externally configured with internal inherits relation', async done => { // TODO check if it can be removed since external defintions of relations are now forbidden

        Object.assign(configuration, {
            'A': {},
            'B': {},
            'C': {},
            'D': {},
            'A1': { parent: 'A' },
            'A2': { parent: 'A' },
            'B1': { parent: 'B' },
            'B2': { parent: 'B' }
        });

        let pconf;

        try {
            pconf = await configLoader.go(
                'yo',
                {},
                {},
                [
                    {
                        name: 'connection',
                        domain: ['C'],
                        range: ['D']
                    }, {
                        name: 'connection',
                        domain: ['A:inherit'], // TODO reject config if not an array
                        range: ['B:inherit']
                    }],
                {},
                new PrePreprocessConfigurationValidator(),
                new ConfigurationValidator(),
                undefined,
                'de'
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

        Object.assign(configuration, { A: {}, B: {}});

        let pconf;
        try {
            pconf = await configLoader.go(
                'yo', {}, {},
                [{ name: 'abc', domain: ['A'], range: ['B'], sameMainTypeResource: false }], {},
                new PrePreprocessConfigurationValidator(),
                new ConfigurationValidator(), undefined, 'de');
        } catch(err) {
            fail(err);
            done();
        }

        expect(pconf.getRelationDefinitions('A')[0].sameMainTypeResource).toBe(false);
        done();
    });


    it('preprocess - apply language confs', async (done) => {

        Object.assign(configuration, {
            A: {},
            B: {},
            C: {}
        });

        applyConfig({}, {
            types: {
                A: { label: 'A_' },
                B: { label: 'B_' }
            },
            relations: {
                r1: { label: 'r1_' }
            }
        }, {
            types: {
                B: { label: 'B__' }
            }
        });

        let pconf;
        try {
            pconf = await configLoader.go(
                'yo', {}, {},[
                         { name: 'r1', domain: ['A'], range: ['B']},
                         { name: 'r2', domain: ['A'], range: ['B']}
                    ], {},
                new PrePreprocessConfigurationValidator(),
                new ConfigurationValidator(), undefined, 'de');
        } catch(err) {
            fail(err);
            done();
        }


        expect(pconf.getTypesList()[0].label).toEqual('A_');
        expect(pconf.getTypesList()[1].label).toEqual('B__');
        expect(pconf.getTypesList()[2].label).toEqual('C'); // took name as label

        expect(pconf.getRelationDefinitions('A')[1].label).toEqual('r1_');
        expect(pconf.getRelationDefinitions('A')[0].label).toBeUndefined();
        done();
    });


    it('preprocess - apply custom fields configuration', async done => {

        Object.assign(configuration, {
            A: { fields: { fieldA1: { inputType: 'unsignedInt' } } },
            B: { fields: { fieldB1: { inputType: 'input' } } }
        });

        const customFieldsConfiguration = {
            A: { fields: { fieldA1: { inputType: 'unsignedFloat' } } },
            B: { fields: { fieldB2: { inputType: 'boolean' } } }
        };

        applyConfig(customFieldsConfiguration);

        let pconf;
        try {
            pconf = await configLoader.go('', {}, {},[
                { name: 'r1', domain: ['A'], range: ['B']},
                { name: 'r2', domain: ['A'], range: ['B']}
            ], {},
                new PrePreprocessConfigurationValidator(), new ConfigurationValidator(),
                undefined, 'de'
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


    it('apply order configuration', async done => {

        Object.assign(configuration, {
            B: { fields: { fieldB2: {}, fieldB3: {}, fieldB1: {} } },
            C: { fields: { fieldC1: {}, fieldC2: {} } },
            A: { fields: { fieldA2: {}, fieldA1: {} } }
        });

        applyConfig({}, {}, {},
            {}, {}, {
            types: ['A', 'B', 'C'],
            fields: {
                'A': ['fieldA1', 'fieldA2'],
                'B': ['fieldB1', 'fieldB2', 'fieldB3'],
                'C': ['fieldC1', 'fieldC2'],

                // Ignore fields defined in Order.json but not in configuration silently
                'D': ['fieldD1', 'fieldD2']
            }
        });

        let pconf;
        try {
            pconf = await configLoader.go('', {},{}, [], {},
                new PrePreprocessConfigurationValidator(),
                new ConfigurationValidator(), undefined, 'de'
            );

            expect(pconf.getTypesList()[0].name).toEqual('A');
            expect(pconf.getTypesList()[0].fields[0].name).toEqual('fieldA1');
            expect(pconf.getTypesList()[0].fields[1].name).toEqual('fieldA2');
            expect(pconf.getTypesList()[1].name).toEqual('B');
            expect(pconf.getTypesList()[1].fields[0].name).toEqual('fieldB1');
            expect(pconf.getTypesList()[1].fields[1].name).toEqual('fieldB2');
            expect(pconf.getTypesList()[1].fields[2].name).toEqual('fieldB3');
            expect(pconf.getTypesList()[2].name).toEqual('C');
            expect(pconf.getTypesList()[2].fields[0].name).toEqual('fieldC1');
            expect(pconf.getTypesList()[2].fields[1].name).toEqual('fieldC2');

            done();
        } catch(err) {
            fail(err);
            done();
        }
    });


    it('add types and fields only once even if they are mentioned multiple times in order configuration',
        async done => {

        Object.assign(configuration, {
            A: { fields: { fieldA2: {}, fieldA1: {} } }
        });

        applyConfig({}, {}, {}, {}, {}, {
            types: ['A', 'A'],
            fields: {
                'A': ['fieldA1', 'fieldA2', 'fieldA1']
            }
        });


        let pconf;
        try {
            pconf = await configLoader.go('', {},{}, [], {},
                new PrePreprocessConfigurationValidator(),
                new ConfigurationValidator(), undefined, 'de'
            );

            expect(pconf.getTypesList().length).toBe(1);
            expect(pconf.getTypesList()[0].fields.length).toBe(4);  // fieldA1, fieldA2, id, type
            expect(pconf.getTypesList()[0].fields[0].name).toEqual('fieldA1');
            expect(pconf.getTypesList()[0].fields[1].name).toEqual('fieldA2');

            done();
        } catch(err) {
            fail(err);
            done();
        }
    });


    it('apply hidden configurations', async done => {

        Object.assign(configuration, {
            A: { fields: { fieldA1: {}, fieldA2: {}, fieldA3: {}  } }
        });

        applyConfig({}, {}, {},
        {
                'A': ['fieldA1']
            },
            {
                'A': ['fieldA2']
            });

        let pconf;
        try {
            pconf = await configLoader.go('', {},{}, [], {},
                new PrePreprocessConfigurationValidator(),
                new ConfigurationValidator(), undefined, 'de'
            );

            expect(pconf.getTypesList()[0].fields[0].name).toEqual('fieldA1');
            expect(pconf.getTypesList()[0].fields[0].visible).toBe(false);
            expect(pconf.getTypesList()[0].fields[0].editable).toBe(false);
            expect(pconf.getTypesList()[0].fields[1].name).toEqual('fieldA2');
            expect(pconf.getTypesList()[0].fields[1].visible).toBe(false);
            expect(pconf.getTypesList()[0].fields[1].editable).toBe(false);
            expect(pconf.getTypesList()[0].fields[2].name).toEqual('fieldA3');
            expect(pconf.getTypesList()[0].fields[2].visible).toBe(true);
            expect(pconf.getTypesList()[0].fields[2].editable).toBe(true);

            done();
        } catch(err) {
            fail(err);
            done();
        }
    });


    it('apply hidden and order configuration', async done => {

        Object.assign(configuration, {
            A: { fields: { fieldA1: {}, fieldA3: {}, fieldA2: {} } }
        });

        applyConfig({}, {}, {}, {
            'A': ['fieldA1']
        }, {}, {
            types: ['A'],
            fields: {
                'A': ['fieldA1', 'fieldA2', 'fieldA3']
            }
        });


        let pconf;
        try {
            pconf = await configLoader.go('', {},{}, [], {},
                new PrePreprocessConfigurationValidator(),
                new ConfigurationValidator(), undefined, 'de'
            );

            expect(pconf.getTypesList()[0].fields[0].name).toEqual('fieldA1');
            expect(pconf.getTypesList()[0].fields[0].visible).toBe(false);
            expect(pconf.getTypesList()[0].fields[0].editable).toBe(false);
            expect(pconf.getTypesList()[0].fields[1].name).toEqual('fieldA2');
            expect(pconf.getTypesList()[0].fields[1].visible).toBe(true);
            expect(pconf.getTypesList()[0].fields[1].editable).toBe(true);
            expect(pconf.getTypesList()[0].fields[2].name).toEqual('fieldA3');
            expect(pconf.getTypesList()[0].fields[2].visible).toBe(true);
            expect(pconf.getTypesList()[0].fields[2].editable).toBe(true);

            done();
        } catch(err) {
            fail(err);
            done();
        }
    });

});