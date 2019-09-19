import {cond, empty, flow, forEach, identity, includedIn, isNot, map, remove} from "tsfun";
import {assertFieldsAreValid} from "./util";

/**
 * TypeDefinition, as provided by users.
 *
 * @author Daniel de Oliveira
 */
export interface CustomTypeDefinition {

    color?: string,

    // a custom type either either extends a registered type
    extends?: string;
    // or it is a new type, which must be subtyped to a built-in type
    parent?: string,

    // TODO validate the given rule


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

    export function assertIsValid(type:CustomTypeDefinition) {
        // TODO test that it only has valid fields
        // if (type.extends && type.parent) throw ['extends and parent cannot be set at the same time'];
        // if (!type.extends && !type.parent) throw ['either extends or parent must be set'];

        if (!type.fields) throw ['type has not fields', type];
        assertFieldsAreValid(type.fields);
    }
}