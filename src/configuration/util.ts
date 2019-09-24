import {cond, empty, flow, forEach, identity, includedIn, isNot, map, remove, to} from 'tsfun';
import {keysAndValues} from 'tsfun';
import {ConfigurationErrors} from './configuration-errors';
import {CustomFieldDefinitions} from "./model/custom-type-definition";
import {LibraryFieldDefinitions} from "./model/library-type-definition";

const VALID_INPUT_TYPES = [
    'input', 'text', 'dropdown', 'dropdownRange', 'radio', 'checkboxes', 'unsignedInt', 'float',
    'unsignedFloat', 'dating', 'dimension', 'boolean', 'date'
];


export function assertFieldsAreValid(fields: CustomFieldDefinitions|LibraryFieldDefinitions,
                                     validFieldKeys: string[],
                                     libraryType: 'custom'|'library') {

    // validate input types
    keysAndValues(fields).forEach(([fieldName, field]: any) => {
        if (!field.inputType) return;
        if (!VALID_INPUT_TYPES.includes(field.inputType)) {
            throw [ConfigurationErrors.ILLEGAL_FIELD_INPUT_TYPE, field.inputType, fieldName];
        }
    });

    // validate field keys
    flow(
        fields,
        Object.values,
        map(Object.keys),
        map(remove(includedIn(validFieldKeys))),
        forEach(
            cond(isNot(empty),
                (keys: string) => { throw [ConfigurationErrors.ILLEGAL_FIELD_PROPERTY, libraryType, keys[0]]},
                identity))); // TODO replace with nop
}