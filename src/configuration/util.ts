import {cond, empty, flow, forEach, identity, includedIn, isNot, map, remove, to, filter, isDefined} from "tsfun";
import {keysAndValues} from "tsfun/src/objectcoll";
import {ConfigurationErrors} from "./configuration-errors";

const VALID_FIELD_KEYS = ['valuelistId', 'inputType', 'positionValues'];

const VALID_INPUT_TYPES = [
    'input', 'text', 'dropdown', 'dropdownRange', 'radio', 'checkboxes', 'unsignedInt', 'float',
    'unsignedFloat', 'dating', 'dimension', 'boolean', 'date'
];


export function assertFieldsAreValid(fields: any /* TODO improve on typing */) {

    // validate input types
    keysAndValues(fields).forEach(([fieldName, field]: any) => {
        if (!field.inputType) return;
        if (!VALID_INPUT_TYPES.includes(field.inputType)) {
            throw [ConfigurationErrors.ILLEGAL_FIELD_TYPE, field.inputType, fieldName];
        }
    });

    // validate field keys
    flow(
        fields,
        Object.values,
        map(Object.keys),
        map(remove(includedIn(VALID_FIELD_KEYS))),
        forEach(
            cond(isNot(empty),
                (keys: string) => { throw [ConfigurationErrors.ILLEGAL_FIELD_PROPERTIES, keys]},
                identity))); // TODO replace with nop
}