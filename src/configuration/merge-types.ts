import {BuiltinFieldDefinition, BuiltinTypeDefinitions} from './model/builtin-type-definition';
import {LibraryFieldDefinition, LibraryTypeDefinition,
    LibraryTypeDefinitions} from './model/library-type-definition';
import {CustomTypeDefinition, CustomTypeDefinitions} from './model/custom-type-definition';
import {clone, compose, filter, flow, forEach, is, isDefined, isnt, jsonClone, keysAndValues, map,
    on, reduce, to, union} from 'tsfun';
import {ConfigurationErrors} from './configuration-errors';
import {FieldDefinition} from './model/field-definition';
import {BaseTypeDefinitions} from './model/base-type-definition';


interface TransientTypeDefinition
    extends BuiltinFieldDefinition, LibraryTypeDefinition {

    fields: TransientFieldDefinitions;
}

interface TransientFieldDefinition
    extends BuiltinFieldDefinition, LibraryFieldDefinition {

    valuelist?: any;
    visible?: boolean;
    editable?: boolean;
}

type TransientTypeDefinitions = { [typeName: string]: TransientTypeDefinition }

type TransientFieldDefinitions = { [fieldName: string]: TransientFieldDefinition };


/**
 * TODO if subtype is selected, supertype gets implicitely selected
 *
 * TODO merge parent fields into type fields at the end of the method (to make things easier, maybe process language conf before)
 *
 * TODO review which types are actually allowed to get extended (previously it was only Operation and Place which were explicitely forbidden to get extended), right now it is feature, find, image, area
 *
 * TODO throw if non existing common field referenced
 * TODO allow hide common via custom
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
 * @param commonFields
 * @param valuelistsConfiguration
 * @param extraFields
 *
 * @see ConfigurationErrors
 * @throws [DUPLICATION_IN_SELECTION, typeFamilyName]
 * @throws [MUST_HAVE_PARENT, typeName]
 * @throws [MISSING_TYPE_PROPERTY, propertyName, typeName]
 * @throws [MISSING_FIELD_PROPERTY, propertyName, typeName, fieldName]
 * @throws [MUST_NOT_SET_INPUT_TYPE, typeName, fieldName]
 * @throws [ILLEGAL_FIELD_TYPE, fieldType, fieldName]
 * @throws [TRYING_TO_SUBTYPE_A_NON_EXTENDABLE_TYPE, superTypeName]
 * @throws [ILLEGAL_FIELD_PROPERTIES, [properties]]
 * @throws [INCONSISTENT_TYPE_FAMILY, typeFamilyName, reason (, fieldName)]
 */
export function mergeTypes(builtInTypes: BuiltinTypeDefinitions,
                           libraryTypes: LibraryTypeDefinitions,
                           customTypes: CustomTypeDefinitions = {},
                           commonFields: {[fieldName: string]: any} = {},
                           valuelistsConfiguration: {[valueListName: string]: any} = {},
                           extraFields: {[extraFieldName: string]: any} = {}) {

    assertTypesAndValuelistsStructurallyValid(Object.keys(builtInTypes), libraryTypes, customTypes);
    assertSubtypingIsLegal(builtInTypes, libraryTypes);
    assertSubtypingIsLegal(builtInTypes, customTypes);
    assertNoCommonFieldInputTypeOrGroupChanges(commonFields, libraryTypes);
    assertNoCommonFieldInputTypeOrGroupChanges(commonFields, customTypes);
    assertTypeFamiliesConsistent(libraryTypes);

    const selectableTypes: TransientTypeDefinitions = mergeBuiltInWithLibraryTypes(builtInTypes, libraryTypes);
    assertInputTypesAreSet(selectableTypes, commonFields);
    assertNoDuplicationInSelection(selectableTypes, customTypes);
    const mergedTypes: TransientTypeDefinitions = mergeTheTypes(selectableTypes, customTypes as any, commonFields);

    // TODO make sure that valuelistIds are provided for certain inputTypes

    eraseUnusedTypes(mergedTypes, Object.keys(customTypes));
    hideFields(mergedTypes, customTypes);

    const typesByFamilyNames: TransientTypeDefinitions = toTypesByFamilyNames(mergedTypes);
    applyValuelistsConfiguration(typesByFamilyNames, valuelistsConfiguration);
    replaceCommonFields(typesByFamilyNames, commonFields);
    addExtraFields(typesByFamilyNames, extraFields);
    return typesByFamilyNames;
}


function assertNoDuplicationInSelection(mergedTypes: TransientTypeDefinitions, customTypes: CustomTypeDefinitions) {

    Object.keys(customTypes).reduce((selectedTypeFamilies, customTypeName) => {

        const selectedType = mergedTypes[customTypeName];
        if (!selectedType) return selectedTypeFamilies;
        if (!selectedTypeFamilies.includes(selectedType.typeFamily)) {
            return selectedTypeFamilies.concat([selectedType.typeFamily]);
        }
        throw [ConfigurationErrors.DUPLICATION_IN_SELECTION, selectedType.typeFamily];

    }, [] as string[]);
}


function assertTypeFamiliesConsistent(libraryTypes: LibraryTypeDefinitions) {

    type InputType = string;
    const collected: { [typeFamilyName: string]: { [fieldName: string]: InputType }} = {};

    Object.values(libraryTypes).forEach((libraryType: any) => {

        const typeFamily = libraryType.typeFamily;

        if (!collected[typeFamily]) collected[typeFamily] = {};

        keysAndValues(libraryType.fields).forEach(([fieldName, field]: any) => {

            const inputType = field['inputType'];

            if (collected[typeFamily][fieldName]) {
                if (collected[typeFamily][fieldName] !== inputType) {
                    throw [
                        ConfigurationErrors.INCONSISTENT_TYPE_FAMILY,
                        typeFamily,
                        'divergentInputType',
                        fieldName];
                }
            } else {
                collected[typeFamily][fieldName] = inputType;
            }
        });
    });
}


function assertNoCommonFieldInputTypeOrGroupChanges(commonFields: {[fieldName: string]: any}, types: any) {

    const commonFieldNames = Object.keys(commonFields);

    iterateOverFieldsOfTypes(types, (typeName, type, fieldName, field) => {

        if (commonFieldNames.includes(fieldName)) {
            if (field.inputType) throw [ConfigurationErrors.MUST_NOT_SET_INPUT_TYPE, typeName, fieldName];
            if (field.group) throw [ConfigurationErrors.MUST_NOT_SET_INPUT_TYPE, typeName, fieldName]; // TODO test, and make error more generic
        }
    });
}


function assertInputTypesAreSet(types: TransientTypeDefinitions, commonFields: any) {

    iterateOverFieldsOfTypes(types, (typeName, type, fieldName, field) => {
        assertInputTypePresentIfNotCommonType(commonFields, typeName, fieldName, field);
    });
}


function iterateOverFieldsOfTypes(types: BaseTypeDefinitions,
                                  f: (typeName: string, type: any, fieldName: string, field: any) => void) {

    keysAndValues(types).forEach(([typeName, type]: any) => {
        keysAndValues(type.fields).forEach(([fieldName, field]: any) => {
            f(typeName, type, fieldName, field);
        })
    });
}


function addExtraFields(configuration: TransientTypeDefinitions,
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


function _addExtraFields(typeDefinition: TransientTypeDefinition,
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


function applyValuelistsConfiguration(types: TransientTypeDefinitions,
                                      valuelistsConfiguration: {[id: string]: {values: string[]}}) {

    const processFields = compose(
        Object.values,
        filter(on('valuelistId', isDefined)),
        forEach((fd: TransientFieldDefinition) => fd.valuelist
            = Object.keys(valuelistsConfiguration[fd.valuelistId as string].values)));

    flow(types,
        Object.values,
        filter(isDefined),
        map(to('fields')),
        forEach(processFields));
}


function toTypesByFamilyNames(transientTypes: TransientTypeDefinitions): TransientTypeDefinitions {

    return reduce(
        (acc: any, [transientTypeName, transientType]) => {
            if (transientType.typeFamily) {
                acc[transientType.typeFamily] = transientType;
            } else {
                acc[transientTypeName] = transientType;
            }
            return acc;
        }
        , {})(keysAndValues(transientTypes));
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


function assertSubtypingIsLegal(builtinTypes: BuiltinTypeDefinitions,
                                types: any) {

    flow(types,
        Object.values,
        map(to('parent')),
        filter(isDefined),
        forEach((parent: any) => {
            const found = Object.keys(builtinTypes).find(is(parent));
            if (!found) throw [ConfigurationErrors.INVALID_CONFIG_PARENT_NOT_DEFINED, parent];
            const foundBuiltIn = builtinTypes[found];
            if (!foundBuiltIn.superType || !foundBuiltIn.userDefinedSubtypesAllowed) {
                throw [ConfigurationErrors.TRYING_TO_SUBTYPE_A_NON_EXTENDABLE_TYPE, parent];
            }
        }));
}


function replaceCommonFields(mergedTypes: TransientTypeDefinitions,
                             commonFields: {[fieldName: string]: any}) {

    for (let mergedType of Object.values(mergedTypes)) {

        if (!mergedType.commons) continue;

        for (let commonFieldName of mergedType.commons) {
            mergedType.fields[commonFieldName] = clone(commonFields[commonFieldName]);
        }
        delete mergedType.commons;
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
        if (!alreadyPresentInTarget) target[sourceFieldName] = source[sourceFieldName];
    }
}


function mergeFields(target: TransientFieldDefinitions,
                     source: TransientFieldDefinitions) {

    for (let sourceFieldName of Object.keys(source)) {
        let alreadyPresentInTarget = false;
        for (let targetFieldName of Object.keys(target)) {
            if (targetFieldName === sourceFieldName) alreadyPresentInTarget = true;
        }
        if (!alreadyPresentInTarget) {
            target[sourceFieldName] = source[sourceFieldName];
        } else {
            // at the moment, this is allowed for custom type fields, see also issueWarningOnFieldTypeChanges
            if (source[sourceFieldName].inputType) {
                target[sourceFieldName].inputType = source[sourceFieldName].inputType;
            }
            if (source[sourceFieldName].valuelistId) {
                target[sourceFieldName].valuelistId = source[sourceFieldName].valuelistId;
            }
        }
    }
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


function mergeBuiltInWithLibraryTypes(builtInTypes: BuiltinTypeDefinitions,
                                      libraryTypes: LibraryTypeDefinitions): TransientTypeDefinitions {

    const types: TransientTypeDefinitions = clone(builtInTypes) as unknown as TransientTypeDefinitions;
    keysAndValues(types).forEach(([typeName, type]) => type.typeFamily = typeName);

    keysAndValues(libraryTypes).forEach(([libraryTypeName, libraryType]: any) => {

        const extendedBuiltInType = builtInTypes[libraryType.typeFamily];
        if (extendedBuiltInType) {

            const newMergedType: any = jsonClone(extendedBuiltInType);
            merge(newMergedType, libraryType);
            keysAndValues(libraryType.fields).forEach(([libraryTypeFieldName, libraryTypeField]) => {
                if (extendedBuiltInType.fields[libraryTypeFieldName] && (libraryTypeField as any)['inputType']) {
                    throw [ConfigurationErrors.MUST_NOT_SET_INPUT_TYPE, libraryTypeName, libraryTypeFieldName];
                }
            });
            mergeFields(newMergedType.fields, libraryType.fields);
            types[libraryTypeName] = newMergedType;
        } else {

            if (!libraryType.parent) throw [ConfigurationErrors.MUST_HAVE_PARENT, libraryTypeName];
            types[libraryTypeName] = libraryType;
        }
    });

    return types;
}


function mergeTheTypes(selectableTypes: TransientTypeDefinitions,
                       customTypes: CustomTypeDefinitions,
                       commonFields: any) {

    const mergedTypes: TransientTypeDefinitions = clone(selectableTypes);

    const pairs = keysAndValues(customTypes);

    forEach(([customTypeName, customType]: any) => {

        const extendedType = mergedTypes[customTypeName];

        if (extendedType) {
            issueWarningOnFieldTypeChanges(customTypeName, customType, extendedType);

            const newMergedType: any = clone(extendedType);
            mergePropertiesOfType(newMergedType, customType);
            mergeFields(newMergedType.fields, customType.fields);

            mergedTypes[customTypeName] = newMergedType;
        } else {
            if (!customType.parent) throw [ConfigurationErrors.MUST_HAVE_PARENT, customTypeName];

            keysAndValues(customType.fields).forEach(([fieldName, field]: any) => {
                assertInputTypePresentIfNotCommonType(commonFields, customTypeName, fieldName, field);
            });

            mergedTypes[customTypeName] = customType;
        }
    })(pairs);

    return mergedTypes;
}

// TODO curry (bake in common fields first)
function assertInputTypePresentIfNotCommonType(commonFields: any, typeName: string, fieldName: string, field: any) {

    if (!field.inputType && !Object.keys(commonFields).includes(fieldName)) {
        throw [ConfigurationErrors.MISSING_FIELD_PROPERTY, 'inputType', typeName, fieldName];
    }
}
