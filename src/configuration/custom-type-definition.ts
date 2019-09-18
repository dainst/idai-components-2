import {cond, empty, flow, forEach, identity, includedIn, isNot, map, remove} from "tsfun";

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

        if (!type.fields) throw ['type has not fields', type];
        assertFieldsAreValid(type.fields);
    }


    function assertFieldsAreValid(fields: CustomFieldDefinitions) { // TODO remove duplication

        flow(
            fields,
            Object.values,
            map(Object.keys),
            map(remove(includedIn(['valuelistId', 'inputType', 'positionValues']))),
            forEach(
                cond(isNot(empty),
                    (keys: string) => { throw ['type field with extra keys', keys]},
                    identity))); // TODO replace with nop
    }
}