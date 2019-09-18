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
    createdBy: string
    fields: {[fieldName: string]: RegisteredFieldDefinition};
}

export type RegisteredTypeDefinitions = {[typeName: string]: RegisteredTypeDefinition };


export interface RegisteredFieldDefinition {

    valuelistId?: string;
    inputType?: string;
}


export function len<A>(as: Array<A>) {

    return as.length;
}


export module RegisteredTypeDefinition {
    
    export function assertIsValid(type: RegisteredTypeDefinition) {
        
        if (!type.fields) throw ['type has not fields', type];

        flow(
            type.fields,
            Object.values,
            map(Object.keys),
            map(remove(includedIn(['valuelistId', 'inputType']))),
            forEach(
                cond(isNot(empty),
                    (keys: string) => { throw ['type field with extra keys', keys]},
                    identity))); // TODO replace with nop
    }
}