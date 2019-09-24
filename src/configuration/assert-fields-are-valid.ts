import {cond, empty, flow, forEach, includedIn, isNot, map, remove, to, keysAndValues, isDefined} from 'tsfun';
import {ConfigurationErrors} from './configuration-errors';
import {CustomFieldDefinitions} from "./model/custom-type-definition";
import {LibraryFieldDefinitions} from "./model/library-type-definition";


const VALID_INPUT_TYPES = [
    'input', 'text', 'dropdown', 'dropdownRange', 'radio', 'checkboxes', 'unsignedInt', 'float',
    'unsignedFloat', 'dating', 'dimension', 'boolean', 'date'
];


export function assertFieldsAreValid(fields: LibraryFieldDefinitions|CustomFieldDefinitions,
                                     validFieldKeys: string[],
                                     source: 'custom'|'library') {

    assertInputTypesAreValid(fields);
    assertFieldKeysAreValid(fields, validFieldKeys, source);
}


function assertInputTypesAreValid(fields: LibraryFieldDefinitions|CustomFieldDefinitions) {

    keysAndValues(fields)
        .filter(([_, field]) => isDefined(field.inputType)) // TODO it would be super nice if i could write on('[1].inputType', isDefined)
        .filter(([_, field]) => !VALID_INPUT_TYPES.includes(field.inputType as string))
        .forEach(([fieldName, field]: any) => {
            throw [ConfigurationErrors.ILLEGAL_FIELD_INPUT_TYPE, field.inputType, fieldName];
        });
}


function assertFieldKeysAreValid(fields: LibraryFieldDefinitions|CustomFieldDefinitions,
                                 validFieldKeys: string[],
                                 source: 'custom'|'library') {

    function throwIllegalFieldProperty(keys: string) {

        throw [ConfigurationErrors.ILLEGAL_FIELD_PROPERTY, source, keys[0]]
    }

    const throwIllegalFieldPropertyIfNotEmpty = cond(isNot(empty), throwIllegalFieldProperty);

    flow(
        fields,
        Object.values,
        map(Object.keys),
        map(remove(includedIn(validFieldKeys))),
        forEach(throwIllegalFieldPropertyIfNotEmpty));
}