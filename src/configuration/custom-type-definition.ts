import {cond, empty, flow, forEach, identity, includedIn, isNot, map, remove} from "tsfun";
import {assertFieldsAreValid} from "./util";
import {ConfigurationErrors} from "./configuration-errors";

/**
 * TypeDefinition, as provided by users.
 *
 * @author Daniel de Oliveira
 */
export interface CustomTypeDefinition {

    color?: string,
    hidden?: string[];
    parent?: string,
    fields: CustomFieldDefinitions;
}


export type CustomFieldDefinitions = { [fieldName: string]: CustomFieldDefinition };


export interface CustomFieldDefinition {

    valuelistId?: string;
    inputType?: string;
    positionValues?: string; // TODO review
}


export type CustomTypeDefinitions = {[typeName: string]: CustomTypeDefinition };


export module CustomTypeDefinition {

    export function makeAssertIsValid(builtinTypes: string[], libraryTypes: string[]) {

        return function assertIsValid([typeName, type]: [string, CustomTypeDefinition]) {

            if (!builtinTypes.includes(typeName) && !libraryTypes.includes(typeName)) {
                if (!type.parent) throw [ConfigurationErrors.MISSING_TYPE_PROPERTY, 'parent', typeName];
            }

            if (!type.fields) throw [ConfigurationErrors.MISSING_TYPE_PROPERTY, 'fields', type];
            assertFieldsAreValid(type.fields);
        }
    }

}