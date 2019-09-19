import {
    LibraryTypeDefinition,
    LibraryTypeDefinitions
} from "../../../../src/configuration/library-type-definition";
import {
    BuiltinTypeDefinition,
    BuiltinTypeDefinitions
} from "../../../../src/configuration/builtin-type-definition";
import {CustomTypeDefinitions} from "../../../../src/configuration/custom-type-definition";
import {mergeTypes} from "../../../../src/configuration/merge-types";
import {ConfigurationErrors} from "../../../../src/configuration/configuration-errors";
import {Preprocessing} from "../../../../src/configuration/preprocessing";
import {FieldDefinition} from "../../../../src/configuration/field-definition";
import {TypeDefinition} from "../../../../src/configuration/type-definition";
import {RelationDefinition} from "../../../../src/configuration/relation-definition";

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


    xit('should add extra type', () => {

        const builtInTypes = {
            T2: {
                fields: {
                    bField: {}
                }
            } as BuiltinTypeDefinition
        };

        // Preprocessing.mergeTheTypes(builtInTypes, configuration.types);
        expect(builtInTypes['T2'].fields['bField']).toBeDefined();
    });


    xit('should add an extra field to an extra type', () => {

        let builtinTypes = {
            T2: {
                fields: {
                    bField: {}
                }
            } as BuiltinTypeDefinition
        };

        // Preprocessing.mergeTheTypes(builtinTypes, configuration.types);
        builtinTypes = { types: builtinTypes } as any;

        Preprocessing.addExtraFields(builtinTypes as any, { identifier: {} as FieldDefinition });

        expect((builtinTypes as any).types['T2'].fields['identifier']).toBeDefined();
        expect((builtinTypes as any).types['T2'].fields['bField']).toBeDefined();
    });


    xit('merge fields of built in type with libary type', () => {

        const builtinTypes = {
            T1: {
                abstract: true,
                fields: {
                    bField: {}
                }
            } as BuiltinTypeDefinition
        };

        const configuration: LibraryTypeDefinitions = {
            T1: {
                color: 'white',
                fields: {aField: {}},
                description: {},
                creationDate: "",
                createdBy: ""
            }
        };

        // Preprocessing.mergeTheTypes(builtinTypes, configuration);

        expect((builtinTypes['T1'] as any).abstract).toBeTruthy();
        expect((builtinTypes['T1'] as any).color).toEqual('white');
        expect((builtinTypes['T1'] as any).fields['aField']).toBeDefined();
        expect((builtinTypes['T1'] as any).fields['bField']).toBeDefined();
    });


    xit('merge fields of extra type with existing type and add extra field', () => {

        const builtinTypes = {
            T1: {
                fields: {
                    bField: {}
                }
            } as BuiltinTypeDefinition
        };

        const configuration = {
            'T1': {
                color: 'white',
                fields: {aField: {}}
            }
        } as any;

        // Preprocessing.mergeTheTypes(builtinTypes, configuration);

        const appConfiguration = { types: builtinTypes };
        Preprocessing.addExtraFields(appConfiguration as any, { 'identifier': {} as FieldDefinition });

        expect(appConfiguration.types['T1'].fields['aField']).toBeDefined();
        expect(appConfiguration.types['T1'].fields['bField']).toBeDefined();
        expect(appConfiguration.types['T1'].fields['identifier']).toBeDefined();
    });


    xit('should not add extra fields to subtypes', () => {

        const t: TypeDefinition = {
            parent: 'SuperT',
            fields: {
                aField: {}
            }
        } as TypeDefinition;

        configuration = {
            identifier: 'test',
            types: {
                T1: t
            },
            relations: []
        };

        // Preprocessing.mergeTheTypes({}, configuration.types);
        Preprocessing.addExtraFields(configuration, { 'identifier': {} as FieldDefinition });

        expect(configuration.types['T1'].fields['aField']).toBeDefined();
        expect(configuration.types['T1'].fields['identifier']).toBeUndefined();
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
        Preprocessing.addExtraFields(configuration, {});
        Preprocessing.addExtraRelations(configuration, [r2]);

        expect(configuration.relations.length).toBe(2);
    });
});