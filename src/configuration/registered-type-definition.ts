import {assertFieldsAreValid} from "./util";

/**
 * TypeDefinition, as used in TypeRegistry
 *
 * @author Daniel de Oliveira
 */
export interface RegisteredTypeDefinition {

    color?: string,

    // one of these is necessary
    parent?: string,
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
    positionValues?: string;
}


export type RegisteredFieldDefinitions = { [fieldName: string]: RegisteredFieldDefinition };


export module RegisteredTypeDefinition {
    
    export function assertIsValid(type: RegisteredTypeDefinition) {

        if (!type.description) throw ['type has no description', JSON.stringify(type)];
        if (type.creationDate === undefined) throw ['type has no creationDate', JSON.stringify(type)];
        if (type.createdBy === undefined) throw ['type has no createdBy', JSON.stringify(type)];

        if (type.extends && type.parent) throw ['extends and parent cannot be set at the same time'];
        if (!type.extends && !type.parent) throw ['either extends or parent must be set'];

        if (!type.fields) throw ['type has not fields', type];
        assertFieldsAreValid(type.fields);
    }
}