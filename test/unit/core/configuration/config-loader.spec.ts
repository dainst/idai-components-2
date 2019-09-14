import {ConfigurationDefinition} from '../../../../src/configuration/configuration-definition';
import {ConfigLoader} from '../../../../src/configuration/config-loader';
import {PrePreprocessConfigurationValidator} from '../../../../src/configuration/pre-preprocess-configuration-validator';
import {ConfigurationValidator} from '../../../../src/configuration/configuration-validator';
import {ConfigurationErrors} from '../../../../src/configuration/configuration-errors';

/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
describe('ConfigLoader', () => {

    let registeredTypes1 = {} as ConfigurationDefinition;
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
            Promise.resolve(registeredTypes1),
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

        registeredTypes1 = {} as ConfigurationDefinition;

        configReader = jasmine.createSpyObj('confRead', ['read']);
        applyConfig();

        configLoader = new ConfigLoader(configReader, () => '');
    });


    it('mix in common fields', async done => {

        Object.assign(registeredTypes1, {
            'B:0': { parent: 'A', commons: ['processor'] },
        });

        applyConfig(undefined, {
            types: {
                B: { label: 'B_', fields: { processor: { label: 'Bearbeiter/Bearbeiterin', description: "abc" }} },
            }, relations: {}
        });

        let pconf;
        try {
            pconf = await configLoader.go(
                'yo',
                { processor : { inputType: 'input', group: 'stem' }},
                { 'A': { fields: {}} },
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

        expect(pconf.getTypesList()[1]['fields'][2]['name']).toBe('processor');
        done();
    });


    it('translate common fields', async done => {

        Object.assign(registeredTypes1, {
            'B:0': { parent: 'A', commons: ['processor'] },
        });

        applyConfig(undefined, {
            commons: {
                processor: { label: 'Bearbeiter/Bearbeiterin', description: "abc" }
            },
            types: {},
            relations: {}
        });

        let pconf;
        try {
            pconf = await configLoader.go(
                'yo',
                { processor : { inputType: 'input', group: 'stem' }},
                { 'A': { fields: {} }},
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
        expect(pconf.getTypesList()[1]['fields'][2]['label']).toBe('Bearbeiter/Bearbeiterin');
        expect(pconf.getTypesList()[1]['fields'][2]['description']).toBe('abc');
        done();
    });


    it('mix existing externally configured with internal inherits relation', async done => { // TODO check if it can be removed since external defintions of relations are now forbidden

        Object.assign(registeredTypes1, {
            'A1:0': { parent: 'A' },
            'A2:0': { parent: 'A' },
            'B1:0': { parent: 'B' },
            'B2:0': { parent: 'B' }
        });

        let pconf;

        try {
            pconf = await configLoader.go(
                'yo',
                {},
                {
                    'A': { fields: {}},
                    'B': { fields: {}},
                    'C': { fields: {}},
                    'D': { fields: {}}
                },
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


    it('preprocess - convert sameOperation to sameMainTypeResource', async done => {

        Object.assign(registeredTypes1, { 'A:0': { parent: 'T' }, 'B:0': { parent: 'T' }});

        let pconf;
        try {
            pconf = await configLoader.go(
                'yo',
                {},
                { T: { fields: {} }},
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


    it('preprocess - apply language confs', async done => {

        Object.assign(registeredTypes1, {
            'A:0': { parent: 'Parent' },
            'B:0': { parent: 'Parent' },
            'C:0': { parent: 'Parent' }
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
                'yo', {}, { 'Parent': { fields: {} }},[
                         { name: 'r1', domain: ['A'], range: ['B']},
                         { name: 'r2', domain: ['A'], range: ['B']}
                    ], {},
                new PrePreprocessConfigurationValidator(),
                new ConfigurationValidator(), undefined, 'de');
        } catch(err) {
            fail(err);
            done();
        }


        expect(pconf.getTypesList()[1].label).toEqual('A_');
        expect(pconf.getTypesList()[2].label).toEqual('B__');
        expect(pconf.getTypesList()[3].label).toEqual('C'); // took name as label

        expect(pconf.getRelationDefinitions('A')[1].label).toEqual('r1_');
        expect(pconf.getRelationDefinitions('A')[0].label).toBeUndefined();
        done();
    });


    it('preprocess - apply custom fields configuration', async done => {

        Object.assign(registeredTypes1, {
            'A:0': { parent: 'F', fields: { fieldA1: { inputType: 'unsignedInt' } } },
            'B:0': { parent: 'G', fields: { fieldB1: { inputType: 'input' } } }
        });

        const customFieldsConfiguration = {
            'A:1': { parent: 'F', derives: 'A:0', fields: { fieldA1: { inputType: 'unsignedFloat' } } },
            'B:1': { parent: 'G', derives: 'B:0', fields: { fieldB2: { inputType: 'boolean' } } }
        };

        applyConfig(customFieldsConfiguration);

        let pconf;
        try {
            pconf = await configLoader.go('', {},
                { 'F': { fields: {} }, 'G': { fields: {} }},[], {},
                new PrePreprocessConfigurationValidator(),
                new ConfigurationValidator(),
                undefined, 'de'
            );

            expect(pconf.getTypesList()[2].fields.find(field => field.name == 'fieldA1')
                .inputType).toEqual('unsignedFloat');
            expect(pconf.getTypesList()[3].fields.find(field => field.name == 'fieldB1')
                .inputType).toEqual('input');
            expect(pconf.getTypesList()[3].fields.find(field => field.name == 'fieldB2')
                .inputType).toEqual('boolean');

        } catch(err) {
            fail(err);
        } finally {
            done();
        }
    });


    it('preprocess - apply custom fields configuration - add subtypes', async done => {

        Object.assign(registeredTypes1, {
            'Find:0': { fields: { fieldA1: { inputType: 'unsignedInt' } } }
        });

        const secondLevelTypes = {
            'B:0': { parent: 'Find', fields: { fieldC1: { inputType: 'boolean'}}}
        };

        applyConfig(secondLevelTypes);

        let pconf;
        try {
            pconf = await configLoader.go('', {}, { 'Find': { fields: {} }},[], {},
                new PrePreprocessConfigurationValidator(), new ConfigurationValidator(),
                undefined, 'de'
            );

            expect(pconf.getTypesList()[1].fields.find(field => field.name == 'fieldC1')
                .inputType).toEqual('boolean');

        } catch(err) {
            fail(err);
        } finally {
            done();
        }
    });


    it('preprocess - apply custom fields configuration - add subtypes - no parent assigned', async done => {

        Object.assign(registeredTypes1, {
            'Find:0': { fields: { fieldA1: { inputType: 'unsignedInt' } } }
        });

        const secondLevelTypes = {
            'B:0': { fields: { fieldC1: { inputType: 'boolean'}}}
        };

        applyConfig(secondLevelTypes);

        try {
            await configLoader.go('', {}, { 'Find': { fields: {} }},[], {},
                new PrePreprocessConfigurationValidator(), new ConfigurationValidator(),
                undefined, 'de'
            );

            fail();
        } catch(err) {
            expect(err).toEqual([[ConfigurationErrors.INVALID_CONFIG_NO_PARENT_ASSIGNED, 'B:0']]);
        } finally {
            done();
        }
    });


    it('preprocess - apply custom fields configuration - add subtypes - parent not defined', async done => {

        Object.assign(registeredTypes1, {});

        const customFieldsConfiguration = {
            'B:0': { parent: 'Find', fields: { fieldC1: { inputType: 'boolean'}}}
        };

        applyConfig(customFieldsConfiguration);

        try {
            await configLoader.go('', {}, {},[], {},
                new PrePreprocessConfigurationValidator(), new ConfigurationValidator(),
                undefined, 'de'
            );

            fail();
        } catch(err) {
            expect(err).toEqual([[ConfigurationErrors.INVALID_CONFIG_PARENT_NOT_DEFINED, 'Find']]);
        } finally {
            done();
        }
    });


    xit('preprocess - apply custom fields configuration - add subtypes - parent no top level type', async done => {

        Object.assign(registeredTypes1, {
            'Find:0': { parent: 'SuperFind', fields: { fieldA1: { inputType: 'unsignedInt' } } }
        });

        const secondLevelTypes = {
            C: { parent: 'SuperFind', fields: { fieldC1: { inputType: 'boolean'}}}
        };

        applyConfig(secondLevelTypes);

        try {
            await configLoader.go('', {}, { SuperFind: { fields: { fieldA1: { inputType: 'unsignedInt' } } }},[], {},
                new PrePreprocessConfigurationValidator(), new ConfigurationValidator(),
                undefined, 'de'
            );

            fail();
        } catch(err) {
            expect(err).toEqual([[ConfigurationErrors.INVALID_CONFIG_PARENT_NOT_TOP_LEVEL]]);
        } finally {
            done();
        }
    });


    xit('preprocess - apply custom fields configuration - add subtypes - parent must not come from custom config', async done => {

        Object.assign(registeredTypes1, {
            TopFind: { fields: { fieldA1: { inputType: 'unsignedInt' } } }
        });

        const customFieldsConfiguration = {
            Find: { parent: 'SuperFind', fields: { fieldA1: { inputType: 'unsignedInt' } } },
            C: { parent: 'Find', fields: { fieldC1: { inputType: 'boolean'}}}
        };

        applyConfig(customFieldsConfiguration);

        try {
            await configLoader.go('', {}, {},[], {},
                new PrePreprocessConfigurationValidator(), new ConfigurationValidator(),
                undefined, 'de'
            );
            fail();

        } catch(err) {
            expect(err).toEqual([[ConfigurationErrors.INVALID_CONFIG_PARENT_NOT_DEFINED]]);
        } finally {
            done();
        }
    });


    it('preprocess - apply custom fields configuration - add subtypes - non extendable types not allowed', async done => {

        Object.assign(registeredTypes1, {});

        const customFieldsConfiguration = {
            'Extension:0': { parent: 'Place', fields: { fieldC1: { inputType: 'boolean'}}}
        };

        applyConfig(customFieldsConfiguration);

        try {
            await configLoader.go('', {}, { Place: { fields: { fieldA1: { inputType: 'unsignedInt' }}}},[], {},
                new PrePreprocessConfigurationValidator(), new ConfigurationValidator(),
                undefined, 'de'
            );
            fail();

        } catch(err) {
            expect(err).toEqual([[ConfigurationErrors.NOT_AN_EXTENDABLE_TYPE, 'Place']]);
        } finally {
            done();
        }
    });


    it('apply order configuration', async done => {

        Object.assign(registeredTypes1, {
            'B:0': { parent: 'Parent', fields: { fieldB2: {}, fieldB3: {}, fieldB1: {} } },
            'C:0': { parent: 'Parent', fields: { fieldC1: {}, fieldC2: {} } },
            'A:0': { parent: 'Parent', fields: { fieldA2: {}, fieldA1: {} } }
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
            pconf = await configLoader.go('', {},{ Parent: { fields: {} }}, [], {},
                new PrePreprocessConfigurationValidator(),
                new ConfigurationValidator(), undefined, 'de'
            );

            expect(pconf.getTypesList()[0].name).toEqual('A');
            expect(pconf.getTypesList()[0].fields[2].name).toEqual('fieldA1');
            expect(pconf.getTypesList()[0].fields[3].name).toEqual('fieldA2');
            expect(pconf.getTypesList()[1].name).toEqual('B');
            expect(pconf.getTypesList()[1].fields[2].name).toEqual('fieldB1');
            expect(pconf.getTypesList()[1].fields[3].name).toEqual('fieldB2');
            expect(pconf.getTypesList()[1].fields[4].name).toEqual('fieldB3');
            expect(pconf.getTypesList()[2].name).toEqual('C');
            expect(pconf.getTypesList()[2].fields[2].name).toEqual('fieldC1');
            expect(pconf.getTypesList()[2].fields[3].name).toEqual('fieldC2');

            done();
        } catch(err) {
            fail(err);
            done();
        }
    });


    it('add types and fields only once even if they are mentioned multiple times in order configuration',
        async done => {

        Object.assign(registeredTypes1, {
            'A:0': { parent: 'Parent', fields: { fieldA2: {}, fieldA1: {} } }
        });

        applyConfig({}, {}, {}, {}, {}, {
            types: ['A', 'A'],
            fields: {
                'A': ['fieldA1', 'fieldA2', 'fieldA1']
            }
        });

        let pconf;
        try {
            pconf = await configLoader.go('', {},{ Parent: { fields: {} }}, [], {},
                new PrePreprocessConfigurationValidator(),
                new ConfigurationValidator(), undefined, 'de'
            );

            expect(pconf.getTypesList().length).toBe(2);
            expect(pconf.getTypesList()[0].fields.length).toBe(4);  // fieldA1, fieldA2, id, type
            expect(pconf.getTypesList()[0].fields[2].name).toEqual('fieldA1');
            expect(pconf.getTypesList()[0].fields[3].name).toEqual('fieldA2');

            done();
        } catch(err) {
            fail(err);
            done();
        }
    });


    it('apply hidden configurations', async done => {

        Object.assign(registeredTypes1, {
            'A:0': { derives: 'A', fields: { fieldA1: {}, fieldA2: {}, fieldA3: {}  } }
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
            pconf = await configLoader.go('', {}, { A: { fields: {} }}, [], {},
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

        Object.assign(registeredTypes1, {
            'A:0': { derives: 'A', fields: { fieldA1: {}, fieldA3: {}, fieldA2: {} } }
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
            pconf = await configLoader.go('', {},{ A: { fields: {}}}, [], {},
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