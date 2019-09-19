import {BuiltinTypeDefinitions} from "./builtin-type-definition";
import {LibraryTypeDefinition, LibraryTypeDefinitions} from "./library-type-definition";
import {CustomTypeDefinition, CustomTypeDefinitions} from "./custom-type-definition";
import {clone, filter, flow, forEach, is, isDefined, reduce,
    jsonClone, keysAndValues, lookup, map, to} from "tsfun";
import {ConfigurationErrors} from "./configuration-errors";


/**
 * TODO throw DUPLICATION_IN_SELECTION if more than one of type family selected
 * TODO merge common fields incrementally
 *
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 *
 * Does
 * - merge the builtin, library and custom types
 * - replace common fields
 *
 * Does not
 * - mix in parent type
 * - mix in language, order, search
 *
 * @param builtInTypes
 * @param libraryTypes
 * @param customTypes
 * @param nonExtendableTypes
 * @param commonFields
 * @param selectedTypes
 *
 * @see ConfigurationErrors
 * @throws [DUPLICATION_IN_SELECTION, typeName]
 * @throws [MUST_HAVE_PARENT, typeName]
 * @throws [MISSING_PROPERTY, propertyName, typeName]
 */
export function mergeTypes(builtInTypes: BuiltinTypeDefinitions,
                           libraryTypes: LibraryTypeDefinitions,
                           customTypes: CustomTypeDefinitions,
                           nonExtendableTypes: any,
                           commonFields: any,
                           selectedTypes: any) {

    assertTypesAndValuelistsStructurallyValid(Object.keys(builtInTypes), libraryTypes, customTypes);
    validateParentsOnTypes(builtInTypes, {...libraryTypes, ...customTypes}, nonExtendableTypes);

    const mergedTypes = mergeBuiltInWithLibraryTypes(builtInTypes, libraryTypes);
    mergeTheTypes(mergedTypes, customTypes as any);

    eraseUnusedTypes(mergedTypes, Object.keys(selectedTypes));
    hideFields(mergedTypes, selectedTypes);

    const typesByFamilyNames: any = toTypesByFamilyNames(mergedTypes);
    replaceCommonFields(typesByFamilyNames, commonFields);
    return typesByFamilyNames;
}


function toTypesByFamilyNames(mergedTypes: any) {

    return reduce(
        (acc: any, [mergedTypeName, mergedType]: any) => {
            if (mergedType.typeFamily) {
                acc[mergedType.typeFamily] = mergedType;
            } else {
                acc[mergedTypeName] = mergedType;
            }
            return acc;
        }
        , {})(keysAndValues(mergedTypes) as any);
}


function assertTypesAndValuelistsStructurallyValid(
    builtInTypes: string[],
    libraryTypes: LibraryTypeDefinitions,
    customTypes: CustomTypeDefinitions) {

    const assertLibraryTypeValid = LibraryTypeDefinition.makeAssertIsValid(builtInTypes);
    const assertCustomTypeValid = CustomTypeDefinition.makeAssertIsValid(builtInTypes, Object.keys(libraryTypes));

    keysAndValues(libraryTypes).forEach(assertLibraryTypeValid);
    keysAndValues(customTypes).forEach(assertCustomTypeValid);
}


function hideFields(mergedTypes: any, selectedTypes: any) {

    keysAndValues(mergedTypes).forEach(([builtInTypeName, builtInType]) => {

        keysAndValues(selectedTypes).forEach(([selectedTypeName, selectedType]) => {
            if (selectedTypeName === builtInTypeName) {

                if ((builtInType as any)['fields']) Object.keys((builtInType as any)['fields']).forEach(fn => {
                    if ((selectedType as any)['hidden'] && (selectedType as any)['hidden'].includes(fn)) {
                        (builtInType as any)['fields'][fn].visible = false;
                        (builtInType as any)['fields'][fn].editable = false;
                    }
                })
            }
        })
    });
}


function eraseUnusedTypes(builtInTypes: any,
                          selectedTypes: string[]) {

    Object.keys(builtInTypes).forEach(typeName => {
        if (!selectedTypes.includes(typeName)) delete builtInTypes[typeName];
    });
}


function validateParentsOnTypes(builtinTypes: BuiltinTypeDefinitions,
                                types: any,
                                nonExtendableTypes: string[]) {

    flow(types,
        Object.keys,
        map(lookup(types)),
        map(to('parent')),
        filter(isDefined),
        forEach((parent: string) => {
            if (nonExtendableTypes.includes(parent as string)) {
                throw [ConfigurationErrors.NOT_AN_EXTENDABLE_TYPE, parent];
            }
            return parent;
        }),
        forEach((parent: any) => {
            const found = Object.keys(builtinTypes).find(is(parent));
            if (!found) throw [ConfigurationErrors.INVALID_CONFIG_PARENT_NOT_DEFINED, parent];
        }));
}


function replaceCommonFields(builtInTypes: BuiltinTypeDefinitions, commonFields: any) {

    if (!builtInTypes) return;

    for (let confTypeName of Object.keys(builtInTypes)) {
        if ((builtInTypes[confTypeName] as any)['commons']) {
            for (let commonFieldName of ((builtInTypes[confTypeName] as any)['commons'])) {
                if (!(builtInTypes[confTypeName] as any)['fields']) {
                    (builtInTypes[confTypeName] as any)['fields'] = {};
                }
                (builtInTypes[confTypeName] as any)['fields'][commonFieldName]
                    = clone(commonFields[commonFieldName]);

                //console.log(commonFields[commonFieldName])
            }

            delete (builtInTypes[confTypeName] as any)['commons'];
        }
    }
}


function merge(target: any, source: any) {

    for (let sourceFieldName of Object.keys(source)) {
        if (sourceFieldName === 'fields') continue;

        let alreadyPresentInTarget = false;

        for (let targetFieldName of Object.keys(target)) {
            if (targetFieldName === sourceFieldName) alreadyPresentInTarget = true;
        }

        if (!alreadyPresentInTarget) {
            target[sourceFieldName] = source[sourceFieldName];
        } else {

            // TODO hack; later we want only valuelistId to be changable
            if (source[sourceFieldName]['inputType']) {
                target[sourceFieldName]['inputType'] = source[sourceFieldName]['inputType'];
            }
            if (source[sourceFieldName]['valuelist']) {
                target[sourceFieldName]['valuelist'] = source[sourceFieldName]['valuelist'];
            }
            if (source[sourceFieldName]['valuelistId']) {
                target[sourceFieldName]['valuelistId'] = source[sourceFieldName]['valuelistId'];
            }
        }
    }
}


function mergeBuiltInWithLibraryTypes(builtInTypes: BuiltinTypeDefinitions,
                                             libraryTypes: LibraryTypeDefinitions) {

    const types: any = {...builtInTypes};

    flow<any>(
        libraryTypes,
        keysAndValues,
        forEach(([libraryTypeName, libraryType]: any) => {
            if (builtInTypes[libraryType.typeFamily]) {
                const newMergedType: any = jsonClone(builtInTypes[libraryType.typeFamily]);

                merge(newMergedType, libraryType);
                merge(newMergedType.fields, libraryType.fields);

                types[libraryTypeName] = newMergedType;
            } else {
                if (!libraryType.parent) throw [ConfigurationErrors.MUST_HAVE_PARENT, libraryTypeName];
                types[libraryTypeName] = libraryType;
            }
        }));

    return types;
}


function mergeTheTypes(typeDefs: any,
                       customTypes: CustomTypeDefinitions) {

    const pairs = keysAndValues(customTypes);

    forEach(([customTypeName, customType]: any) => {
        if (typeDefs[customTypeName]) {

            const newMergedType: any = jsonClone(typeDefs[customTypeName]);
            merge(newMergedType, customType);
            merge(newMergedType.fields, customType.fields);

            typeDefs[customTypeName] = newMergedType;
        } else {
            if (!customType.parent) throw [ConfigurationErrors.MUST_HAVE_PARENT, customTypeName];
            typeDefs[customTypeName] = customType;
        }
    })(pairs);
}