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


    it('subtypes - user defined subtype not allowed', () => {

        const builtInTypes: BuiltinTypeDefinitions = { A: { fields: {} }};
        const libraryTypes: LibraryTypeDefinitions = {
            'B:0': {
                parent: 'A',
                fields: {},
                createdBy: '',
                creationDate: '',
                description: {}
            }};

        try {
            mergeTypes(
                builtInTypes,
                libraryTypes,
                {'B:0': {fields: {}}},
                {},
                {},
                {});
            fail();
        } catch (expected) {
            expect(expected).toEqual([ConfigurationErrors.TRYING_TO_SUBTYPE_A_NON_EXTENDABLE_TYPE, 'A']);
        }
    });


    it('commons - cannot set type of common in libary types', () => {

        const builtInTypes: BuiltinTypeDefinitions = { A: { fields: {} }};
        const commonFields = { aCommon: { group: 'stem', inputType: 'input'}};
        const libraryTypes: LibraryTypeDefinitions = {
            'A:0': {
                typeFamily: 'A',
                fields: { aCommon: { inputType: 'input' } },
                createdBy: '',
                creationDate: '',
                description: {}
            }};

        try {
            mergeTypes(
                builtInTypes,
                libraryTypes,
                { 'A:0': { fields: {} } },
                commonFields,
                {},
                {});
            fail();
        } catch (expected) {
            expect(expected).toEqual([ConfigurationErrors.MUST_NOT_SET_INPUT_TYPE, 'A:0', 'aCommon']);
        }
    });


    it('commons - cannot set type of common in libary types', () => {

        const builtInTypes: BuiltinTypeDefinitions = { A: { fields: {} }};
        const commonFields = { aCommon: { group: 'stem', inputType: 'input'}};
        const customTypes: CustomTypeDefinitions = {
            'A': { fields: { aCommon: { inputType: 'text' }}}
        };

        try {
            mergeTypes(
                builtInTypes,
                {},
                customTypes,
                commonFields,
                {},
                {});
            fail();
        } catch (expected) {
            expect(expected).toEqual([ConfigurationErrors.MUST_NOT_SET_INPUT_TYPE, 'A', 'aCommon']);
        }
    });


    it('commons - mix in commons in library type', () => {

        const builtInTypes: BuiltinTypeDefinitions = { A: { fields: {} }};
        const commonFields = { aCommon: { group: 'stem', inputType: 'input'}};
        const libraryTypes: LibraryTypeDefinitions = {
            'A:0': {
                typeFamily: 'A',
                commons: ['aCommon'],
                fields: { },
                createdBy: '',
                creationDate: '',
                description: {}
            }};

        const result = mergeTypes(
            builtInTypes,
            libraryTypes,
            { 'A:0': { fields: {} } },
            commonFields,
            {},
            {});

        expect(result['A'].fields['aCommon']['group']).toBe('stem');
        expect(result['A'].fields['aCommon']['inputType']).toBe('input');
    });


    it('commons - mix in commons in custom type', () => {

        const builtInTypes: BuiltinTypeDefinitions = { A: { fields: {} }};
        const commonFields = { aCommon: { group: 'stem', inputType: 'input'}};
        const customTypes: CustomTypeDefinitions = {
            'A': {
                commons: ['aCommon'],
                fields: { }
            }};

        const result = mergeTypes(
            builtInTypes,
            {},
            customTypes,
            commonFields,
            {},
            {});

        expect(result['A'].fields['aCommon']['group']).toBe('stem');
        expect(result['A'].fields['aCommon']['inputType']).toBe('input');
    });


    it('commons - add together commons from library and custom type', () => {

        const builtInTypes: BuiltinTypeDefinitions = { A: { fields: {} }};
        const commonFields = {
            aCommon: { group: 'stem', inputType: 'input'},
            bCommon: { group: 'stem', inputType: 'input'}
        };
        const libraryTypes: LibraryTypeDefinitions = {
            'A:0': {
                typeFamily: 'A',
                commons: ['aCommon'],
                fields: { },
                createdBy: '',
                creationDate: '',
                description: {}
            }};
        const customTypes: CustomTypeDefinitions = {
            'A:0': {
                commons: ['bCommon'],
                fields: { }
            }};

        const result = mergeTypes(
            builtInTypes,
            libraryTypes,
            customTypes,
            commonFields,
            {},
            {});

        expect(result['A'].fields['aCommon']['group']).toBe('stem');
        expect(result['A'].fields['aCommon']['inputType']).toBe('input');
        expect(result['A'].fields['bCommon']['group']).toBe('stem');
        expect(result['A'].fields['bCommon']['inputType']).toBe('input');
    });


    it('field property validation - invalid input Type', () => {

        const builtInTypes: BuiltinTypeDefinitions = { A: { fields: {} }};
        const libraryTypes: LibraryTypeDefinitions = {
            'A:0': {
                typeFamily: 'A',
                fields: { aField: { inputType: 'invalid' }},
                createdBy: '',
                creationDate: '',
                description: {}
            }};

        try {
            mergeTypes(
                builtInTypes,
                libraryTypes,
                {},
                [],
                {},
                {});
            fail();
        } catch (expected) {
            expect(expected).toEqual([ConfigurationErrors.ILLEGAL_FIELD_TYPE, 'invalid', 'aField'])
        }
    });


    it('field property validation - missing input type in field of entirely new custom type', () => {

        const builtInTypes: BuiltinTypeDefinitions = { A: { fields: {}, superType: true, userDefinedSubtypesAllowed: true }};
        const libraryTypes: LibraryTypeDefinitions = {};
        const customTypes: CustomTypeDefinitions = { 'C': { parent: 'A', fields: { cField: {} }}};

        try {
            mergeTypes(
                builtInTypes,
                libraryTypes,
                customTypes,
                {},
                {},
                {});
            fail();
        } catch (expected) {
            expect(expected).toEqual([ConfigurationErrors.MISSING_FIELD_PROPERTY, 'inputType', 'C', 'cField'])
        }
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
                {},  {}, {}, {});
            fail();
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
                {'A:0': { hidden: [], fields: {} }}, {}, {}, {});

        expect(result['A'].fields['aField'].inputType).toBe('input');
    });


    it('field property validation - missing input type in field of library type - new subtype', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            A: { fields: {}, superType: true, userDefinedSubtypesAllowed: true }
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
                {}, {}, {}, {});
            fail();
        } catch (expected) {
            expect(expected).toEqual([ConfigurationErrors.MISSING_FIELD_PROPERTY, 'inputType', 'B:0', 'bField'])
        }
    });


    it('field property validation - must not set field type on inherited field', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            A: { fields: { aField: { inputType: 'input' }} }
        };

        const libraryTypes: LibraryTypeDefinitions = {
            'A:0': {
                typeFamily: 'A',
                fields: { aField: { inputType: 'input' }} as any,
                creationDate: '', createdBy: '', description: {}
            },
        };

        try {
            mergeTypes(builtInTypes,
                libraryTypes,
                {}, {}, {}, {});
            fail();
        } catch (expected) {
            expect(expected).toEqual([ConfigurationErrors.MUST_NOT_SET_INPUT_TYPE, 'A:0', 'aField'])
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
            {'A:0':{ fields: {}}}, {}, valuelistsConfiguration, {});
        expect(result['A'].fields['a1'].valuelist).toEqual(['one', 'two', 'three']);
    });


    it('validate type properties - missing description', () => {

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
                {}, {}, {}, {});
        } catch (expected) {
            expect(expected).toEqual([ConfigurationErrors.MISSING_TYPE_PROPERTY, 'description', 'B:0'])
        }
    });


    it('error type contains deprecated valuelist field', () => {

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
                {}, {}, {}, {});
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
            {},
            {},
            {});

        expect(result['A']['fields']['field1'].visible).toBe(false);
        expect(result['A']['fields']['field2'].visible).toBe(true);
    });


    it('merge libraryType with builtIn', () => {

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
                    field1: {},
                    field2: { inputType: 'text' }
                },
                creationDate: "",
                createdBy: "",
                description: {} }
        };

        const result = mergeTypes(builtInTypes, libraryTypes, {'A:1': { hidden: [], fields: {} }},
            {}, {}, {});

        expect(result['A'].fields['field1'].inputType).toBe('text');
        expect(result['A'].fields['field1'].group).toBe('stem');
        expect(result['A'].fields['field2'].inputType).toBe('text');
    });


    it('merge custom types with built-in types', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            A: {
                fields: {
                    field1: { inputType: 'text', group: 'stem' }
                }
            }
        };

        const customTypes: CustomTypeDefinitions = {
            A: {
                fields: {
                    field1: { },
                    field2: { inputType: 'text' }
                }
            }
        };

        const result = mergeTypes(builtInTypes, {}, customTypes,
            {}, {}, {});

        expect(result['A'].fields['field1'].inputType).toBe('text');
        expect(result['A'].fields['field1'].group).toBe('stem');
        expect(result['A'].fields['field2'].inputType).toBe('text');
    });


    it('merge custom types with library types', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            A: {
                fields: {
                    field1: { inputType: 'text', group: 'stem' }
                }
            }
        };

        const libraryTypes: LibraryTypeDefinitions = {
            'A:0': {
                typeFamily: 'A',
                fields: {
                    field2: { inputType: 'text' }
                },
                creationDate: '',
                createdBy: '',
                description: {} }
        };

        const customTypes: CustomTypeDefinitions = {
            'A:0': {
                fields: {
                    field2: { },
                    field3: { inputType: 'text' }
                }
            }
        };

        const result = mergeTypes(builtInTypes, libraryTypes, customTypes,
            {}, {}, {});

        expect(result['A'].fields['field1'].inputType).toBe('text');
        expect(result['A'].fields['field2'].inputType).toBe('text');
        expect(result['A'].fields['field3'].inputType).toBe('text');
    });


    // there was a bug where relation was not added if one of the same name but with a different domain was configured
    xit('add an extra relation to an existing relation', () => {

        const t1 = {
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

        const configuration = { identifier: 'test', types: { T1: t1 }, relations: [r1]} as any;

        //Preprocessing.mergeTheTypes({}, configuration.types);
        //Preprocessing.addExtraFields(configuration, {});
        Preprocessing.addExtraRelations(configuration, [r2]);

        expect(configuration.relations.length).toBe(2);
    });
});