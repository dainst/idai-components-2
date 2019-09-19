import {
    LibraryTypeDefinition,
    LibraryTypeDefinitions
} from "../../../../src/configuration/library-type-definition";
import {BuiltinTypeDefinitions} from "../../../../src/configuration/builtin-type-definition";
import {CustomTypeDefinitions} from "../../../../src/configuration/custom-type-definition";
import {mergeTypes} from "../../../../src/configuration/merge-processor";
import {ConfigurationErrors} from "../../../../src/configuration/configuration-errors";

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


    xit('mergeTypes - validate extension - cannot set both parent and extends in custom conf', () => {

        const builtInTypes: BuiltinTypeDefinitions = {};
        const registeredTypes: LibraryTypeDefinitions = {};
        const customTypes: CustomTypeDefinitions = {
            A: { extends: 'a', parent: 'b', fields: {} }
        };

        try {
            mergeTypes(
                builtInTypes,
                registeredTypes,
                customTypes,
                [], [], []);
        } catch (expected) {
            expect(expected[0]).toEqual('extends and parent cannot be set at the same time')
        }
    });


    xit('mergeTypes - validate extension - either custom or extends must be est', () => {

        const builtInTypes: BuiltinTypeDefinitions = {};
        const registeredTypes: LibraryTypeDefinitions = {};
        const customTypes: CustomTypeDefinitions = {
            A: { fields: {} }
        };

        try {
            mergeTypes(
                builtInTypes,
                registeredTypes,
                customTypes,
                [], [], []);
        } catch (expected) {
            expect(expected[0]).toEqual('either extends or parent must be set')
        }
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
                {}, [], [], ['B', 'B:0']);
        } catch (expected) {
            expect(expected).toEqual([ConfigurationErrors.MISSING_PROPERTY, 'description', 'B:0'])
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
                {}, [], [], ['A', 'B:0']);
        } catch (expected) {
            expect(expected).toEqual(['type field with extra keys', ['valuelist']])
        }
    });


    it('mergeTypes - duplication in selection', () => { // TODO review

        const builtInTypes = {
            B: {
                fields: {
                    field1: { group: 'stem' }
                }
            }
        } as any;

        const typeLibrary = {
            'B:0': {
                typeFamily: 'B',
                fields: {},
                creationDate: '', createdBy: '', description: {}
            }
        } as any;

        try {
            mergeTypes(builtInTypes, typeLibrary, {}, [], [], ['B:0']);
        } catch (expected) {
            expect(expected).toEqual([ConfigurationErrors.DUPLICATION_IN_SELECTION, 'B'])
        }
    });


    it('mergeTypes - hide fields', () => {

        const builtInTypes = {
            A: {
                fields: {
                    field1: {}
                }
            }
        } as any;

        const registeredTypes1 = {
            'A:0': {
                typeFamily: 'A',
                fields: {
                    field2: {}
                },
                creationDate: '', createdBy: '', description: {}
            }
        } as any;

        const result = mergeTypes(
            builtInTypes,
            registeredTypes1,
            {},
            [],
            [],
            {

                'A:0': {
                    hidden: ['field1']
                }

            });

        expect(result['A']['fields']['field1'].visible).toBe(false);
        expect(result['A']['fields']['field2'].visible).not.toBeDefined();
    });


    it('mergeTypes - missing registry id', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            A: {
                fields: {
                    field1: {group: 'stem'}
                }
            }
        };

        const registeredTypes: LibraryTypeDefinitions = {
            'B': {
                typeFamily: 'B',
                parent: 'A',
                fields: {},
                creationDate: '', createdBy: '', description: {}
            }
        };

        try {
            mergeTypes(builtInTypes, registeredTypes, {}, [], [], []);
        } catch (expected) {
            expect(expected).toEqual([ConfigurationErrors.MISSING_REGISTRY_ID, 'B'])
        }
    });


    it('mergeTypes - merge registeredTypes with builtIns', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            A: {
                fields: {
                    field1: { group: 'stem' }
                }
            }
        };

        const registeredTypes: LibraryTypeDefinitions = {
            'A:1': {
                typeFamily: 'A',
                fields: {
                    field1: { inputType: 'text' },
                    field2: { inputType: 'text' }
                }, creationDate: "", createdBy: "", description: {} }
        };

        const result = mergeTypes(builtInTypes, registeredTypes, {}, [], [], {'A:1': {hidden: []}});

        expect(result['A'].fields['field1'].inputType).toBe('text');
        expect(result['A'].fields['field1'].group).toBe('stem');
        expect(result['A'].fields['field2'].inputType).toBe('text');
    });


    it('mergeTypes - merge custom types with built-in types', () => {

        const builtInTypes: BuiltinTypeDefinitions = {
            A: {
                fields: {
                    field1: { group: 'stem' }
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

        const result = mergeTypes(builtInTypes, {}, customTypes, [], [], {'A': {hidden: []}});

        expect(result['A'].fields['field1'].inputType).toBe('text');
        expect(result['A'].fields['field1'].group).toBe('stem');
        expect(result['A'].fields['field2'].inputType).toBe('text');
    });
});