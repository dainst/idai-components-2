import {BuiltinTypeDefinitions} from './builtin-type-definition';
import {LibraryTypeDefinition, LibraryTypeDefinitions} from './library-type-definition';
import {CustomTypeDefinition, CustomTypeDefinitions} from './custom-type-definition';
import {clone, compose, filter, flow, forEach, is, isDefined, isnt, union,
    jsonClone, keysAndValues, lookup, map, on, reduce, to} from 'tsfun';
import {ConfigurationErrors} from './configuration-errors';
import {TypeDefinition} from './type-definition';
import {FieldDefinition} from './field-definition';


// TODO make a ts type for errors
// TODO use terms resources-db and config-db. add the config-db and store the Config-(project).json files there

/**
 * TODO merge parent fields into type fields at the end of the method (to make things easier, maybe process language conf before)
 * TODO throw DUPLICATION_IN_SELECTION if more than one of type family selected
 * TODO merge common fields incrementally
 * TODO make sure group gets not re-set
 * TODO make nonExtendable a property of builtInTypes
 * TODO throw if non existing common field referenced
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
 * @param valuelistsConfiguration
 * @param extraFields
 *
 * @see ConfigurationErrors
 * @throws [DUPLICATION_IN_SELECTION, typeName]
 * @throws [MUST_HAVE_PARENT, typeName]
 * @throws [MISSING_TYPE_PROPERTY, propertyName, typeName]
 * @throws [MISSING_FIELD_PROPERTY, propertyName, typeName, fieldName]
 * @throws [MUST_NOT_SET_INPUT_TYPE, typeName, fieldName]
 * @throws [ILLEGAL_FIELD_TYPE, fieldType, fieldName]
 */
export function mergeTypes(builtInTypes: BuiltinTypeDefinitions,
                           libraryTypes: LibraryTypeDefinitions,
                           customTypes: CustomTypeDefinitions,
                           nonExtendableTypes: any,
                           commonFields: {[fieldName: string]: any},
                           valuelistsConfiguration: any,
                           extraFields: any) {

    assertTypesAndValuelistsStructurallyValid(Object.keys(builtInTypes), libraryTypes, customTypes);
    validateParentsOnTypes(builtInTypes, {...libraryTypes, ...customTypes}, nonExtendableTypes);

    const mergedTypes = mergeBuiltInWithLibraryTypes(builtInTypes, libraryTypes);
    validateFields(mergedTypes);
    mergeTheTypes(mergedTypes, customTypes as any);

    // TODO make sure that valuelistIds are provided for certain inputTypes

    eraseUnusedTypes(mergedTypes, Object.keys(customTypes));
    hideFields(mergedTypes, customTypes);

    const typesByFamilyNames: any = toTypesByFamilyNames(mergedTypes);
    applyValuelistsConfiguration(typesByFamilyNames, valuelistsConfiguration);
    replaceCommonFields(typesByFamilyNames, commonFields);
    addExtraFields(typesByFamilyNames, extraFields);
    return typesByFamilyNames;
}


function validateFields(types: any) {

    keysAndValues(types).forEach(([typeName, type]: any) => {
        keysAndValues(type.fields).forEach(([fieldName, field]:any) => {
            if (!field.inputType) throw [ConfigurationErrors.MISSING_FIELD_PROPERTY, 'inputType', typeName, fieldName]
        })
    });
}


function addExtraFields(configuration: any,
                        extraFields: {[fieldName: string]: FieldDefinition }) {

    for (let typeName of Object.keys(configuration)) {
        const typeDefinition = configuration[typeName];

        if (!typeDefinition.fields) typeDefinition.fields = {};

        if (typeDefinition.parent == undefined) {
            _addExtraFields(typeDefinition, extraFields)
        }

        for (let fieldName of Object.keys(typeDefinition.fields)) {
            const fieldDefinition = typeDefinition.fields[fieldName];

            if (fieldDefinition.editable == undefined) fieldDefinition.editable = true;
            if (fieldDefinition.visible == undefined) fieldDefinition.visible = true;
        }
    }
}


function _addExtraFields(typeDefinition: TypeDefinition,
                         extraFields: {[fieldName: string]: FieldDefinition }) {

    for (let extraFieldName of Object.keys(extraFields)) {
        let fieldAlreadyPresent = false;

        for (let fieldName of Object.keys(typeDefinition.fields)) {
            if (fieldName === extraFieldName) fieldAlreadyPresent = true;
        }

        if (!fieldAlreadyPresent) {
            typeDefinition.fields[extraFieldName] = Object.assign({}, extraFields[extraFieldName]);
        }
    }
}


function applyValuelistsConfiguration(types: { [typeName: string]: TypeDefinition },
                                      valuelistsConfiguration: {[id: string]: {values: string[]}}) {

    const processFields = compose(
        Object.values,
        filter(on('valuelistId', isDefined)),
        forEach((fd: FieldDefinition) => (fd as any)['valuelist']
            = Object.keys(valuelistsConfiguration[
            (fd as any)['valuelistId']
            ].values)));

    flow(types,
        Object.values,
        filter(isDefined),
        map(to('fields')),
        forEach(processFields));
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


function replaceCommonFields(mergedTypes: any, commonFields: {[fieldName: string]: any}) {

    for (let mergedType of Object.values(mergedTypes)) {

        if (!mergedType['commons']) continue;

        for (let commonFieldName of mergedType['commons']) {
            mergedType['fields'][commonFieldName] = clone(commonFields[commonFieldName]);
        }
        delete mergedType['commons'];
    }
}


/**
 * excluding fields
 *
 * @param target
 * @param source
 */
function mergePropertiesOfType(target: any, source: any) {

    if (source['commons']) {
        target['commons'] = union([target['commons'] ? target['commons'] : [], source['commons']]);
    }

    Object.keys(source)
        .filter(isnt('fields'))
        .forEach(sourceTypeProp => {
            if (!Object.keys(target).includes(sourceTypeProp)) {
                target[sourceTypeProp] = source[sourceTypeProp];
            }
        });
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

            const extendedBuiltInType = builtInTypes[libraryType.typeFamily];
            if (extendedBuiltInType) {

                const newMergedType: any = jsonClone(extendedBuiltInType);
                merge(newMergedType, libraryType);
                keysAndValues(libraryType.fields).forEach(([libraryTypeFieldName, libraryTypeField]: any) => {
                    if (extendedBuiltInType.fields[libraryTypeFieldName] && libraryTypeField['inputType']) {
                        throw [ConfigurationErrors.MUST_NOT_SET_INPUT_TYPE, libraryTypeName, libraryTypeFieldName];
                    }
                });
                merge(newMergedType.fields, libraryType.fields);
                types[libraryTypeName] = newMergedType;
            } else {

                if (!libraryType.parent) throw [ConfigurationErrors.MUST_HAVE_PARENT, libraryTypeName];
                types[libraryTypeName] = libraryType;
            }
        }));

    return types;
}


/**
 * TODO can be taken out as soon as custom fields get stored separately in resources db
 *
 * @param customTypeName
 * @param customType
 * @param extendedType
 */
function issueWarningOnFieldTypeChanges(customTypeName: string, customType: any, extendedType: any) {

    keysAndValues(customType.fields).forEach(([customTypeFieldName, customTypeField]: any) => {

        const existingField = extendedType.fields[customTypeFieldName];

        if (existingField
            && existingField.inputType
            && customTypeField.inputType
            && customTypeField.inputType !== existingField.inputType) {

            console.warn('change of input type detected', customTypeName, customTypeFieldName);
        }
    });
}


function mergeTheTypes(typeDefs: any,
                       customTypes: CustomTypeDefinitions) {

    const pairs = keysAndValues(customTypes);

    forEach(([customTypeName, customType]: any) => {

        const extendedType = typeDefs[customTypeName];

        if (extendedType) {
            issueWarningOnFieldTypeChanges(customTypeName, customType, extendedType);

            const newMergedType: any = jsonClone(extendedType);
            mergePropertiesOfType(newMergedType, customType);
            merge(newMergedType.fields, customType.fields);

            typeDefs[customTypeName] = newMergedType;
        } else {
            if (!customType.parent) throw [ConfigurationErrors.MUST_HAVE_PARENT, customTypeName];

            keysAndValues(customType.fields).forEach(([fieldName, field]: any) => {
                if (!field.inputType) throw [ConfigurationErrors.MISSING_FIELD_PROPERTY, 'inputType', customTypeName, fieldName];
            });

            typeDefs[customTypeName] = customType;
        }
    })(pairs);
}
