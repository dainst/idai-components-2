import {
    LibraryTypeDefinition,
    LibraryTypeDefinitions
} from '../../../../src/configuration/library-type-definition';
import {BuiltinTypeDefinitions} from '../../../../src/configuration/builtin-type-definition';
import {CustomTypeDefinitions} from '../../../../src/configuration/custom-type-definition';
import {mergeTypes} from '../../../../src/configuration/merge-types';
import {ConfigurationErrors} from '../../../../src/configuration/configuration-errors';
import {Preprocessing} from '../../../../src/configuration/preprocessing';
import {RelationDefinition} from '../../../../src/configuration/relation-definition';


describe('mergeTypes', () => {

    let configuration;
    let t1: LibraryTypeDefinition;

    beforeEach(() => {

        t1 = {
            typeFamily: 'x1',
            parent: 'x',
            description: { 'de': '' },
            createdBy: '',
            creationDate: '',
            color: 'white',
            fields: {
                'aField': {}
            }
        } as LibraryTypeDefinition;

        configuration = {
            identifier: 'test',
            types: {
                'T1': t1
            } as LibraryTypeDefinitions
        } as any;
    });


    it('field property validation - missing input type in field of builtInType type - extension of supertype', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            A: { fields: {} }
        };

        const libraryTypes: LibraryTypeDefinitions = {
            'A:0': {
                typeFamily: 'A',
                fields: { aField: {} } as any,
                creationDate: '', createdBy: '', description: {}
            },
        };

        try {
            mergeTypes(builtInTypes,
                libraryTypes,
                {}, [], [], {}, {});
        } catch (expected) {
            expect(expected).toEqual([ConfigurationErrors.MISSING_FIELD_PROPERTY, 'inputType', 'A:0', 'aField'])
        }
    });


    it('field property validation  - extension of supertype - inputType inherited from builtIn', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            A: { fields: { aField: { inputType: 'input' } } }
        };

        const libraryTypes: LibraryTypeDefinitions = {
            'A:0': {
                typeFamily: 'A',
                fields: { aField: {} } as any,
                creationDate: '', createdBy: '', description: {}
            },
        };

        const result = mergeTypes(
            builtInTypes,
            libraryTypes,
                {'A:0': { hidden: [], fields: {} }}, [], [], {}, {});

        expect(result['A'].fields['aField'].inputType).toBe('input');
    });


    it('field property validation - missing input type in field of library type - new subtype', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            A: { fields: {} }
        };

        const libraryTypes: LibraryTypeDefinitions = {
            'B:0': {
                parent: 'A',
                fields: { bField: {}} as any,
                creationDate: '', createdBy: '', description: {}
            },
        };

        try {
            mergeTypes(builtInTypes,
                libraryTypes,
                {}, [], [], {}, {});
        } catch (expected) {
            expect(expected).toEqual([ConfigurationErrors.MISSING_FIELD_PROPERTY, 'inputType', 'B:0', 'bField'])
        }
    });


    it('apply valuelistConfiguration', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            A: {
                fields: {
                    field1: { inputType: 'input' }
                }
            }
        };

        const libraryTypes: LibraryTypeDefinitions  = {
            'A:0': {
                typeFamily: 'A',
                fields: {
                    a1: {
                        inputType: 'dropdown',
                        valuelistId: '123'
                    },
                    a2: { inputType: 'input' },
                    a3: { inputType: 'input' }},
                creationDate: '',
                createdBy: '',
                description: {}
            }
        };

        const valuelistsConfiguration = {
            '123': { values: { 'one': {}, 'two': {}, 'three': {} }}
        };

        const result = mergeTypes(builtInTypes,
            libraryTypes,
            {'A:0':{ fields: {}}}, [], [], valuelistsConfiguration, {});
        expect(result['A'].fields['a1'].valuelist).toEqual(['one', 'two', 'three']);
    });


    it('mergeTypes - validate type properties - missing description', () => {

        const builtInTypes = {} as any;

        const registeredTypes1 = {
            'B:0': {
                extends: 'B',
                fields: {}
            }
        } as any;

        try {
            mergeTypes(builtInTypes,
                registeredTypes1,
                {}, [], [], {}, {});
        } catch (expected) {
            expect(expected).toEqual([ConfigurationErrors.MISSING_TYPE_PROPERTY, 'description', 'B:0'])
        }
    });


    it('mergeTypes - error type contains deprecated valuelist field', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            "A": { fields: {} }
        };

        const libraryTypes: LibraryTypeDefinitions = {
            'B:0': {
                parent: 'A',
                fields: {
                    aField: { valuelist: [] }
                } as any,
                creationDate: '', createdBy: '', description: {}
            },
        };

        try {
            mergeTypes(builtInTypes,
                libraryTypes,
                {}, [], [], {}, {});
        } catch (expected) {
            expect(expected).toEqual(['type field with extra keys', ['valuelist']])
        }
    });


    it('hide fields', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            A: {
                fields: {
                    field1: { inputType: 'input' }
                }
            }
        };

        const libraryTypes: LibraryTypeDefinitions = {
            A: {
                typeFamily: 'A',
                fields: {
                    field2: { inputType: 'input' }
                },
                creationDate: '', createdBy: '', description: {}
            }
        };

        const result = mergeTypes(
            builtInTypes,
            libraryTypes,
            {
                'A': {
                    fields: {},
                    hidden: ['field1']
                }
            },
            [],
            [],
            {},
            {});

        expect(result['A']['fields']['field1'].visible).toBe(false);
        expect(result['A']['fields']['field2'].visible).toBe(true);
    });


    it('mergeTypes - merge libraryType with builtIn', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            A: {
                fields: {
                    field1: { inputType: 'text', group: 'stem' }
                }
            }
        };

        const libraryTypes: LibraryTypeDefinitions = {
            'A:1': {
                typeFamily: 'A',
                fields: {
                    field1: { inputType: 'text' },
                    field2: { inputType: 'text' }
                },
                creationDate: "",
                createdBy: "",
                description: {} }
        };

        const result = mergeTypes(builtInTypes, libraryTypes, {'A:1': { hidden: [], fields: {} }},
            [], [], {}, {});

        expect(result['A'].fields['field1'].inputType).toBe('text');
        expect(result['A'].fields['field1'].group).toBe('stem');
        expect(result['A'].fields['field2'].inputType).toBe('text');
    });


    it('mergeTypes - merge custom types with built-in types', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            A: {
                fields: {
                    field1: { inputType: 'text', group: 'stem' }
                }
            }
        };

        const customTypes: CustomTypeDefinitions = {
            'A': {
                fields: {
                    field1: { inputType: 'text' },
                    field2: { inputType: 'text' }
                }
            }
        };

        const result = mergeTypes(builtInTypes, {}, customTypes,
            [], [], {}, {});

        expect(result['A'].fields['field1'].inputType).toBe('text');
        expect(result['A'].fields['field1'].group).toBe('stem');
        expect(result['A'].fields['field2'].inputType).toBe('text');
    });


    // there was a bug where relation was not added if one of the same name but with a different domain was configured
    xit('add an extra relation to an existing relation', () => {

        const r1: RelationDefinition = {
            name: 'R',
            domain: ['domainA'],
            range : ['rangeA']
        };

        const r2: RelationDefinition = {
            name: 'R',
            domain: ['domainB'],
            range : ['rangeA']
        };

        configuration = { identifier: 'test', types: { T1: t1 }, relations: [r1]};

        //Preprocessing.mergeTheTypes({}, configuration.types);
        //Preprocessing.addExtraFields(configuration, {});
        Preprocessing.addExtraRelations(configuration, [r2]);

        expect(configuration.relations.length).toBe(2);
    });
});