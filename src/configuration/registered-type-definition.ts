import {remove, includedIn, flow, map, forEach, cond, identity, isNot, empty} from 'tsfun';

/**
 * TypeDefinition, as used in TypeRegistry
 *
 * @author Daniel de Oliveira
 */
export interface RegisteredTypeDefinition {

    color?: string,
    parent: string,
    extends?: string;
    description: {[language: string]: string},
    createdBy: string,
    creationDate: string;
    fields: RegisteredFieldDefinitions;
}

export type RegisteredTypeDefinitions = {[typeName: string]: RegisteredTypeDefinition };


export interface RegisteredFieldDefinition {

    valuelistId?: string;
    inputType?: string;
    positionValues?: string; // TODO review
}


export type RegisteredFieldDefinitions = { [fieldName: string]: RegisteredFieldDefinition };


export function len<A>(as: Array<A>) {

    return as.length;
}


export module RegisteredTypeDefinition {
    
    export function assertIsValid(type: RegisteredTypeDefinition) {

        if (!type.description) throw ['type has no description', JSON.stringify(type)];
        if (type.creationDate === undefined) throw ['type has no creationDate', JSON.stringify(type)];
        if (type.createdBy === undefined) throw ['type has no createdBy', JSON.stringify(type)];

        if (!type.fields) throw ['type has not fields', type];
        assertFieldsAreValid(type.fields);
    }


    function assertFieldsAreValid(fields: RegisteredFieldDefinitions) {

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